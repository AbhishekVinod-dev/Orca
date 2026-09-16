-- Fisherman SMS alert feature: contact registry + delivery log.
-- No migration tool in this repo (raw psycopg2, see services/db_connection_service.py) --
-- run manually against the same DB: psql "$DB_URL" -f scripts/migrations/001_fisherman_sms_tables.sql

CREATE TABLE IF NOT EXISTS fisherman_contact (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(15) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    preferred_lang VARCHAR(5) NOT NULL DEFAULT 'en',
    coastal_zone_id VARCHAR(60) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fisherman_contact_zone ON fisherman_contact (coastal_zone_id);

CREATE TABLE IF NOT EXISTS sms_delivery_log (
    id SERIAL PRIMARY KEY,
    alert_id VARCHAR(60) NOT NULL,
    numbers TEXT[] NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    provider VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sms_delivery_log_alert ON sms_delivery_log (alert_id);
