-- ==============================================================
-- Shipping Addresses table  (run once in Supabase SQL Editor)
-- ==============================================================
-- Uses auth.uid() so every row is scoped to the logged-in user.
-- RLS policies enforce that users can only CRUD their own rows.
-- ==============================================================

CREATE TABLE IF NOT EXISTS public.shipping_addresses (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  label         varchar(50)  NOT NULL DEFAULT 'Home',
  full_name     varchar(200) NOT NULL,
  address_line1 varchar(255) NOT NULL,
  address_line2 varchar(255),
  city          varchar(100) NOT NULL,
  state         varchar(100) NOT NULL,
  postal_code   varchar(20)  NOT NULL,
  country       varchar(100) NOT NULL DEFAULT 'Nigeria',
  phone         varchar(30),
  is_default    boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookup by user
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_user
  ON public.shipping_addresses (user_id);

-- Enable Row Level Security
ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;

-- Policy: users can SELECT their own addresses
CREATE POLICY "Users can view own addresses"
  ON public.shipping_addresses FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: users can INSERT their own addresses
CREATE POLICY "Users can insert own addresses"
  ON public.shipping_addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: users can UPDATE their own addresses
CREATE POLICY "Users can update own addresses"
  ON public.shipping_addresses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: users can DELETE their own addresses
CREATE POLICY "Users can delete own addresses"
  ON public.shipping_addresses FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update updated_at on every UPDATE
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_shipping_addresses_updated_at ON public.shipping_addresses;
CREATE TRIGGER trg_shipping_addresses_updated_at
  BEFORE UPDATE ON public.shipping_addresses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
