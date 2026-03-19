-- SQL to enable the raw query console in your settings page
-- Run this in your Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.execute_sql_query(query_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Use SECURITY DEFINER to run with elevated privileges (CAUTION)
AS $$
DECLARE
    result JSONB;
BEGIN
    -- This is EXTREMELY DANGEROUS and should be restricted in production
    -- For dev/personal use only
    EXECUTE query_text INTO result;
    RETURN result;
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('error', SQLERRM);
END;
$$;
