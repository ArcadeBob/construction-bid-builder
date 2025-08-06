-- Create enums for proposal system
CREATE TYPE project_type AS ENUM (
  'storefront_installation',
  'curtain_wall',
  'glass_doors',
  'glass_railings',
  'showers',
  'glass_canopies',
  'custom_installation'
);

CREATE TYPE proposal_status AS ENUM (
  'draft',
  'review',
  'ready_to_send',
  'sent'
);

CREATE TYPE line_item_category AS ENUM (
  'material',
  'labor',
  'equipment',
  'overhead',
  'profit',
  'custom'
);

CREATE TYPE section_type AS ENUM (
  'project_details',
  'technical_specifications',
  'risk_assessment',
  'timeline',
  'warranty',
  'terms_conditions'
);

-- Create contractors table if it doesn't exist
CREATE TABLE IF NOT EXISTS contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create proposals table
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  project_type project_type NOT NULL,
  status proposal_status NOT NULL DEFAULT 'draft',
  
  -- Client information
  client_name TEXT NOT NULL,
  client_contact_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  client_address TEXT,
  
  -- Project information
  project_name TEXT NOT NULL,
  project_address TEXT,
  project_description TEXT,
  
  -- Pricing totals
  subtotal DECIMAL(10,2) DEFAULT 0.00,
  tax_rate DECIMAL(5,4) DEFAULT 0.0000,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) DEFAULT 0.00,
  
  -- Workflow tracking
  internal_notes TEXT,
  review_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT positive_subtotal CHECK (subtotal >= 0),
  CONSTRAINT positive_tax_rate CHECK (tax_rate >= 0 AND tax_rate <= 1),
  CONSTRAINT positive_tax_amount CHECK (tax_amount >= 0),
  CONSTRAINT positive_total_amount CHECK (total_amount >= 0)
);

-- Create proposal line items table
CREATE TABLE proposal_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  category line_item_category NOT NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(10,3) NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'each',
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  is_manual_override BOOLEAN NOT NULL DEFAULT FALSE,
  material_id UUID, -- Reference to materials table (to be created later)
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT positive_quantity CHECK (quantity > 0),
  CONSTRAINT positive_unit_price CHECK (unit_price >= 0),
  CONSTRAINT positive_total CHECK (total >= 0)
);

-- Create proposal sections table for flexible content
CREATE TABLE proposal_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  section_type section_type NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique section types per proposal
  UNIQUE(proposal_id, section_type)
);

-- Create proposal auto-save history table
CREATE TABLE proposal_auto_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  snapshot_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Keep only last 10 auto-saves per proposal
  CONSTRAINT recent_auto_saves CHECK (
    (SELECT COUNT(*) FROM proposal_auto_saves WHERE proposal_id = proposal_auto_saves.proposal_id) <= 10
  )
);

