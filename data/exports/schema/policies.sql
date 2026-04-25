-- Row Level Security Policies
-- Enable RLS on public.bookings
ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all bookings." ON "public"."bookings"
    FOR ALL
    TO ['public']
    USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
;

-- Enable RLS on public.bookings
ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create a booking." ON "public"."bookings"
    FOR INSERT
    TO ['public']
    WITH CHECK (true)
;

-- Enable RLS on public.bookings
ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own bookings." ON "public"."bookings"
    FOR SELECT
    TO ['public']
    USING (((auth.uid() = user_id) OR (user_id IS NULL)))
;

-- Enable RLS on public.contact_messages
ALTER TABLE "public"."contact_messages" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view contact messages" ON "public"."contact_messages"
    FOR SELECT
    TO ['public']
    USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
;

-- Enable RLS on public.contact_messages
ALTER TABLE "public"."contact_messages" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact messages" ON "public"."contact_messages"
    FOR INSERT
    TO ['public']
    WITH CHECK (true)
;

-- Enable RLS on public.gallery
ALTER TABLE "public"."gallery" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage gallery." ON "public"."gallery"
    FOR ALL
    TO ['public']
    USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
;

-- Enable RLS on public.gallery
ALTER TABLE "public"."gallery" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public gallery is viewable by everyone." ON "public"."gallery"
    FOR SELECT
    TO ['public']
    USING (true)
;

-- Enable RLS on public.instagram_posts
ALTER TABLE "public"."instagram_posts" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view instagram posts" ON "public"."instagram_posts"
    FOR SELECT
    TO ['public']
    USING (true)
;

-- Enable RLS on public.loyalty_programs
ALTER TABLE "public"."loyalty_programs" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage loyalty programs" ON "public"."loyalty_programs"
    FOR ALL
    TO ['public']
    USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
;

-- Enable RLS on public.loyalty_programs
ALTER TABLE "public"."loyalty_programs" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view loyalty programs" ON "public"."loyalty_programs"
    FOR SELECT
    TO ['public']
    USING (true)
;

-- Enable RLS on public.notifications
ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all notifications." ON "public"."notifications"
    FOR ALL
    TO ['public']
    USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
;

-- Enable RLS on public.notifications
ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications." ON "public"."notifications"
    FOR SELECT
    TO ['public']
    USING (((auth.uid() = user_id) OR (user_id IS NULL)))
;

-- Enable RLS on public.profiles
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles"
    FOR SELECT
    TO ['public']
    USING (true)
;

-- Enable RLS on public.profiles
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own profile." ON "public"."profiles"
    FOR INSERT
    TO ['public']
    WITH CHECK ((auth.uid() = id))
;

-- Enable RLS on public.profiles
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can update own profile." ON "public"."profiles"
    FOR UPDATE
    TO ['public']
    USING ((auth.uid() = id))
;

-- Enable RLS on public.services
ALTER TABLE "public"."services" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage services." ON "public"."services"
    FOR ALL
    TO ['public']
    USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
;

-- Enable RLS on public.services
ALTER TABLE "public"."services" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public services are viewable by everyone." ON "public"."services"
    FOR SELECT
    TO ['public']
    USING (true)
;

-- Enable RLS on public.thank_you_notes
ALTER TABLE "public"."thank_you_notes" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage notes" ON "public"."thank_you_notes"
    FOR ALL
    TO ['public']
    USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
;

-- Enable RLS on public.thank_you_notes
ALTER TABLE "public"."thank_you_notes" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notes" ON "public"."thank_you_notes"
    FOR SELECT
    TO ['public']
    USING ((auth.uid() = recipient_id))
;

-- Enable RLS on public.tier_benefits
ALTER TABLE "public"."tier_benefits" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage tier benefits" ON "public"."tier_benefits"
    FOR ALL
    TO ['public']
    USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
;

-- Enable RLS on public.tier_benefits
ALTER TABLE "public"."tier_benefits" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view tier benefits" ON "public"."tier_benefits"
    FOR SELECT
    TO ['public']
    USING (true)
;

