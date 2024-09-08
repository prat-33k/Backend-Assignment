const connectToDatabase = require('../util/db_connection.js');

/**
 * UploadFileModel Model
 */
class UploadFileModel {
    constructor() {
        this.connection = connectToDatabase();
    }

    /** 
     * Insert processing request ID and file name into the database
     * 
     * @method insertProcessingRequestId
     * @param {string} requestId - Unique request ID
     * @param {string} csvFileName - Name of the uploaded CSV file
     * @return {Promise} - Resolves with the result of the database insertion
     */
    insertProcessingRequestId(requestId, csvFileName, status) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO csv_processing_requests (request_id, file_name, status) VALUES (?, ?, ?)';
            this.connection.query(query, [requestId, csvFileName, status], (error, result) => {
                if (error) {
                    console.error("Error inserting processing request:", error);
                    reject(error);
                } else {
                    console.log("inserted successfully row", result.affectedRows);
                    resolve(result.affectedRows);
                }
            });
        });
    }

    /** 
     * Insert processing request ID and product_name into the database
     * 
     * @method insertIntoProductTable
     * @param {string} requestId - Unique request ID
     * @param {string} - product_name
     * @return {Promise} - Resolves with the result of the database insertion
     */
    insertIntoProductTable(requestId, product_name) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO csv_products (request_id, product_name) VALUES (?, ?)';
            this.connection.query(query, [requestId, product_name], (error, result) => {
                if (error) {
                    console.error("Error inserting processing request:", error);
                    reject(error);
                } else {
                    console.log("inserted successfully row", result.insertId);
                    resolve(result.insertId);
                }
            });
        });
    }

    /** 
     * Insert processing insertedProductId and product_url and compressed_url into the database
     * 
     * @method insertIntoProductImages
     * @param {int} insertedProductId - Unique product ID
     * @param {string} product_url
     * @return {Promise} - Resolves with the result of the database insertion
     */
    insertIntoProductImages(insertedProductId, product_url, compressed_url) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO csv_product_images (product_id, product_image_url, product_compressed_image_url) VALUES (?, ?, ?)';
            this.connection.query(query, [insertedProductId, product_url, compressed_url], (error, result) => {
                if (error) {
                    console.error("Error inserting processing request:", error);
                    reject(error);
                } else {
                    console.log("inserted successfully row", result.affectedRows);
                    resolve(result.affectedRows);
                }
            });
        });
    }

    /** 
    * update processing insertedProductId, product_url, compressed_url into the database
    * 
    * @method updateProcessingRequestId
    * @param {string} request_id - Unique request ID
    * @param {int} status
    * @return {Promise} - Resolves with the result of the database insertion
    */
    updateProcessingRequestId(status, request_id) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE csv_processing_requests SET status = ? where request_id = ?';
            this.connection.query(query, [status, request_id], (error, result) => {
                if (error) {
                    console.error("Error updatin processing request:", error);
                    reject(error);
                } else {
                    console.log("updated successfully row", result.affectedRows);
                    resolve(result.affectedRows);
                }
            });
        });
    }


    /** 
    * checkProcessingStatus requestBody into the database
    * 
    * @method updateProcessingRequestId
    * @param {string} request_id - Unique request ID
    * @return {Promise} - Resolves with the result of the database insertion
    */
    checkProcessingStatus(request_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT count(*) as countProcess,status FROM csv_processing_requests where request_id = ?';
            this.connection.query(query, [request_id], (error, result) => {
                if (error) {
                    console.error("Error selected data processing request:", error);
                    reject(result[0].countProcess);
                }else{
                    resolve(result[0].status);
                }
            });
        });
    }

    /** 
    * getProcessingData requestBody into the database
    * 
    * @method getProcessingData
    * @param {string} request_id - Unique request ID
    * @return {Promise} - Resolves with the result of the database insertion
    */
    getProcessingData(request_id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT pr.request_id, cp.product_name, cpi.product_image_url, cpi.product_compressed_image_url
                FROM csv_processing_requests AS pr
                INNER JOIN csv_products AS cp ON pr.request_id = cp.request_id
                INNER JOIN csv_product_images AS cpi ON cp.id = cpi.product_id
                WHERE pr.request_id = ?
            `;
            this.connection.query(query, [request_id], (error, result) => {
                if (error) {
                    console.error("Error selecting data processing request:", error);
                    reject(error);
                }
                if (result.length > 0) {
                    console.log("Selected data successfully:", result);
                    resolve(result);
                } else {
                    console.log("No matching record found.");
                    resolve(null);
                }
            });
        });
    }

}
module.exports = UploadFileModel;
