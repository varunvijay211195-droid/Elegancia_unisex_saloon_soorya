-- Tables
-- Table: auth.audit_log_entries
CREATE TABLE "auth"."audit_log_entries" (
    "instance_id" uuid,
    "id" uuid NOT NULL,
    "payload" json,
    "created_at" timestamp with time zone,
    "ip_address" character varying(64) DEFAULT ''::character varying NOT NULL,
    PRIMARY KEY ("id")
);

-- Table: auth.custom_oauth_providers
CREATE TABLE "auth"."custom_oauth_providers" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "provider_type" text NOT NULL,
    "identifier" text NOT NULL,
    "name" text NOT NULL,
    "client_id" text NOT NULL,
    "client_secret" text NOT NULL,
    "acceptable_client_ids" ARRAY DEFAULT '{}'::text[] NOT NULL,
    "scopes" ARRAY DEFAULT '{}'::text[] NOT NULL,
    "pkce_enabled" boolean DEFAULT true NOT NULL,
    "attribute_mapping" jsonb DEFAULT '{}'::jsonb NOT NULL,
    "authorization_params" jsonb DEFAULT '{}'::jsonb NOT NULL,
    "enabled" boolean DEFAULT true NOT NULL,
    "email_optional" boolean DEFAULT false NOT NULL,
    "issuer" text,
    "discovery_url" text,
    "skip_nonce_check" boolean DEFAULT false NOT NULL,
    "cached_discovery" jsonb,
    "discovery_cached_at" timestamp with time zone,
    "authorization_url" text,
    "token_url" text,
    "userinfo_url" text,
    "jwks_uri" text,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "custom_oauth_providers_identifier_key" UNIQUE ("identifier"),
    CONSTRAINT "custom_oauth_providers_authorization_url_https" CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT "custom_oauth_providers_authorization_url_length" CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT "custom_oauth_providers_client_id_length" CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT "custom_oauth_providers_discovery_url_length" CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT "custom_oauth_providers_identifier_format" CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT "custom_oauth_providers_issuer_length" CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT "custom_oauth_providers_jwks_uri_https" CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT "custom_oauth_providers_jwks_uri_length" CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT "custom_oauth_providers_name_length" CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT "custom_oauth_providers_oauth2_requires_endpoints" CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT "custom_oauth_providers_oidc_discovery_url_https" CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT "custom_oauth_providers_oidc_issuer_https" CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT "custom_oauth_providers_oidc_requires_issuer" CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT "custom_oauth_providers_provider_type_check" CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT "custom_oauth_providers_token_url_https" CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT "custom_oauth_providers_token_url_length" CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT "custom_oauth_providers_userinfo_url_https" CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT "custom_oauth_providers_userinfo_url_length" CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);

-- Table: auth.flow_state
CREATE TABLE "auth"."flow_state" (
    "id" uuid NOT NULL,
    "user_id" uuid,
    "auth_code" text,
    "code_challenge_method" USER-DEFINED,
    "code_challenge" text,
    "provider_type" text NOT NULL,
    "provider_access_token" text,
    "provider_refresh_token" text,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "authentication_method" text NOT NULL,
    "auth_code_issued_at" timestamp with time zone,
    "invite_token" text,
    "referrer" text,
    "oauth_client_state_id" uuid,
    "linking_target_id" uuid,
    "email_optional" boolean DEFAULT false NOT NULL,
    PRIMARY KEY ("id")
);

-- Table: auth.identities
CREATE TABLE "auth"."identities" (
    "provider_id" text NOT NULL,
    "user_id" uuid NOT NULL,
    "identity_data" jsonb NOT NULL,
    "provider" text NOT NULL,
    "last_sign_in_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "email" text,
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "identities_provider_id_provider_unique" UNIQUE ("provider_id", "provider")
);

-- Table: auth.instances
CREATE TABLE "auth"."instances" (
    "id" uuid NOT NULL,
    "uuid" uuid,
    "raw_base_config" text,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    PRIMARY KEY ("id")
);

