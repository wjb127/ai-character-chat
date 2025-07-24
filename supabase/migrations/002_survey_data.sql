-- Create survey data table for feature preference collection
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  selected_features TEXT[] NOT NULL DEFAULT '{}',
  custom_input TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET
);

-- Create indexes for analytics queries
CREATE INDEX idx_survey_responses_created_at ON survey_responses(created_at);
CREATE INDEX idx_survey_responses_features ON survey_responses USING GIN(selected_features);

-- Enable RLS (Row Level Security)
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Allow inserts for authenticated and anonymous users
CREATE POLICY "Allow survey response inserts" ON survey_responses
  FOR INSERT
  WITH CHECK (true);

-- Only allow admins to read survey data
CREATE POLICY "Allow admin read access survey" ON survey_responses
  FOR SELECT
  USING (auth.role() = 'service_role');