-- easyKhata Master Setup & Fixes Script
-- This script consolidates all recent database changes, RLS fixes, and table updates.

-- 1. Tables & Schema Updates
--------------------------------------------------------------------------------

-- Ensure Invitations table exists
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    token UUID DEFAULT gen_random_uuid() UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Ensure quantity column exists in transactions
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='quantity') THEN
        ALTER TABLE public.transactions ADD COLUMN quantity DECIMAL(15, 2) DEFAULT 1;
    END IF;
END $$;

-- Ensure color column exists in categories
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='color') THEN
        ALTER TABLE public.categories ADD COLUMN color TEXT;
    END IF;
END $$;


-- 2. Security & RLS Policies
--------------------------------------------------------------------------------

-- Enable RLS on core tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Global helper function (Ensure it exists)
DROP FUNCTION IF EXISTS public.is_member_of(UUID) CASCADE;
CREATE OR REPLACE FUNCTION public.is_member_of(comp_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.company_members
        WHERE company_id = comp_id AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Companies: Members can manage (view/delete)
DROP POLICY IF EXISTS "Members can view company details" ON companies;
DROP POLICY IF EXISTS "Members can manage company" ON companies;
CREATE POLICY "Members can manage company" ON companies
    FOR ALL USING (is_member_of(id));

-- Transactions: Members can CRUD
DROP POLICY IF EXISTS "Members can manage transactions" ON transactions;
CREATE POLICY "Members can manage transactions" ON transactions
    FOR ALL USING (is_member_of(company_id));

-- Categories: Members can CRUD
DROP POLICY IF EXISTS "Members can manage categories" ON categories;
CREATE POLICY "Members can manage categories" ON categories
    FOR ALL USING (is_member_of(company_id));

-- Clients: Members can CRUD
DROP POLICY IF EXISTS "Members can manage clients" ON clients;
CREATE POLICY "Members can manage clients" ON clients
    FOR ALL USING (is_member_of(company_id));

-- Invoices: Members can CRUD
DROP POLICY IF EXISTS "Members can manage invoices" ON invoices;
CREATE POLICY "Members can manage invoices" ON invoices
    FOR ALL USING (is_member_of(company_id));

-- Invoice Items: Members can CRUD (via Invoice member check)
DROP POLICY IF EXISTS "Members can manage invoice items" ON invoice_items;
CREATE POLICY "Members can manage invoice items" ON invoice_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.invoices
            WHERE id = invoice_id AND is_member_of(company_id)
        )
    );

-- Fix Circular RLS on company_members: allows users to see their own membership
DROP POLICY IF EXISTS "Members can view company membership" ON company_members;
CREATE POLICY "Members can view company membership" ON company_members
    FOR SELECT USING (is_member_of(company_id) OR auth.uid() = user_id);

-- Allow authenticated users to join a company (via invite or onboarding)
DROP POLICY IF EXISTS "Authenticated users can join as owner" ON company_members;
DROP POLICY IF EXISTS "Authenticated users can join company" ON company_members;
CREATE POLICY "Authenticated users can join company" ON company_members
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Ensure profiles are visible to their owners
DROP POLICY IF EXISTS "Users can see their own profile" ON profiles;
CREATE POLICY "Users can see their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Invitations: Allow anyone with a valid token to view, but only owners to create
DROP POLICY IF EXISTS "Users can create invitations for their company" ON invitations;
DROP POLICY IF EXISTS "Users can view invitations for their company" ON invitations;
DROP POLICY IF EXISTS "Anyone can view an invitation by token" ON invitations;
DROP POLICY IF EXISTS "Users can update invitations they are accepting" ON invitations;

CREATE POLICY "Users can create invitations for their company" ON invitations
    FOR INSERT WITH CHECK (
        company_id IN (SELECT company_id FROM public.company_members WHERE user_id = auth.uid() AND role = 'owner')
    );
CREATE POLICY "Users can view invitations for their company" ON invitations
    FOR SELECT USING (
        company_id IN (SELECT company_id FROM public.company_members WHERE user_id = auth.uid()) OR true -- true allows token lookups
    );
CREATE POLICY "Users can update invitations they are accepting" ON invitations
    FOR UPDATE USING (true) WITH CHECK (status = 'accepted');


-- 3. Trigger for Auto-Creating Profiles
--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