-- Table: auth.mfa_amr_claims
CREATE TABLE "auth"."mfa_amr_claims" (
    "session_id" uuid NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "authentication_method" text NOT NULL,
    "id" uuid NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "mfa_amr_claims_session_id_authentication_method_pkey" UNIQUE ("session_id", "authentication_method")
);

-- Table: auth.mfa_challenges
CREATE TABLE "auth"."mfa_challenges" (
    "id" uuid NOT NULL,
    "factor_id" uuid NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "verified_at" timestamp with time zone,
    "ip_address" inet NOT NULL,
    "otp_code" text,
    "web_authn_session_data" jsonb,
    PRIMARY KEY ("id")
);

-- Table: auth.mfa_factors
CREATE TABLE "auth"."mfa_factors" (
    "id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "friendly_name" text,
    "factor_type" USER-DEFINED NOT NULL,
    "status" USER-DEFINED NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "secret" text,
    "phone" text,
    "last_challenged_at" timestamp with time zone,
    "web_authn_credential" jsonb,
    "web_authn_aaguid" uuid,
    "last_webauthn_challenge_data" jsonb,
    PRIMARY KEY ("id"),
    CONSTRAINT "mfa_factors_last_challenged_at_key" UNIQUE ("last_challenged_at")
);

-- Table: auth.oauth_authorizations
CREATE TABLE "auth"."oauth_authorizations" (
    "id" uuid NOT NULL,
    "authorization_id" text NOT NULL,
    "client_id" uuid NOT NULL,
    "user_id" uuid,
    "redirect_uri" text NOT NULL,
    "scope" text NOT NULL,
    "state" text,
    "resource" text,
    "code_challenge" text,
    "code_challenge_method" USER-DEFINED,
    "response_type" USER-DEFINED DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    "status" USER-DEFINED DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    "authorization_code" text,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "expires_at" timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    "approved_at" timestamp with time zone,
    "nonce" text,
    PRIMARY KEY ("id"),
    CONSTRAINT "oauth_authorizations_authorization_code_key" UNIQUE ("authorization_code"),
    CONSTRAINT "oauth_authorizations_authorization_id_key" UNIQUE ("authorization_id"),
    CONSTRAINT "oauth_authorizations_authorization_code_length" CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT "oauth_authorizations_code_challenge_length" CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT "oauth_authorizations_expires_at_future" CHECK ((expires_at > created_at)),
    CONSTRAINT "oauth_authorizations_nonce_length" CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT "oauth_authorizations_redirect_uri_length" CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT "oauth_authorizations_resource_length" CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT "oauth_authorizations_scope_length" CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT "oauth_authorizations_state_length" CHECK ((char_length(state) <= 4096))
);

-- Table: auth.oauth_client_states
CREATE TABLE "auth"."oauth_client_states" (
    "id" uuid NOT NULL,
    "provider_type" text NOT NULL,
    "code_verifier" text,
    "created_at" timestamp with time zone NOT NULL,
    PRIMARY KEY ("id")
);

-- Table: auth.oauth_clients
CREATE TABLE "auth"."oauth_clients" (
    "id" uuid NOT NULL,
    "client_secret_hash" text,
    "registration_type" USER-DEFINED NOT NULL,
    "redirect_uris" text NOT NULL,
    "grant_types" text NOT NULL,
    "client_name" text,
    "client_uri" text,
    "logo_uri" text,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp with time zone,
    "client_type" USER-DEFINED DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    "token_endpoint_auth_method" text NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "oauth_clients_client_name_length" CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT "oauth_clients_client_uri_length" CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT "oauth_clients_logo_uri_length" CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT "oauth_clients_token_endpoint_auth_method_check" CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);

-- Table: auth.oauth_consents
CREATE TABLE "auth"."oauth_consents" (
    "id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "client_id" uuid NOT NULL,
    "scopes" text NOT NULL,
    "granted_at" timestamp with time zone DEFAULT now() NOT NULL,
    "revoked_at" timestamp with time zone,
    PRIMARY KEY ("id"),
    CONSTRAINT "oauth_consents_user_client_unique" UNIQUE ("user_id", "client_id"),
    CONSTRAINT "oauth_consents_revoked_after_granted" CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT "oauth_consents_scopes_length" CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT "oauth_consents_scopes_not_empty" CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);

