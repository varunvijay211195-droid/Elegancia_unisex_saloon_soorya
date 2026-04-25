# Supabase Migration Guide — Project mbvvsdlixtabnwvikqom

## Source Details
| Property | Value |
|----------|-------|
| **Project ID** | mbvvsdlixtabnwvikqom |
| **Host** | aws-1-ap-northeast-2.pooler.supabase.com |
| **Database** | postgres |
| **User** | postgres.mbvvsdlixtabnwvikqom |
| **Region** | ap-northeast-2 (Seoul) |

---

## Schemas & Tables (6 schemas, 50+ tables)

### 1. `auth` schema — Supabase Auth System
| Table | Rows | Priority | Notes |
|-------|------|----------|-------|
| `users` | 4 | 🔴 **HIGH** | User accounts with emails, passwords, metadata |
| `identities` | 4 | 🔴 **HIGH** | OAuth/SSO identities linked to users |
| `sessions` | 10 | 🔴 **HIGH** | Active login sessions |
| `refresh_tokens` | 24 | 🔴 **HIGH** | Auth refresh tokens |
| `mfa_amr_claims` | 10 | 🟡 Medium | MFA authentication claims |
| `flow_state` | 2 | 🟡 Medium | OAuth flow states |
| `one_time_tokens` | 1 | 🟡 Medium | Email/phone verification tokens |
| `schema_migrations` | 76 | 🟢 Low | Auth schema version history |
| *(other tables)* | 0 | 🟢 Low | Empty audit, MFA, OAuth tables |

### 2. `public` schema — Application Data
| Table | Rows | Priority | Notes |
|-------|------|----------|-------|
| `services` | 8 | 🔴 **HIGH** | Salon services: Haircuts, Coloring, Bridal, Makeup, Nails, Men's Grooming, Treatments |
| `instagram_posts` | ~20+ | 🔴 **HIGH** | Instagram feed content for the salon |
| `bookings` | 5+ | 🔴 **HIGH** | Customer appointment bookings |
| `google_reviews` | 5+ | 🟡 Medium | Google review data |
| `notifications` | 5+ | 🟡 Medium | App notifications |
| `profiles` | 2+ | 🟡 Medium | User/customer profiles |
| `reward_tiers` | 3+ | 🟡 Medium | Loyalty program tiers |
| `tier_benefits` | 3+ | 🟡 Medium | Benefits per loyalty tier |
| `gallery` | 1 | 🟢 Low | Salon gallery images |
| `customer_points` | 0 | 🟢 Low | Empty — loyalty points |
| `points_transactions` | 0 | 🟢 Low | Empty — points history |
| `thank_you_notes` | 0 | 🟢 Low | Empty — customer feedback |
| `contact_messages` | 0 | 🟢 Low | Empty — contact form submissions |
| `loyalty_programs` | 0 | 🟢 Low | Empty — loyalty program config |
| `referrals` | 0 | 🟢 Low | Empty — referral tracking |

### 3. `storage` schema — File Storage
| Table | Rows | Priority | Notes |
|-------|------|----------|-------|
| `buckets` | 0 (in export) | 🔴 **HIGH** | Storage buckets config — check dashboard for bucket names |
| `objects` | 0 (in export) | 🔴 **HIGH** | Stored files — **may need manual file download/upload** |
| `migrations` | 26 | 🟢 Low | Storage schema migrations |

> ⚠️ **Storage Note**: The `storage.objects` and `storage.buckets` tables may have data but were excluded from export. You should check your Supabase Dashboard → Storage to see buckets and manually download/upload files, or use the Supabase Storage API to migrate them.

### 4. `realtime` schema — Realtime Broadcast
| Table | Rows | Priority | Notes |
|-------|------|----------|-------|
| `subscription` | 0 | 🟢 Low | Active realtime subscriptions |
| `messages` | 0 | 🟢 Low | Broadcast messages |
| `messages_YYYY_MM_DD` | 0 | 🟢 Low | Partitioned message history |
| `schema_migrations` | 1 | 🟢 Low | Realtime schema version |

### 5. `supabase_migrations` schema — Migration History
| Table | Rows | Priority | Notes |
|-------|------|----------|-------|
| `schema_migrations` | 4 | 🟢 Low | Supabase CLI migration tracking |

