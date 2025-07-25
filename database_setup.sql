-- Create the database
CREATE DATABASE IF NOT EXISTS distributor_db;
USE distributor_db;

-- Create retailers table
CREATE TABLE IF NOT EXISTS retailers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    opening_balance DECIMAL(10,2) DEFAULT 0.00,
    contact_number VARCHAR(20) NOT NULL,
    final_balance DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id VARCHAR(36) PRIMARY KEY,
    retailer_id VARCHAR(36) NOT NULL,
    retailer_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    purchase_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    purchase_date DATE,
    final_balance DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (retailer_id) REFERENCES retailers(id) ON DELETE CASCADE
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(36) PRIMARY KEY,
    retailer_id VARCHAR(36) NOT NULL,
    retailer_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    address TEXT,
    amount_given DECIMAL(10,2) NOT NULL,
    final_balance DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    payment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (retailer_id) REFERENCES retailers(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_retailers_name_contact ON retailers(name, contact_number);
CREATE INDEX idx_purchases_retailer_id ON purchases(retailer_id);
CREATE INDEX idx_payments_retailer_id ON payments(retailer_id);
CREATE INDEX idx_purchases_date ON purchases(purchase_date);
CREATE INDEX idx_payments_date ON payments(payment_date); 