-- Table: auth.one_time_tokens
CREATE TABLE "auth"."one_time_tokens" (
    "id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "token_type" USER-DEFINED NOT NULL,
    "token_hash" text NOT NULL,
    "relates_to" text NOT NULL,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "one_time_tokens_token_hash_check" CHECK ((char_length(token_hash) > 0))
);

-- Table: auth.refresh_tokens
CREATE TABLE "auth"."refresh_tokens" (
    "instance_id" uuid,
    "id" bigint DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass) NOT NULL,
    "token" character varying(255),
    "user_id" character varying(255),
    "revoked" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "parent" character varying(255),
    "session_id" uuid,
    PRIMARY KEY ("id"),
    CONSTRAINT "refresh_tokens_token_unique" UNIQUE ("token")
);

-- Table: auth.saml_providers
CREATE TABLE "auth"."saml_providers" (
    "id" uuid NOT NULL,
    "sso_provider_id" uuid NOT NULL,
    "entity_id" text NOT NULL,
    "metadata_xml" text NOT NULL,
    "metadata_url" text,
    "attribute_mapping" jsonb,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "name_id_format" text,
    PRIMARY KEY ("id"),
    CONSTRAINT "saml_providers_entity_id_key" UNIQUE ("entity_id"),
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);

-- Table: auth.saml_relay_states
CREATE TABLE "auth"."saml_relay_states" (
    "id" uuid NOT NULL,
    "sso_provider_id" uuid NOT NULL,
    "request_id" text NOT NULL,
    "for_email" text,
    "redirect_to" text,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "flow_state_id" uuid,
    PRIMARY KEY ("id"),
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);

-- Table: auth.schema_migrations
CREATE TABLE "auth"."schema_migrations" (
    "version" character varying(255) NOT NULL
);

-- Table: auth.sessions
CREATE TABLE "auth"."sessions" (
    "id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "factor_id" uuid,
    "aal" USER-DEFINED,
    "not_after" timestamp with time zone,
    "refreshed_at" timestamp without time zone,
    "user_agent" text,
    "ip" inet,
    "tag" text,
    "oauth_client_id" uuid,
    "refresh_token_hmac_key" text,
    "refresh_token_counter" bigint,
    "scopes" text,
    PRIMARY KEY ("id"),
    CONSTRAINT "sessions_scopes_length" CHECK ((char_length(scopes) <= 4096))
);

-- Table: auth.sso_domains
CREATE TABLE "auth"."sso_domains" (
    "id" uuid NOT NULL,
    "sso_provider_id" uuid NOT NULL,
    "domain" text NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    PRIMARY KEY ("id"),
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);

-- Table: auth.sso_providers
CREATE TABLE "auth"."sso_providers" (
    "id" uuid NOT NULL,
    "resource_id" text,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "disabled" boolean,
    PRIMARY KEY ("id"),
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);

-- Table: auth.users
CREATE TABLE "auth"."users" (
    "instance_id" uuid,
    "id" uuid NOT NULL,
    "aud" character varying(255),
    "role" character varying(255),
    "email" character varying(255),
    "encrypted_password" character varying(255),
    "email_confirmed_at" timestamp with time zone,
    "invited_at" timestamp with time zone,
    "confirmation_token" character varying(255),
    "confirmation_sent_at" timestamp with time zone,
    "recovery_token" character varying(255),
    "recovery_sent_at" timestamp with time zone,
    "email_change_token_new" character varying(255),
    "email_change" character varying(255),
    "email_change_sent_at" timestamp with time zone,
    "last_sign_in_at" timestamp with time zone,
    "raw_app_meta_data" jsonb,
    "raw_user_meta_data" jsonb,
    "is_super_admin" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "phone" text DEFAULT NULL::character varying,
    "phone_confirmed_at" timestamp with time zone,
    "phone_change" text DEFAULT ''::character varying,
    "phone_change_token" character varying(255) DEFAULT ''::character varying,
    "phone_change_sent_at" timestamp with time zone,
    "confirmed_at" timestamp with time zone,
    "email_change_token_current" character varying(255) DEFAULT ''::character varying,
    "email_change_confirm_status" smallint DEFAULT 0,
    "banned_until" timestamp with time zone,
    "reauthentication_token" character varying(255) DEFAULT ''::character varying,
    "reauthentication_sent_at" timestamp with time zone,
    "is_sso_user" boolean DEFAULT false NOT NULL,
    "deleted_at" timestamp with time zone,
    "is_anonymous" boolean DEFAULT false NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "users_phone_key" UNIQUE ("phone"),
    CONSTRAINT "users_email_change_confirm_status_check" CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);

