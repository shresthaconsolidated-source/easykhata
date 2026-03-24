-- Migration: Add AR/AP and Inventory Support

-- 1. Create Parties Table (Customers & Suppliers for AR/AP)
CREATE TABLE IF NOT EXISTS public.parties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('customer', 'supplier', 'both')),
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can manage parties" ON public.parties
    FOR ALL USING (public.is_member_of(company_id));

-- 2. Create Inventory Items Table
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sku TEXT,
    price DECIMAL(15, 2), -- Default selling price
    cost DECIMAL(15, 2), -- Default purchase cost
    stock_quantity DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can manage inventory items" ON public.inventory_items
    FOR ALL USING (public.is_member_of(company_id));

-- 3. Update Transactions Table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='party_id') THEN
        ALTER TABLE public.transactions ADD COLUMN party_id UUID REFERENCES public.parties(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='inventory_item_id') THEN
        ALTER TABLE public.transactions ADD COLUMN inventory_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='payment_status') THEN
        ALTER TABLE public.transactions ADD COLUMN payment_status TEXT DEFAULT 'paid' CHECK (payment_status IN ('paid', 'unpaid', 'partial'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='due_date') THEN
        ALTER TABLE public.transactions ADD COLUMN due_date DATE;
    END IF;
END $$;

-- 4. Inventory Stock Update Trigger
CREATE OR REPLACE FUNCTION public.update_inventory_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- If it's an insert
    IF TG_OP = 'INSERT' AND NEW.inventory_item_id IS NOT NULL THEN
        IF NEW.type = 'income' THEN
            -- Selling inventory reduces stock
            UPDATE public.inventory_items 
            SET stock_quantity = stock_quantity - NEW.quantity
            WHERE id = NEW.inventory_item_id;
        ELSIF NEW.type = 'expense' THEN
            -- Purchasing inventory increases stock
            UPDATE public.inventory_items 
            SET stock_quantity = stock_quantity + NEW.quantity
            WHERE id = NEW.inventory_item_id;
        END IF;
    END IF;

    -- If it's an update (e.g. changing quantity or item)
    IF TG_OP = 'UPDATE' THEN
        -- Revert old transaction effect
        IF OLD.inventory_item_id IS NOT NULL THEN
            IF OLD.type = 'income' THEN
                UPDATE public.inventory_items SET stock_quantity = stock_quantity + OLD.quantity WHERE id = OLD.inventory_item_id;
            ELSIF OLD.type = 'expense' THEN
                UPDATE public.inventory_items SET stock_quantity = stock_quantity - OLD.quantity WHERE id = OLD.inventory_item_id;
            END IF;
        END IF;
        -- Apply new transaction effect
        IF NEW.inventory_item_id IS NOT NULL THEN
            IF NEW.type = 'income' THEN
                UPDATE public.inventory_items SET stock_quantity = stock_quantity - NEW.quantity WHERE id = NEW.inventory_item_id;
            ELSIF NEW.type = 'expense' THEN
                UPDATE public.inventory_items SET stock_quantity = stock_quantity + NEW.quantity WHERE id = NEW.inventory_item_id;
            END IF;
        END IF;
    END IF;

    -- If it's a delete
    IF TG_OP = 'DELETE' AND OLD.inventory_item_id IS NOT NULL THEN
        IF OLD.type = 'income' THEN
            UPDATE public.inventory_items SET stock_quantity = stock_quantity + OLD.quantity WHERE id = OLD.inventory_item_id;
        ELSIF OLD.type = 'expense' THEN
            UPDATE public.inventory_items SET stock_quantity = stock_quantity - OLD.quantity WHERE id = OLD.inventory_item_id;
        END IF;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_transaction_inventory_change ON public.transactions;
CREATE TRIGGER on_transaction_inventory_change
    AFTER INSERT OR UPDATE OR DELETE ON public.transactions
    FOR EACH ROW EXECUTE PROCEDURE public.update_inventory_stock();
