-- Database Schema for Bookkeeping App

-- 1. Tables Creation

-- Create a table for companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  pan TEXT,
  currency TEXT NOT NULL DEFAULT 'NPR',
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create a table for user profiles (linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create a table for company memberships
CREATE TABLE company_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, user_id)
);

-- Create a table for clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  pan TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create a table for categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create a table for transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(15, 2) NOT NULL,
  quantity DECIMAL(15, 2) DEFAULT 1,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  note TEXT,
  raw_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create a table for invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
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
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(15, 2) NOT NULL DEFAULT 1,
  rate DECIMAL(15, 2) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL
);

-- 2. Row Level Security (RLS) Configuration

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see and edit their own profile
CREATE POLICY "Users can see their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Helper Function: Check if user belongs to a company
CREATE OR REPLACE FUNCTION public.is_member_of(check_company_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM company_members
    WHERE company_members.company_id = check_company_id
    AND company_members.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Companies: Members can see their companies
CREATE POLICY "Members can view their companies" ON companies
  FOR SELECT USING (is_member_of(id));
CREATE POLICY "Authenticated users can create companies" ON companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owners can update their companies" ON companies
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM company_members
      WHERE company_members.company_id = id
      AND company_members.user_id = auth.uid()
      AND company_members.role = 'owner'
    )
  );

-- Company members: Members can see fellow members
CREATE POLICY "Members can view company membership" ON company_members
  FOR SELECT USING (is_member_of(company_id));
CREATE POLICY "Authenticated users can join as owner" ON company_members
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Categories: Members can manage categories for their company
CREATE POLICY "Members can view company categories" ON categories
  FOR SELECT USING (is_member_of(company_id));
CREATE POLICY "Members can manage company categories" ON categories
  FOR ALL USING (is_member_of(company_id));

-- Transactions: Members can manage transactions
CREATE POLICY "Members can view company transactions" ON transactions
  FOR SELECT USING (is_member_of(company_id));
CREATE POLICY "Members can manage company transactions" ON transactions
  FOR ALL USING (is_member_of(company_id));

-- Invoices: Members can manage invoices
CREATE POLICY "Members can view company invoices" ON invoices
  FOR SELECT USING (is_member_of(company_id));
CREATE POLICY "Members can manage company invoices" ON invoices
  FOR ALL USING (is_member_of(company_id));

-- Invoice Items: Members can manage items of company invoices
CREATE POLICY "Members can view company invoice items" ON invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_id
      AND is_member_of(invoices.company_id)
    )
  );
CREATE POLICY "Members can manage company invoice items" ON invoice_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_id
      AND is_member_of(invoices.company_id)
    )
  );

-- 3. Trigger for new user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
