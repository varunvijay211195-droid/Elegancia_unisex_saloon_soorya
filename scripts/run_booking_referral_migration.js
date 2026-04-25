const { Client } = require('pg');

const sql = `
-- Add referral_code to bookings table if it doesn't exist
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- Notify PostgREST to reload the schema cache so API calls succeed immediately
NOTIFY pgrst, 'reload schema';
`;

const connectionString = 'postgresql://postgres.mbvvsdlixtabnwvikqom:Eligancia%402026%23Secure@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres';
const client = new Client({ connectionString });

client.connect().then(() => {
    return client.query(sql);
}).then(() => {
    console.log('✅ Successfully applied booking referral migration and reloaded schema cache.');
    return client.end();
}).catch(e => {
    console.error('Error:', e);
    client.end();
});
