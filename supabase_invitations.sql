CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    token UUID DEFAULT gen_random_uuid() UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS policies
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Company owners can insert invitations
CREATE POLICY "Users can create invitations for their company" ON public.invitations
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT company_id FROM public.company_members WHERE user_id = auth.uid() AND role = 'owner'
        )
    );

-- Company members can view their company's invitations
CREATE POLICY "Users can view invitations for their company" ON public.invitations
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM public.company_members WHERE user_id = auth.uid()
        )
    );

-- Unauthenticated users or logged-in users need to be able to fetch the invitation by token
CREATE POLICY "Anyone can view an invitation by token" ON public.invitations
    FOR SELECT USING (true);

-- Allow invited users to update status to accepted once they log in
CREATE POLICY "Users can update invitations they are accepting" ON public.invitations
    FOR UPDATE USING (true) WITH CHECK (status = 'accepted');