-- Table: auth.webauthn_challenges
CREATE TABLE "auth"."webauthn_challenges" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid,
    "challenge_type" text NOT NULL,
    "session_data" jsonb NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "webauthn_challenges_challenge_type_check" CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);

-- Table: auth.webauthn_credentials
CREATE TABLE "auth"."webauthn_credentials" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "credential_id" bytea NOT NULL,
    "public_key" bytea NOT NULL,
    "attestation_type" text DEFAULT ''::text NOT NULL,
    "aaguid" uuid,
    "sign_count" bigint DEFAULT 0 NOT NULL,
    "transports" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "backup_eligible" boolean DEFAULT false NOT NULL,
    "backed_up" boolean DEFAULT false NOT NULL,
    "friendly_name" text DEFAULT ''::text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "last_used_at" timestamp with time zone,
    PRIMARY KEY ("id")
);

-- Table: public.bookings
CREATE TABLE "public"."bookings" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid,
    "service_id" text NOT NULL,
    "service_name" text NOT NULL,
    "customer_name" text NOT NULL,
    "customer_email" text NOT NULL,
    "customer_phone" text,
    "date" date NOT NULL,
    "time" text NOT NULL,
    "status" text DEFAULT 'pending'::text,
    "total_price" numeric,
    "notes" text,
    "created_at" timestamp with time zone DEFAULT now(),
    "referral_code" text,
    PRIMARY KEY ("id"),
    CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id"),
    CONSTRAINT "bookings_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'cancelled'::text, 'completed'::text])))
);

-- Table: public.contact_messages
CREATE TABLE "public"."contact_messages" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    "name" text NOT NULL,
    "email" text,
    "phone" text,
    "message" text NOT NULL,
    "status" text DEFAULT 'unread'::text,
    PRIMARY KEY ("id"),
    CONSTRAINT "contact_messages_status_check" CHECK ((status = ANY (ARRAY['unread'::text, 'read'::text, 'replied'::text])))
);

-- Table: public.customer_points
CREATE TABLE "public"."customer_points" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "customer_id" uuid,
    "total_points" integer DEFAULT 0,
    "available_points" integer DEFAULT 0,
    "lifetime_points" integer DEFAULT 0,
    "tier" text DEFAULT 'bronze'::text,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    PRIMARY KEY ("id"),
    CONSTRAINT "customer_points_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."profiles"("id"),
    CONSTRAINT "customer_points_customer_id_key" UNIQUE ("customer_id"),
    CONSTRAINT "customer_points_tier_check" CHECK ((tier = ANY (ARRAY['bronze'::text, 'silver'::text, 'gold'::text, 'platinum'::text])))
);

-- Table: public.gallery
CREATE TABLE "public"."gallery" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "title" text,
    "image_url" text NOT NULL,
    "public_id" text NOT NULL,
    "category" text DEFAULT 'general'::text,
    "is_featured" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT now(),
    PRIMARY KEY ("id")
);

-- Table: public.google_reviews
CREATE TABLE "public"."google_reviews" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "reviewer_name" text NOT NULL,
    "rating" integer NOT NULL,
    "review_text" text,
    "review_date" text,
    "profile_picture_url" text,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "google_reviews_reviewer_name_review_text_key" UNIQUE ("reviewer_name", "review_text")
);

