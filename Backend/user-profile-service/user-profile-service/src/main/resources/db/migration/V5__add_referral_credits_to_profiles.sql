-- Migration for referral credits in user-profile-service
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_credits DOUBLE PRECISION DEFAULT 0.0;
