-- FatakPay TMS Database Schema Setup for Neon PostgreSQL
-- Run this script in your Neon database console or via psql

-- Create required schemas for multi-tenant architecture
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS ai;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS system;

-- Grant permissions to the database user
-- Replace 'your_username' with your actual Neon database username
-- GRANT ALL PRIVILEGES ON SCHEMA identity TO your_username;
-- GRANT ALL PRIVILEGES ON SCHEMA core TO your_username;
-- GRANT ALL PRIVILEGES ON SCHEMA ai TO your_username;
-- GRANT ALL PRIVILEGES ON SCHEMA audit TO your_username;
-- GRANT ALL PRIVILEGES ON SCHEMA system TO your_username;
-- GRANT ALL PRIVILEGES ON SCHEMA public TO your_username;

-- Set default search path (this will be overridden in Django settings)
-- ALTER USER your_username SET search_path = identity,core,ai,audit,system,public;

COMMENT ON SCHEMA identity IS 'User accounts, authentication, roles';
COMMENT ON SCHEMA core IS 'Main business logic - tickets, departments, etc.';
COMMENT ON SCHEMA ai IS 'AI engine models and data';
COMMENT ON SCHEMA audit IS 'Audit logs and tracking';
COMMENT ON SCHEMA system IS 'System configuration and metadata';