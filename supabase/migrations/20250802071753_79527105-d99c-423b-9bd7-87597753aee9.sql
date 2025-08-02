-- Add shared_code column to orders table for shared delivery
ALTER TABLE public.orders 
ADD COLUMN shared_code TEXT UNIQUE;

-- Create function to generate shared codes
CREATE OR REPLACE FUNCTION generate_shared_code() 
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate shared code
CREATE OR REPLACE FUNCTION set_shared_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.shared_code IS NULL THEN
        NEW.shared_code := generate_shared_code();
        -- Ensure uniqueness
        WHILE EXISTS (SELECT 1 FROM orders WHERE shared_code = NEW.shared_code) LOOP
            NEW.shared_code := generate_shared_code();
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_shared_code
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION set_shared_code();