### 6. `vault` schema — Secrets Management
| Table | Rows | Priority | Notes |
|-------|------|----------|-------|
| `secrets` | 0 | 🟢 Low | Encrypted secrets |

---

## Migration Priority Order

### Phase 1: Critical (Do First)
1. `schema/extensions.sql` — Install required Postgres extensions
2. `schema/enums.sql` — Custom enum types
3. `schema/sequences.sql` — Auto-increment sequences
4. `schema/tables.sql` — All table structures (includes auth + public)
5. `schema/indexes.sql` — Performance indexes
6. `schema/functions.sql` — Database functions
7. `schema/views.sql` — Database views
8. `schema/triggers.sql` — Database triggers
9. `schema/policies.sql` — Row Level Security policies

### Phase 2: Core Data
10. `data/auth_users.sql` — User accounts
11. `data/auth_identities.sql` — OAuth links
12. `data/auth_sessions.sql` — Active sessions
13. `data/auth_refresh_tokens.sql` — Refresh tokens
14. `data/public_services.sql` — Salon services catalog
15. `data/public_bookings.sql` — Customer bookings
16. `data/public_instagram_posts.sql` — Social media content

### Phase 3: Supporting Data
17. `data/public_profiles.sql` — User profiles
18. `data/public_google_reviews.sql` — Reviews
19. `data/public_notifications.sql` — Notifications
20. `data/public_reward_tiers.sql` — Loyalty tiers
21. `data/public_tier_benefits.sql` — Tier benefits
22. `data/public_gallery.sql` — Gallery items

### Phase 4: Storage & Files (Manual)
23. Recreate storage buckets in new project dashboard
24. Upload files to new storage buckets (use Supabase Storage API or dashboard)

---

## How to Restore to New Project

### Option A: Using psql (if you have it)
```bash
psql "postgresql://[new-user]:[new-password]@[new-host]:5432/postgres?sslmode=require" -f exports/schema/extensions.sql
psql "postgresql://..." -f exports/schema/enums.sql
# ... run all schema files first, then data files
```

### Option B: Using Supabase SQL Editor
1. Go to your new Supabase project Dashboard → SQL Editor
2. Copy-paste contents of schema files in order (Phase 1)
3. Copy-paste contents of data files in order (Phase 2-3)

### Option C: Using Supabase CLI
```bash
# Link to new project
npx supabase link --project-ref [NEW-PROJECT-REF]

# Apply schema (run each .sql file via SQL Editor or psql)
```

---

## Important Notes

1. **Auth Passwords**: The `auth.users` table exports `encrypted_password` hashes. These should work directly in the new Supabase project since it uses the same GoTrue auth system.

2. **Row Level Security (RLS)**: The `policies.sql` file contains all RLS policies. Make sure to apply these after creating tables and before inserting data.

3. **Storage Files**: Database metadata for storage was exported, but actual file blobs are NOT included. You must:
   - List buckets in old project dashboard
   - Download files from old project
   - Upload to new project (or use Supabase Storage API to copy)

4. **Realtime**: Realtime message history is typically transient and can be skipped for migration.

5. **Migrations**: The `supabase_migrations.schema_migrations` table tracks CLI migrations. You may want to reset this in the new project and use `supabase db push` for future migrations.

---

## Files in this Export

```
exports/
├── schema/
│   ├── extensions.sql      (599 bytes)
│   ├── enums.sql           (1,072 bytes)
│   ├── sequences.sql       (250 bytes)
│   ├── tables.sql          (35,754 bytes)
│   ├── indexes.sql         (6,203 bytes)
│   ├── functions.sql       (89,668 bytes)
│   ├── views.sql           (2,158 bytes)
│   ├── triggers.sql        (1,014 bytes)
│   └── policies.sql        (5,961 bytes)
├── data/
│   ├── auth_*.sql          (Auth system data)
│   ├── public_*.sql        (Application data)
│   ├── realtime_*.sql      (Realtime config)
│   ├── storage_*.sql       (Storage migrations)
│   └── supabase_migrations_*.sql
├── json/
│   ├── auth_*.json         (JSON backups)
│   ├── public_*.json       (JSON backups)
│   └── ...
└── metadata.json           (60,375 bytes — full summary)
```

**Total Export Size**: ~361 KB (schema + data + json + metadata)

---

*Generated: 2026-04-24*
*Source Project: mbvvsdlixtabnwvikqom*
