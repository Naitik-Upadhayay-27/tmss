-- ─────────────────────────────────────────────────────────────────────────────
-- FatakPay TMS — PostgreSQL Schema Init
-- Run this ONCE on your PostgreSQL server before running Django migrations.
--
-- Usage:
--   psql -U postgres -d fatakpay_tms -f scripts/init_db.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create the database (run as superuser if it doesn't exist yet)
-- CREATE DATABASE fatakpay_tms ENCODING 'UTF8' LC_COLLATE 'en_US.UTF-8' LC_CTYPE 'en_US.UTF-8';

-- 2. Create application user (change password)
-- CREATE USER fatakpay_app WITH PASSWORD 'change_me';

-- 3. Create schemas
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS ai;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS system;

-- 4. Grant schema usage + table privileges to app user
GRANT USAGE, CREATE ON SCHEMA identity TO fatakpay_app;
GRANT USAGE, CREATE ON SCHEMA core     TO fatakpay_app;
GRANT USAGE, CREATE ON SCHEMA ai       TO fatakpay_app;
GRANT USAGE, CREATE ON SCHEMA audit    TO fatakpay_app;
GRANT USAGE, CREATE ON SCHEMA system   TO fatakpay_app;

-- Allow app user to create/alter tables in all schemas (needed for migrate)
ALTER DEFAULT PRIVILEGES IN SCHEMA identity GRANT ALL ON TABLES    TO fatakpay_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA identity GRANT ALL ON SEQUENCES TO fatakpay_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA core     GRANT ALL ON TABLES    TO fatakpay_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA core     GRANT ALL ON SEQUENCES TO fatakpay_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA ai       GRANT ALL ON TABLES    TO fatakpay_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA ai       GRANT ALL ON SEQUENCES TO fatakpay_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA audit    GRANT ALL ON TABLES    TO fatakpay_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA audit    GRANT ALL ON SEQUENCES TO fatakpay_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA system   GRANT ALL ON TABLES    TO fatakpay_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA system   GRANT ALL ON SEQUENCES TO fatakpay_app;

-- 5. Set default search_path for the app user
--    This means unqualified table names resolve in this order
ALTER ROLE fatakpay_app SET search_path TO identity, core, ai, audit, system, public;

-- ─────────────────────────────────────────────────────────────────────────────
-- Schema → Table mapping (for reference)
-- ─────────────────────────────────────────────────────────────────────────────
--
-- identity  → users, django_session, token_blacklist_*
-- core      → tickets, comments, attachments, departments,
--             insurance_fields, internal_fields
-- ai        → analysis_cache, training_feedback, request_log
-- audit     → audit_logs, notifications, email_logs
-- system    → django_*, auth_*, django_celery_*, django_content_type,
--             django_migrations
-- ─────────────────────────────────────────────────────────────────────────────