-- Table: public.instagram_posts
CREATE TABLE "public"."instagram_posts" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "post_url" text NOT NULL,
    "image_url" text NOT NULL,
    "caption" text,
    "type" text DEFAULT 'photo'::text,
    "is_featured" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT now(),
    PRIMARY KEY ("id"),
    CONSTRAINT "instagram_posts_post_url_key" UNIQUE ("post_url")
);

-- Table: public.loyalty_programs
CREATE TABLE "public"."loyalty_programs" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "name" text DEFAULT 'Default Loyalty Program'::text NOT NULL,
    "points_per_rupee" numeric DEFAULT 1.00,
    "points_to_redeem" integer DEFAULT 100,
    "rupee_value_per_point" numeric DEFAULT 1.00,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    PRIMARY KEY ("id")
);

-- Table: public.notifications
CREATE TABLE "public"."notifications" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid,
    "title" text NOT NULL,
    "message" text NOT NULL,
    "type" text DEFAULT 'info'::text,
    "is_read" boolean DEFAULT false,
    "metadata" jsonb DEFAULT '{}'::jsonb,
    "created_at" timestamp with time zone DEFAULT now(),
    PRIMARY KEY ("id"),
    CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id"),
    CONSTRAINT "notifications_type_check" CHECK ((type = ANY (ARRAY['info'::text, 'booking_new'::text, 'booking_confirmed'::text, 'reward'::text])))
);

-- Table: public.points_transactions
CREATE TABLE "public"."points_transactions" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "customer_id" uuid,
    "points" integer NOT NULL,
    "transaction_type" text NOT NULL,
    "description" text,
    "booking_id" uuid,
    "created_at" timestamp with time zone DEFAULT now(),
    PRIMARY KEY ("id"),
    CONSTRAINT "points_transactions_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id"),
    CONSTRAINT "points_transactions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."profiles"("id"),
    CONSTRAINT "points_transactions_transaction_type_check" CHECK ((transaction_type = ANY (ARRAY['earn'::text, 'redeem'::text, 'expire'::text, 'bonus'::text, 'referral_earn'::text, 'referral_bonus'::text])))
);

-- Table: public.profiles
CREATE TABLE "public"."profiles" (
    "id" uuid NOT NULL,
    "email" text NOT NULL,
    "full_name" text,
    "avatar_url" text,
    "role" text DEFAULT 'user'::text,
    "created_at" timestamp with time zone DEFAULT now(),
    "loyalty_points" integer DEFAULT 0,
    "total_spent" numeric DEFAULT 0,
    "phone_number" text,
    "date_of_birth" date,
    PRIMARY KEY ("id"),
    CONSTRAINT "profiles_email_key" UNIQUE ("email"),
    CONSTRAINT "profiles_role_check" CHECK ((role = ANY (ARRAY['user'::text, 'admin'::text])))
);

-- Table: public.referrals
CREATE TABLE "public"."referrals" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "referrer_id" uuid,
    "referee_id" uuid,
    "referral_code" text NOT NULL,
    "referrer_reward_points" integer DEFAULT 100,
    "referee_reward_points" integer DEFAULT 50,
    "status" text DEFAULT 'pending'::text,
    "referred_at" timestamp with time zone DEFAULT now(),
    "completed_at" timestamp with time zone,
    PRIMARY KEY ("id"),
    CONSTRAINT "referrals_referee_id_fkey" FOREIGN KEY ("referee_id") REFERENCES "public"."profiles"("id"),
    CONSTRAINT "referrals_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "public"."profiles"("id"),
    CONSTRAINT "referrals_referral_code_key" UNIQUE ("referral_code"),
    CONSTRAINT "referrals_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'expired'::text])))
);

-- Table: public.reward_tiers
CREATE TABLE "public"."reward_tiers" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL,
    "min_points" integer NOT NULL,
    "perks" ARRAY,
    "color_hex" text,
    PRIMARY KEY ("id")
);

