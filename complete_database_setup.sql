-- ========================================================================================
-- easyKhata Master Consolidated Database Setup
-- Run this script in the Supabase SQL Editor to initialize the complete database schema.
-- ========================================================================================

-- 1. DROP EXISTING SCHEMA (Optional: Uncomment to reset database completely)
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;
-- GRANT ALL ON SCHEMA public TO postgres;
-- GRANT ALL ON SCHEMA public TO public;

-- ========================================================================================
-- 2. TABLES CREATION
-- ========================================================================================

-- Create a table for companies
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  pan TEXT,
  currency TEXT NOT NULL DEFAULT 'NPR',
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create a table for user profiles (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create a table for company memberships
CREATE TABLE public.company_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, user_id)
);

-- Create a table for clients
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  pan TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create a table for categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create a table for transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(15, 2) NOT NULL,
  quantity DECIMAL(15, 2) DEFAULT 1,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  note TEXT,
  raw_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create a table for invoices
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_address TEXT,
  client_pan TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  subtotal DECIMAL(15, 2) NOT NULL DEFAULT 0,
  discount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  total DECIMAL(15, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, invoice_number)
);

-- Create a table for invoice items
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(15, 2) NOT NULL DEFAULT 1,
  rate DECIMAL(15, 2) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL
);

-- Create a table for invitations
CREATE TABLE public.invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    token UUID DEFAULT gen_random_uuid() UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ========================================================================================
-- 3. ROW LEVEL SECURITY (RLS) Configuration
-- ========================================================================================

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

-- Global helper function
CREATE OR REPLACE FUNCTION public.is_member_of(comp_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.company_members
        WHERE company_id = comp_id AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Companies: Members can manage (view/delete), creator can view, and authenticated can create
CREATE POLICY "Members can view company" ON public.companies FOR SELECT USING (
    is_member_of(id) OR created_by = auth.uid()
);
CREATE POLICY "Members can update company" ON public.companies FOR UPDATE USING (is_member_of(id));
CREATE POLICY "Members can delete company" ON public.companies FOR DELETE USING (is_member_of(id));
CREATE POLICY "Authenticated users can create companies" ON public.companies
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Transactions: Members can CRUD
CREATE POLICY "Members can manage transactions" ON public.transactions
    FOR ALL USING (is_member_of(company_id));

-- Categories: Members can CRUD
CREATE POLICY "Members can manage categories" ON public.categories
    FOR ALL USING (is_member_of(company_id));

-- Clients: Members can CRUD
CREATE POLICY "Members can manage clients" ON public.clients
    FOR ALL USING (is_member_of(company_id));

-- Invoices: Members can CRUD
CREATE POLICY "Members can manage invoices" ON public.invoices
    FOR ALL USING (is_member_of(company_id));

-- Invoice Items: Members can CRUD (via Invoice member check)
CREATE POLICY "Members can manage invoice items" ON public.invoice_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.invoices
            WHERE id = invoice_id AND is_member_of(company_id)
        )
    );

-- Company Members: View own membership or if member of company
CREATE POLICY "Members can view company membership" ON public.company_members
    FOR SELECT USING (is_member_of(company_id) OR auth.uid() = user_id);
-- Allow authenticated users to join a company (via invite or onboarding)
CREATE POLICY "Authenticated users can join company" ON public.company_members
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Profiles: Users can see and update their own profile
CREATE POLICY "Users can see their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Invitations: Allow anyone with a valid token to view, but only owners to create
CREATE POLICY "Users can create invitations for their company" ON public.invitations
    FOR INSERT WITH CHECK (
        company_id IN (SELECT company_id FROM public.company_members WHERE user_id = auth.uid() AND role = 'owner')
    );
CREATE POLICY "Users can view invitations for their company" ON public.invitations
    FOR SELECT USING (
        company_id IN (SELECT company_id FROM public.company_members WHERE user_id = auth.uid()) OR true
    );
CREATE POLICY "Users can update invitations they are accepting" ON public.invitations
    FOR UPDATE USING (true) WITH CHECK (status = 'accepted');

-- ========================================================================================
-- 4. TRIGGERS
-- ========================================================================================

-- Trigger for Auto-Creating Profiles from Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to prevent duplicates
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger mapping to public.handle_new_user()
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- END OF SCRIPT --
