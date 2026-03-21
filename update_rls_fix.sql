-- Allow all authenticated users to discover profiles for direct team invites and list displays
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);

-- Allow users to leave a company, OR owners to remove any member from their company
DROP POLICY IF EXISTS "Members can leave or owners can remove" ON public.company_members;
CREATE POLICY "Members can leave or owners can remove" ON public.company_members FOR DELETE USING (
  auth.uid() = user_id OR
  company_id IN (
    SELECT company_id FROM public.company_members WHERE user_id = auth.uid() AND role = 'owner'
  )
);
