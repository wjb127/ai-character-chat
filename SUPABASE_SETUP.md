# Supabase 설정 가이드

## 1. 테이블 생성 쿼리

Supabase Dashboard → SQL Editor에서 다음 쿼리들을 순서대로 실행하세요:

### 1.1 이메일 수집 테이블 생성

```sql
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
```

### 1.2 설문 응답 테이블 생성

```sql
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
```

## 2. 테이블 확인 쿼리

테이블이 정상적으로 생성되었는지 확인:

```sql
-- 테이블 목록 확인
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('email_collection', 'survey_responses');

-- 이메일 수집 테이블 스키마 확인
\d email_collection;

-- 설문 응답 테이블 스키마 확인
\d survey_responses;
```

## 3. 데이터 조회 쿼리 (관리자용)

### 3.1 이메일 수집 현황

```sql
-- 전체 이메일 수집 현황
SELECT 
  COUNT(*) as total_emails,
  COUNT(DISTINCT DATE(created_at)) as collection_days,
  MIN(created_at) as first_signup,
  MAX(created_at) as latest_signup
FROM email_collection;

-- 일별 이메일 수집 통계
SELECT 
  DATE(created_at) as date,
  COUNT(*) as daily_signups
FROM email_collection
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- 최근 이메일 목록 (최근 10개)
SELECT email, created_at, source
FROM email_collection
ORDER BY created_at DESC
LIMIT 10;
```

### 3.2 설문 응답 분석

```sql
-- 전체 설문 응답 현황
SELECT 
  COUNT(*) as total_responses,
  COUNT(CASE WHEN custom_input IS NOT NULL AND custom_input != '' THEN 1 END) as with_custom_input
FROM survey_responses;

-- 기능별 선호도 통계
SELECT 
  feature,
  COUNT(*) as votes,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM survey_responses), 2) as percentage
FROM (
  SELECT unnest(selected_features) as feature
  FROM survey_responses
) features
GROUP BY feature
ORDER BY votes DESC;

-- 최근 설문 응답 (자유 입력 포함)
SELECT 
  selected_features,
  custom_input,
  created_at
FROM survey_responses
WHERE custom_input IS NOT NULL AND custom_input != ''
ORDER BY created_at DESC
LIMIT 10;
```

## 4. 테스트 데이터 삽입 (개발용)

```sql
-- 테스트 이메일 데이터 삽입
INSERT INTO email_collection (email, source) VALUES
('test1@example.com', 'payment_popup'),
('test2@example.com', 'payment_popup'),
('test3@example.com', 'landing_page');

-- 테스트 설문 데이터 삽입
INSERT INTO survey_responses (selected_features, custom_input) VALUES
('{"custom_character", "visual_content"}', '음성 채팅 기능도 추가해주세요'),
('{"adult_content", "diverse_characters"}', '더 많은 언어 지원'),
('{"custom_character"}', NULL);
```

## 5. 데이터 삭제 (필요시)

```sql
-- 테스트 데이터 삭제
DELETE FROM email_collection WHERE email LIKE '%@example.com';
DELETE FROM survey_responses WHERE custom_input LIKE '%테스트%';

-- 전체 데이터 삭제 (주의!)
-- TRUNCATE email_collection;
-- TRUNCATE survey_responses;
```

이 쿼리들을 Supabase SQL Editor에서 실행하면 MVP 테스트를 위한 데이터베이스가 준비됩니다.