-- Create indexes for performance
CREATE INDEX idx_proposals_contractor_id ON proposals(contractor_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_project_type ON proposals(project_type);
CREATE INDEX idx_proposals_created_at ON proposals(created_at DESC);
CREATE INDEX idx_proposals_updated_at ON proposals(updated_at DESC);
CREATE INDEX idx_proposals_compound_search ON proposals(contractor_id, status, project_type);

CREATE INDEX idx_line_items_proposal_id ON proposal_line_items(proposal_id);
CREATE INDEX idx_line_items_category ON proposal_line_items(category);
CREATE INDEX idx_line_items_order ON proposal_line_items(proposal_id, order_index);

CREATE INDEX idx_sections_proposal_id ON proposal_sections(proposal_id);
CREATE INDEX idx_sections_type ON proposal_sections(section_type);
CREATE INDEX idx_sections_order ON proposal_sections(proposal_id, order_index);

CREATE INDEX idx_auto_saves_proposal_id ON proposal_auto_saves(proposal_id);
CREATE INDEX idx_auto_saves_created_at ON proposal_auto_saves(created_at DESC);

-- Enable Row Level Security
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_auto_saves ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for contractors
CREATE POLICY "Users can view own contractor profile" ON contractors
  FOR SELECT USING (auth.uid()::text = email OR auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can update own contractor profile" ON contractors
  FOR UPDATE USING (auth.uid()::text = email OR auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can insert own contractor profile" ON contractors
  FOR INSERT WITH CHECK (auth.uid()::text = email OR auth.jwt() ->> 'email' = email);

-- Create RLS policies for proposals
CREATE POLICY "Contractors can view own proposals" ON proposals
  FOR SELECT USING (
    contractor_id IN (
      SELECT id FROM contractors 
      WHERE email = auth.jwt() ->> 'email' OR email = auth.uid()::text
    )
  );

CREATE POLICY "Contractors can insert own proposals" ON proposals
  FOR INSERT WITH CHECK (
    contractor_id IN (
      SELECT id FROM contractors 
      WHERE email = auth.jwt() ->> 'email' OR email = auth.uid()::text
    )
  );

CREATE POLICY "Contractors can update own proposals" ON proposals
  FOR UPDATE USING (
    contractor_id IN (
      SELECT id FROM contractors 
      WHERE email = auth.jwt() ->> 'email' OR email = auth.uid()::text
    )
  );

CREATE POLICY "Contractors can delete own proposals" ON proposals
  FOR DELETE USING (
    contractor_id IN (
      SELECT id FROM contractors 
      WHERE email = auth.jwt() ->> 'email' OR email = auth.uid()::text
    )
  );

-- Create RLS policies for proposal line items
CREATE POLICY "Contractors can access line items for own proposals" ON proposal_line_items
  FOR ALL USING (
    proposal_id IN (
      SELECT p.id FROM proposals p 
      JOIN contractors c ON p.contractor_id = c.id
      WHERE c.email = auth.jwt() ->> 'email' OR c.email = auth.uid()::text
    )
  );

-- Create RLS policies for proposal sections
CREATE POLICY "Contractors can access sections for own proposals" ON proposal_sections
  FOR ALL USING (
    proposal_id IN (
      SELECT p.id FROM proposals p 
      JOIN contractors c ON p.contractor_id = c.id
      WHERE c.email = auth.jwt() ->> 'email' OR c.email = auth.uid()::text
    )
  );

-- Create RLS policies for auto-saves
CREATE POLICY "Contractors can access auto-saves for own proposals" ON proposal_auto_saves
  FOR ALL USING (
    proposal_id IN (
      SELECT p.id FROM proposals p 
      JOIN contractors c ON p.contractor_id = c.id
      WHERE c.email = auth.jwt() ->> 'email' OR c.email = auth.uid()::text
    )
  );

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON contractors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_line_items_updated_at BEFORE UPDATE ON proposal_line_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON proposal_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate proposal totals
CREATE OR REPLACE FUNCTION calculate_proposal_totals(proposal_uuid UUID)
RETURNS VOID AS $$
DECLARE
  calculated_subtotal DECIMAL(10,2);
  current_tax_rate DECIMAL(5,4);
  calculated_tax_amount DECIMAL(10,2);
  calculated_total DECIMAL(10,2);
BEGIN
  -- Calculate subtotal from line items
  SELECT COALESCE(SUM(total), 0.00)
  INTO calculated_subtotal
  FROM proposal_line_items
  WHERE proposal_id = proposal_uuid;
  
  -- Get current tax rate
  SELECT tax_rate INTO current_tax_rate
  FROM proposals
  WHERE id = proposal_uuid;
  
  -- Calculate tax amount
  calculated_tax_amount := calculated_subtotal * COALESCE(current_tax_rate, 0.00);
  calculated_total := calculated_subtotal + calculated_tax_amount;
  
  -- Update proposal totals
  UPDATE proposals
  SET 
    subtotal = calculated_subtotal,
    tax_amount = calculated_tax_amount,
    total_amount = calculated_total,
    updated_at = NOW()
  WHERE id = proposal_uuid;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate totals when line items change
CREATE OR REPLACE FUNCTION trigger_calculate_proposal_totals()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM calculate_proposal_totals(OLD.proposal_id);
    RETURN OLD;
  ELSE
    PERFORM calculate_proposal_totals(NEW.proposal_id);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_totals_on_line_item_change
  AFTER INSERT OR UPDATE OR DELETE ON proposal_line_items
  FOR EACH ROW EXECUTE FUNCTION trigger_calculate_proposal_totals();

-- Create function to maintain auto-save history limit
CREATE OR REPLACE FUNCTION cleanup_old_auto_saves()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete old auto-saves, keeping only the 10 most recent
  DELETE FROM proposal_auto_saves
  WHERE proposal_id = NEW.proposal_id
  AND id NOT IN (
    SELECT id FROM proposal_auto_saves
    WHERE proposal_id = NEW.proposal_id
    ORDER BY created_at DESC
    LIMIT 10
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleanup_auto_saves_after_insert
  AFTER INSERT ON proposal_auto_saves
  FOR EACH ROW EXECUTE FUNCTION cleanup_old_auto_saves();

-- Insert default contractor for development (optional)
-- This can be removed in production
INSERT INTO contractors (email, company_name, contact_name, phone) 
VALUES (
  'dev@example.com',
  'Development Glazing Co',
  'Dev User',
  '555-0123'
) ON CONFLICT (email) DO NOTHING;