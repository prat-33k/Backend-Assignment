const upload = require('../util/uploadCSVUtil.js');
const path= require('path');
const uploadFileModel = require("../models/UploadFileModel.js");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const { parse } = require("csv-parse");
const Jimp = require('jimp');
const axios = require('axios');
const CSV_SUCCESS = 1;
const CSV_FAILURE = 2;
const CSV_PROCESSING = 0;

class UploadFileController {
	constructor(){
        this.UploadFileModelObj = new uploadFileModel();
    }
    /**
    * upload csv file by code
    * @method UploadCSVFile
    * @return object
    */
    async UploadCSVFile(req, res){

        let requestBody = req.files;
        let resultData = {};
        if(requestBody == "" || requestBody == undefined){
            resultData.status = "400";
            resultData.mssg = "No file uploaded. Please upload a CSV file.";
            return res.status(400).send(resultData);
        }

        if(path.extname(req.files[0].originalname) != ".csv"){
            resultData.status = "400";
            resultData.mssg = "Please upload a CSV file only.";
            fs.unlinkSync(req.files[0].path);
            return res.status(400).send(resultData);
        }

        if (requestBody.length > 1) {
            resultData.status = "400";
            resultData.mssg = "Only one CSV file is allowed.";
            requestBody.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
            return res.status(400).send(resultData);
        }

        let requestId = uuidv4();
        requestId = requestId.replace(/-/g, '').slice(0, 12);
        let csvFileName = req.files[0].originalname;
        let insertedRows = await this.UploadFileModelObj.insertProcessingRequestId(requestId, csvFileName, CSV_PROCESSING);
        if(insertedRows){
            const results = [];
            fs.createReadStream(requestBody[0].path)
              .pipe(parse({ delimiter: ",", from_line: 2 }))
              .on('data', (data) => results.push(data))
              .on('end', async () => {
                try {
                  for (const row of results) {
                    let insertedProductId = await this.UploadFileModelObj.insertIntoProductTable(requestId,row[1]);
                    var storedPath = "";
                    if(insertedProductId){
                        const urls = row[2].includes(',') ? row[2].split(',') : [row[2]];
                        for (let url of urls) {
                            let response = await axios({ url, responseType: 'arraybuffer' });
                            let imageBuffer = Buffer.from(response.data, 'binary');
                            let image = await Jimp.read(imageBuffer);
                            let outputFilePath = await new Promise((resolve, reject) => {
                                image.resize(Jimp.AUTO, 800)
                                    .quality(50)
                                    .getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
                                        if (err) return reject(err);
                                        let originalFilename = path.basename(url);
                                        let compressedFilename = 'comp-' + Date.now() + "-" + originalFilename;
                                        let root = path.dirname(require.main.filename);
                                        let outputDir = path.join(root, "src/uploads/compressedImages/");
                                        let outputFilePath = path.join(outputDir, compressedFilename);
                                        fs.writeFileSync(outputFilePath, buffer);
                                        storedPath = `${req.protocol}://${req.get('host')}/uploads/compressedImages/${compressedFilename}`;
                                        resolve(storedPath);
                                    });
                            });
                            let insertedProductRow = await this.UploadFileModelObj.insertIntoProductImages(insertedProductId, url.trim(), storedPath);
                        }
                    }
                }
                    await this.UploadFileModelObj.updateProcessingRequestId(CSV_SUCCESS,requestId);//success case
                    resultData.status = "200";
                    resultData.mssg = "Csv file processed successfully."
                    let finalResponse = {};
                    finalResponse.request_id = requestId;
                    resultData.data = finalResponse;
                    return res.status(200).send(resultData);
                } catch (error) {
                    console.log(error);
                }
            });
        }else{
            await this.UploadFileModelObj.updateProcessingRequestId(CSV_FAILURE,requestId); //failue case
        }
    }

    /**
    * upload csv file by code
    * @method UploadCSVFile
    * @return object
    */
    async checkCSVStatus(req, res){
        let requestBody = req.body.request_id;
        let resultData = {};
        if(requestBody == "" || requestBody == undefined){
            resultData.status = "400";
            resultData.mssg = "Please provide request_id.";
            return res.status(400).send(resultData);
        }
        let status = await this.UploadFileModelObj.checkProcessingStatus(requestBody);
        if(status == CSV_SUCCESS){
            resultData.status = "200";
            resultData.mssg = "Successfull";
            let finaldata = await this.UploadFileModelObj.getProcessingData(requestBody);
            resultData.data = finaldata;
            return res.status(200).send(resultData);

        }else if(status == CSV_FAILURE || status ==  null){
            resultData.status = "200";
            resultData.mssg = "Failure or no record exists.";
            return res.status(200).send(resultData);
        }
    }


    handleFileUpload () {
        return upload.any();
    }
}
module.exports = UploadFileController;