-- Table: public.services
CREATE TABLE "public"."services" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "slug" text NOT NULL,
    "title" text NOT NULL,
    "category" text NOT NULL,
    "icon" text NOT NULL,
    "short_desc" text NOT NULL,
    "long_desc" text,
    "sub_services" ARRAY,
    "image_url" text NOT NULL,
    "starting_price" numeric NOT NULL,
    "duration" text NOT NULL,
    "tag" text,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    PRIMARY KEY ("id"),
    CONSTRAINT "services_slug_key" UNIQUE ("slug")
);

-- Table: public.thank_you_notes
CREATE TABLE "public"."thank_you_notes" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "sender_id" uuid,
    "recipient_id" uuid,
    "booking_id" uuid,
    "message" text NOT NULL,
    "note_type" text DEFAULT 'thank_you'::text,
    "is_read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT now(),
    PRIMARY KEY ("id"),
    CONSTRAINT "thank_you_notes_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id"),
    CONSTRAINT "thank_you_notes_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."profiles"("id"),
    CONSTRAINT "thank_you_notes_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id"),
    CONSTRAINT "thank_you_notes_note_type_check" CHECK ((note_type = ANY (ARRAY['thank_you'::text, 'hair_care_tip'::text, 'personal_note'::text])))
);

-- Table: public.tier_benefits
CREATE TABLE "public"."tier_benefits" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "tier_name" text NOT NULL,
    "min_points" integer DEFAULT 0,
    "max_points" integer,
    "bonus_percentage" integer DEFAULT 0,
    "description" text,
    "created_at" timestamp with time zone DEFAULT now(),
    PRIMARY KEY ("id"),
    CONSTRAINT "tier_benefits_tier_name_key" UNIQUE ("tier_name")
);

-- Table: realtime.messages
CREATE TABLE "realtime"."messages" (
    "topic" text NOT NULL,
    "extension" text NOT NULL,
    "payload" jsonb,
    "event" text,
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT now() NOT NULL,
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    PRIMARY KEY ("id", "inserted_at")
);

-- Table: realtime.messages_2026_03_10
CREATE TABLE "realtime"."messages_2026_03_10" (
    "topic" text NOT NULL,
    "extension" text NOT NULL,
    "payload" jsonb,
    "event" text,
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT now() NOT NULL,
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    PRIMARY KEY ("id", "inserted_at")
);

-- Table: realtime.messages_2026_03_11
CREATE TABLE "realtime"."messages_2026_03_11" (
    "topic" text NOT NULL,
    "extension" text NOT NULL,
    "payload" jsonb,
    "event" text,
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT now() NOT NULL,
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    PRIMARY KEY ("id", "inserted_at")
);

-- Table: realtime.messages_2026_03_12
CREATE TABLE "realtime"."messages_2026_03_12" (
    "topic" text NOT NULL,
    "extension" text NOT NULL,
    "payload" jsonb,
    "event" text,
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT now() NOT NULL,
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    PRIMARY KEY ("id", "inserted_at")
);

-- Table: realtime.messages_2026_03_13
CREATE TABLE "realtime"."messages_2026_03_13" (
    "topic" text NOT NULL,
    "extension" text NOT NULL,
    "payload" jsonb,
    "event" text,
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT now() NOT NULL,
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    PRIMARY KEY ("id", "inserted_at")
);

-- Table: realtime.messages_2026_03_14
CREATE TABLE "realtime"."messages_2026_03_14" (
    "topic" text NOT NULL,
    "extension" text NOT NULL,
    "payload" jsonb,
    "event" text,
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT now() NOT NULL,
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    PRIMARY KEY ("id", "inserted_at")
);

-- Table: realtime.messages_2026_03_15
CREATE TABLE "realtime"."messages_2026_03_15" (
    "topic" text NOT NULL,
    "extension" text NOT NULL,
    "payload" jsonb,
    "event" text,
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT now() NOT NULL,
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    PRIMARY KEY ("id", "inserted_at")
);

-- Table: realtime.messages_2026_03_16
CREATE TABLE "realtime"."messages_2026_03_16" (
    "topic" text NOT NULL,
    "extension" text NOT NULL,
    "payload" jsonb,
    "event" text,
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT now() NOT NULL,
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    PRIMARY KEY ("id", "inserted_at")
);

