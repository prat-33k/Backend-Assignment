# spyne_img

This project is a Node.js and Express.js API that connects to a MySQL database. This README will guide you through setting up the project locally on your machine.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v14.x or higher) and **npm** (v6.x or higher)
- **MySQL** (v5.7 or higher)

## Getting Started

Follow these instructions to set up and run the project locally.

### 1. Clone the Repository

Clone this repository to your local machine using the following command:

```bash
git clone https://github.com/your-username/your-repo-name.git

### 2. Install Dependencies using
npm install
in case if you dont have specific package then
npm install <package_name>;

### 3. Create a .env file in the root of the project and paste below instruction in this :
      API_PORT=9001

      DB_HOST=your_db_name
      DB_USER=your_db_user
      DB_PASSWORD=your_db_password
      DB_NAME=your_db_name
      DB_PORT=your_db_port

### 4. Set Up the MySQL Database
      CREATE TABLE csv_processing_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id VARCHAR(255) NOT NULL UNIQUE,
    file_name VARCHAR(255) NOT NULL
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=>processing, 1=>success, 2=>failed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE csv_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE csv_product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    product_image_url VARCHAR(255) NOT NULL,
    product_compressed_image_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
