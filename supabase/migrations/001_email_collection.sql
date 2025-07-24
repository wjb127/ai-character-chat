-- Create email collection table for MVP testing
CREATE TABLE email_collection (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'payment_popup',
  user_agent TEXT,
  ip_address INET
);

-- Create index for email lookups
CREATE INDEX idx_email_collection_email ON email_collection(email);
CREATE INDEX idx_email_collection_created_at ON email_collection(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE email_collection ENABLE ROW LEVEL SECURITY;

-- Allow inserts for authenticated and anonymous users
CREATE POLICY "Allow email collection inserts" ON email_collection
  FOR INSERT
  WITH CHECK (true);

-- Only allow admins to read email collection data
CREATE POLICY "Allow admin read access" ON email_collection
  FOR SELECT
  USING (auth.role() = 'service_role');