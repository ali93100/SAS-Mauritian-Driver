-- ============================================================
-- SAS MAURITIAN DRIVER — Schéma Base de Données Supabase
-- ============================================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE : users (auth géré par Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE : driver_profile (profil chauffeur unique)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.driver_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL DEFAULT 'Votre Chauffeur',
  photo_url TEXT,
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  zone TEXT NOT NULL DEFAULT 'Île Maurice & Région',
  siret TEXT NOT NULL DEFAULT '000 000 000 00000',
  vtc_card_number TEXT NOT NULL DEFAULT 'VTC-2024-000000',
  vtc_card_expiry DATE,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE : availability (disponibilités chauffeur)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  start_time TIME NOT NULL DEFAULT '08:00',
  end_time TIME NOT NULL DEFAULT '20:00',
  is_available BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_availability_date ON public.availability(date);

-- ============================================================
-- TABLE : clients
-- ============================================================
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  qr_code TEXT UNIQUE NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  total_rides INTEGER NOT NULL DEFAULT 0,
  total_spent DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_percent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_referral_code ON public.clients(referral_code);

-- ============================================================
-- TABLE : loyalty (fidélité)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.loyalty (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID UNIQUE NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  total_rides INTEGER NOT NULL DEFAULT 0,
  rides_since_last_discount INTEGER NOT NULL DEFAULT 0,
  current_discount INTEGER NOT NULL DEFAULT 0,
  bonus_rides INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE : referrals (parrainage)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  discount_applied BOOLEAN NOT NULL DEFAULT false,
  bonus_applied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

-- ============================================================
-- TABLE : reservations
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  departure TEXT NOT NULL,
  arrival TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  passengers INTEGER NOT NULL DEFAULT 1 CHECK (passengers BETWEEN 1 AND 8),
  luggage INTEGER NOT NULL DEFAULT 0 CHECK (luggage >= 0),
  type TEXT NOT NULL DEFAULT 'course_simple' CHECK (type IN ('course_simple', 'mise_a_disposition')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'refused', 'completed', 'cancelled')),
  estimated_distance_km DECIMAL(8,2) NOT NULL DEFAULT 0,
  estimated_duration_min INTEGER NOT NULL DEFAULT 0,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  final_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  night_surcharge BOOLEAN NOT NULL DEFAULT false,
  sunday_surcharge BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_client ON public.reservations(client_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);

-- ============================================================
-- TABLE : invoices
-- ============================================================
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID UNIQUE NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  pdf_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_invoices_client ON public.invoices(client_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_loyalty_updated_at BEFORE UPDATE ON public.loyalty
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_reservations_updated_at BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Génération automatique du numéro de facture
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number = 'MD-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
      LPAD(CAST(nextval('invoice_seq') AS TEXT), 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1;

CREATE TRIGGER trg_invoice_number BEFORE INSERT ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();

-- Mise à jour fidélité après course complète
CREATE OR REPLACE FUNCTION update_loyalty_after_ride()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO public.loyalty (client_id, total_rides, rides_since_last_discount)
    VALUES (NEW.client_id, 1, 1)
    ON CONFLICT (client_id) DO UPDATE SET
      total_rides = loyalty.total_rides + 1,
      rides_since_last_discount = loyalty.rides_since_last_discount + 1,
      updated_at = NOW();

    -- Remise automatique toutes les 5 courses
    UPDATE public.loyalty SET
      current_discount = 10,
      rides_since_last_discount = 0,
      updated_at = NOW()
    WHERE client_id = NEW.client_id AND rides_since_last_discount >= 5;

    -- Mise à jour compteur client
    UPDATE public.clients SET
      total_rides = total_rides + 1,
      total_spent = total_spent + NEW.final_price,
      updated_at = NOW()
    WHERE id = NEW.client_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_loyalty_update AFTER UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION update_loyalty_after_ride();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_profile ENABLE ROW LEVEL SECURITY;

-- Policies — lecture publique disponibilités et profil
CREATE POLICY "Public can view availability" ON public.availability FOR SELECT USING (true);
CREATE POLICY "Public can view driver profile" ON public.driver_profile FOR SELECT USING (true);

-- Policies — utilisateur peut lire ses propres données
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Admin a accès complet (basé sur rôle)
CREATE POLICY "Admin full access users" ON public.users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin full access reservations" ON public.reservations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin full access clients" ON public.clients
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin full access invoices" ON public.invoices
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin full access loyalty" ON public.loyalty
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin full access availability" ON public.availability
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin full access driver_profile" ON public.driver_profile
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Clients peuvent lire/créer leurs réservations
CREATE POLICY "Clients view own reservations" ON public.reservations
  FOR SELECT USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

CREATE POLICY "Clients insert reservations" ON public.reservations
  FOR INSERT WITH CHECK (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

-- ============================================================
-- DONNÉES INITIALES
-- ============================================================

INSERT INTO public.driver_profile (full_name, phone, email, zone, siret, vtc_card_number, bio)
VALUES (
  'Ahmad Abdool Wahed',
  '+33 6 20 03 78 10',
  'mauritiandriver@gmail.com',
  'French Riviera — Côte d''Azur',
  '000 000 000 00000',
  'VTC-2024-001234',
  'Né à l''Île Maurice, installé sur la French Riviera, je mets ma passion du service à votre disposition depuis plus de 10 ans. Ponctualité, discrétion et le sourire — c''est ma façon de vous accueillir à chaque trajet.'
) ON CONFLICT DO NOTHING;
