-- 1. Fix the circular RLS on company_members
-- This ensures you can always see your own membership record 
-- even if you aren't yet "officially" recognized by the helper function.

DROP POLICY IF EXISTS "Members can view company membership" ON company_members;

CREATE POLICY "Members can view company membership" ON company_members
  FOR SELECT USING (is_member_of(company_id) OR auth.uid() = user_id);

-- 2. Ensure users can join a company as a member (not just owner)
DROP POLICY IF EXISTS "Authenticated users can join as owner" ON company_members;

CREATE POLICY "Authenticated users can join company" ON company_members
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
