-- 1. Ensure the btree_gist extension is available (must be run as superuser or on public schema)
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 2. Function to apply the constraint to all existing tenant schemas
DO $$
DECLARE
    schema_record RECORD;
    schema_name TEXT;
    sql TEXT;
BEGIN
    FOR schema_record IN 
        SELECT schema_name AS name
        FROM information_schema.schemata 
        WHERE schema_name LIKE 'tenant_%'
    LOOP
        schema_name := schema_record.name;
        
        -- Check if the table exists in this schema
        IF EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = schema_name 
            AND table_name = 'bookings'
        ) THEN
            -- Check if constraint already exists
            IF NOT EXISTS (
                SELECT 1 FROM pg_constraint 
                WHERE conname = 'exclude_overlapping_bookings' 
                AND connamespace = (SELECT oid FROM pg_namespace WHERE nspname = schema_name)
            ) THEN
                sql := format('ALTER TABLE %I.bookings ADD CONSTRAINT exclude_overlapping_bookings EXCLUDE USING gist ( staff_id WITH =, tstzrange(starts_at, ends_at) WITH && ) WHERE (status NOT IN (''CANCELLED'', ''NO_SHOW''));', schema_name);
                EXECUTE sql;
                RAISE NOTICE 'Added constraint to %.bookings', schema_name;
            ELSE
                RAISE NOTICE 'Constraint already exists on %.bookings', schema_name;
            END IF;
        END IF;
    END LOOP;
END;
$$;
