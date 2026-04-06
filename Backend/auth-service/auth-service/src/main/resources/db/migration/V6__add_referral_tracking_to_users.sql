-- Migration for referral tracking in auth-service
ALTER TABLE auth_users ADD COLUMN IF NOT EXISTS referred_by UUID;
ALTER TABLE auth_users ADD COLUMN IF NOT EXISTS referral_credits DOUBLE PRECISION DEFAULT 0.0;