-- Table: realtime.schema_migrations
CREATE TABLE "realtime"."schema_migrations" (
    "version" bigint NOT NULL,
    "inserted_at" timestamp without time zone,
    PRIMARY KEY ("version")
);

-- Table: realtime.subscription
CREATE TABLE "realtime"."subscription" (
    "id" bigint NOT NULL,
    "subscription_id" uuid NOT NULL,
    "entity" regclass NOT NULL,
    "filters" ARRAY DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    "claims" jsonb NOT NULL,
    "claims_role" regrole NOT NULL,
    "created_at" timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "action_filter" text DEFAULT '*'::text,
    PRIMARY KEY ("id"),
    CONSTRAINT "subscription_action_filter_check" CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);

-- Table: storage.buckets
CREATE TABLE "storage"."buckets" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "owner" uuid,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    "public" boolean DEFAULT false,
    "avif_autodetection" boolean DEFAULT false,
    "file_size_limit" bigint,
    "allowed_mime_types" ARRAY,
    "owner_id" text,
    "type" USER-DEFINED DEFAULT 'STANDARD'::storage.buckettype NOT NULL,
    PRIMARY KEY ("id")
);

-- Table: storage.buckets_analytics
CREATE TABLE "storage"."buckets_analytics" (
    "name" text NOT NULL,
    "type" USER-DEFINED DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    "format" text DEFAULT 'ICEBERG'::text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "deleted_at" timestamp with time zone,
    PRIMARY KEY ("id")
);

-- Table: storage.buckets_vectors
CREATE TABLE "storage"."buckets_vectors" (
    "id" text NOT NULL,
    "type" USER-DEFINED DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Table: storage.migrations
CREATE TABLE "storage"."migrations" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "hash" character varying(40) NOT NULL,
    "executed_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Table: storage.objects
CREATE TABLE "storage"."objects" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "bucket_id" text,
    "name" text,
    "owner" uuid,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    "last_accessed_at" timestamp with time zone DEFAULT now(),
    "metadata" jsonb,
    "path_tokens" ARRAY,
    "version" text,
    "owner_id" text,
    "user_metadata" jsonb,
    PRIMARY KEY ("id")
);

-- Table: storage.s3_multipart_uploads
CREATE TABLE "storage"."s3_multipart_uploads" (
    "id" text NOT NULL,
    "in_progress_size" bigint DEFAULT 0 NOT NULL,
    "upload_signature" text NOT NULL,
    "bucket_id" text NOT NULL,
    "key" text NOT NULL,
    "version" text NOT NULL,
    "owner_id" text,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "user_metadata" jsonb,
    "metadata" jsonb,
    PRIMARY KEY ("id")
);

-- Table: storage.s3_multipart_uploads_parts
CREATE TABLE "storage"."s3_multipart_uploads_parts" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "upload_id" text NOT NULL,
    "size" bigint DEFAULT 0 NOT NULL,
    "part_number" integer NOT NULL,
    "bucket_id" text NOT NULL,
    "key" text NOT NULL,
    "etag" text NOT NULL,
    "owner_id" text,
    "version" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY ("id")
);

-- Table: storage.vector_indexes
CREATE TABLE "storage"."vector_indexes" (
    "id" text DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL,
    "bucket_id" text NOT NULL,
    "data_type" text NOT NULL,
    "dimension" integer NOT NULL,
    "distance_metric" text NOT NULL,
    "metadata_configuration" jsonb,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Table: supabase_migrations.schema_migrations
CREATE TABLE "supabase_migrations"."schema_migrations" (
    "version" text NOT NULL,
    "statements" ARRAY,
    "name" text,
    PRIMARY KEY ("version")
);

-- Table: vault.secrets
CREATE TABLE "vault"."secrets" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "name" text,
    "description" text DEFAULT ''::text NOT NULL,
    "secret" text NOT NULL,
    "key_id" uuid,
    "nonce" bytea DEFAULT vault._crypto_aead_det_noncegen(),
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY ("id")
);

