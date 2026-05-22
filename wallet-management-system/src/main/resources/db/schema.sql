-- Wallet Management System Database Schema
-- PostgreSQL

-- Create database
CREATE DATABASE wallet_management_system;
\c wallet_management_system;

-- Currencies table
CREATE TABLE currencies (
    id BIGSERIAL PRIMARY KEY,
    currency_code VARCHAR(10) NOT NULL UNIQUE,
    currency_name VARCHAR(50) NOT NULL
);

-- Account Types table
CREATE TABLE account_types (
    id BIGSERIAL PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE
);

-- Groups table
CREATE TABLE groups (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Permissions table
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Group Permissions mapping table
CREATE TABLE group_permissions (
    group_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (group_id, permission_id),
    CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    CONSTRAINT fk_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    group_id BIGINT,
    CONSTRAINT fk_user_group FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
);

-- Accounts table
CREATE TABLE accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    account_type_id BIGINT NOT NULL,
    currency_id BIGINT NOT NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    CONSTRAINT fk_account_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_account_type FOREIGN KEY (account_type_id) REFERENCES account_types(id),
    CONSTRAINT fk_account_currency FOREIGN KEY (currency_id) REFERENCES currencies(id)
);

-- Indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_group_id ON users(group_id);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_group_permissions_group_id ON group_permissions(group_id);
CREATE INDEX idx_group_permissions_permission_id ON group_permissions(permission_id);

-- Insert default data

-- Currencies
INSERT INTO currencies (currency_code, currency_name) VALUES
('INR', 'Indian Rupee'),
('USD', 'United States Dollar'),
('EUR', 'Euro'),
('GBP', 'British Pound Sterling');

-- Account Types
INSERT INTO account_types (type_name) VALUES
('savings'),
('business'),
('current'),
('wallet');

-- Permissions
INSERT INTO permissions (name) VALUES
('READ'),
('WRITE'),
('DELETE'),
('ADMIN');

-- Groups
INSERT INTO groups (name) VALUES
('ADMIN'),
('USER');

-- Assign permissions to ADMIN group (all permissions)
INSERT INTO group_permissions (group_id, permission_id)
SELECT g.id, p.id FROM groups g, permissions p WHERE g.name = 'ADMIN';

-- Assign READ permission to USER group
INSERT INTO group_permissions (group_id, permission_id)
SELECT g.id, p.id FROM groups g, permissions p WHERE g.name = 'USER' AND p.name = 'READ';
