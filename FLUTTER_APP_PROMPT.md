# AI 캐릭터 챗 Flutter 모바일 앱 구현 프롬프트

## 프로젝트 개요

한국어 AI 캐릭터 챗 서비스의 모바일 앱 버전을 Flutter로 구현해주세요. 이 앱은 다양한 AI 캐릭터와 대화할 수 있는 서비스로, 사용자가 여러 성격과 말투를 가진 캐릭터들과 자유롭게 대화할 수 있습니다.

웹 MVP 버전 GitHub: https://github.com/wjb127/ai-character-chat

## 핵심 기능 요구사항

### 1. 캐릭터 시스템
- **기본 캐릭터 9종** (하드코딩된 시스템 프롬프트):
  - 일론 머스크 (혁신가, 콩글리시 + 기술 용어 사용)
  - 도널드 트럼프 (과장된 표현, "tremendous" 남발)
  - AI 여자친구 (애교 많고 사랑스러운 말투)
  - AI 남자친구 (든든하고 다정한 말투)
  - 댕댕이 (말하는 강아지, "멍멍" 사용)
  - 할아버지 (지혜롭고 따뜻한 말투)
  - 귀여운 꼬마 (천진난만한 7살 어린이)
  - 츤데레 여친 (차가운 척하지만 다정한)
  - 도움이 (친절한 AI 도우미)

- **사용자 커스텀 캐릭터**:
  - 캐릭터 생성 기능 (이름, 설명, 시스템 프롬프트, 아바타)
  - 생성된 캐릭터는 데이터베이스에 저장
  - 모든 사용자가 공개 캐릭터 사용 가능

### 2. AI 모델 통합
- **OpenAI GPT-4o** API 연동
- **Anthropic Claude 3.5 Sonnet** API 연동
- 사용자가 대화 중 AI 모델 선택 가능
- 각 캐릭터별 시스템 프롬프트 적용

### 3. 채팅 인터페이스
- 실시간 메시지 송수신
- 타이핑 인디케이터
- 메시지 타임스탬프
- 대화 히스토리 유지
- 캐릭터별 대화 내용 분리 저장

### 4. 인증 시스템
- 이메일/비밀번호 로그인 (Supabase)
- 구글 OAuth 로그인
- 게스트 모드 지원
- 자동 로그인 기능

### 5. 데이터베이스 스키마 (Supabase)
```sql
-- 사용자 테이블 (Supabase Auth 사용)

-- 캐릭터 테이블
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL,
  avatar_url VARCHAR(500),
  category VARCHAR(50),
  creator_id UUID REFERENCES auth.users(id),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 대화 기록 테이블
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  character_id UUID REFERENCES characters(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 메시지 테이블
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id),
  content TEXT NOT NULL,
  role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
  created_at TIMESTAMP DEFAULT NOW()
);

-- 사용자 캐릭터 즐겨찾기
CREATE TABLE favorite_characters (
  user_id UUID REFERENCES auth.users(id),
  character_id UUID REFERENCES characters(id),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, character_id)
);
```

## 모바일 특화 기능

### 1. UI/UX 디자인
- **홈 화면**: 인기 캐릭터, 최근 대화, 추천 캐릭터
- **캐릭터 탐색**: 카테고리별 필터링, 검색 기능
- **채팅 화면**: 
  - 상단: 캐릭터 정보 및 AI 모델 선택
  - 중앙: 메시지 리스트 (버블 스타일)
  - 하단: 입력창 및 전송 버튼
- **프로필**: 계정 설정, 생성한 캐릭터 관리
- **다크 모드** 지원

### 2. 모바일 최적화
- 오프라인 모드 (최근 대화 캐싱)
- 푸시 알림 (새 메시지, 캐릭터 업데이트)
- 생체 인증 (지문/Face ID)
- 이미지 전송 지원
- 음성 메시지 (STT/TTS)

### 3. 추가 기능
- **캐릭터 평가 시스템** (별점, 리뷰)
- **대화 내보내기** (텍스트, PDF)
- **캐릭터 공유** (딥링크)
- **일일 메시지 제한** (무료 사용자)
- **프리미엄 구독** (무제한 메시지, 고급 캐릭터)

## 기술 스택 요구사항

### Flutter 패키지
```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # 상태 관리
  provider: ^6.0.0
  riverpod: ^2.0.0
  
  # API 통신
  dio: ^5.0.0
  retrofit: ^4.0.0
  
  # 인증
  supabase_flutter: ^2.0.0
  google_sign_in: ^6.0.0
  
  # UI 컴포넌트
  flutter_chat_ui: ^1.6.0
  cached_network_image: ^3.3.0
  shimmer: ^3.0.0
  
  # 로컬 저장소
  shared_preferences: ^2.2.0
  hive: ^2.2.0
  
  # 유틸리티
  intl: ^0.18.0
  url_launcher: ^6.2.0
  share_plus: ^7.2.0
```

### 환경 변수 설정
```dart
// lib/config/env.dart
class Environment {
  static const String openaiApiKey = 'YOUR_OPENAI_API_KEY';
  static const String anthropicApiKey = 'YOUR_ANTHROPIC_API_KEY';
  static const String supabaseUrl = 'YOUR_SUPABASE_URL';
  static const String supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
  static const String googleClientId = 'YOUR_GOOGLE_CLIENT_ID';
}
```

## 프로젝트 구조

```
lib/
├── main.dart
├── config/
│   ├── env.dart
│   ├── theme.dart
│   └── constants.dart
├── models/
│   ├── character.dart
│   ├── message.dart
│   ├── conversation.dart
│   └── user.dart
├── services/
│   ├── auth_service.dart
│   ├── openai_service.dart
│   ├── claude_service.dart
│   ├── supabase_service.dart
│   └── notification_service.dart
├── providers/
│   ├── auth_provider.dart
│   ├── character_provider.dart
│   ├── chat_provider.dart
│   └── settings_provider.dart
├── screens/
│   ├── splash_screen.dart
│   ├── onboarding_screen.dart
│   ├── auth/
│   │   ├── login_screen.dart
│   │   └── register_screen.dart
│   ├── home_screen.dart
│   ├── character/
│   │   ├── character_list_screen.dart
│   │   ├── character_detail_screen.dart
│   │   └── character_create_screen.dart
│   ├── chat/
│   │   ├── chat_screen.dart
│   │   └── chat_list_screen.dart
│   └── profile/
│       ├── profile_screen.dart
│       └── settings_screen.dart
├── widgets/
│   ├── character_card.dart
│   ├── message_bubble.dart
│   ├── typing_indicator.dart
│   └── custom_app_bar.dart
└── utils/
    ├── validators.dart
    ├── formatters.dart
    └── logger.dart
```

## 구현 우선순위

### Phase 1 (MVP - 2주)
1. ✅ 기본 프로젝트 설정 및 환경 구성
2. ✅ Supabase 인증 시스템 구현
3. ✅ 7개 기본 캐릭터 하드코딩
4. ✅ OpenAI/Claude API 연동
5. ✅ 기본 채팅 인터페이스
6. ✅ 캐릭터 선택 화면

### Phase 2 (핵심 기능 - 2주)
1. ✅ 사용자 캐릭터 생성 기능
2. ✅ 대화 히스토리 저장/불러오기
3. ✅ 캐릭터 카테고리 및 검색
4. ✅ 프로필 및 설정 화면
5. ✅ 다크 모드 구현

### Phase 3 (고급 기능 - 2주)
1. ✅ 오프라인 모드
2. ✅ 푸시 알림
3. ✅ 음성 메시지
4. ✅ 캐릭터 평가 시스템
5. ✅ 프리미엄 구독 시스템

### Phase 4 (최적화 - 1주)
1. ✅ 성능 최적화
2. ✅ 버그 수정
3. ✅ UI/UX 개선
4. ✅ 앱스토어 배포 준비

## 특별 요구사항

1. **한국어 최적화**: 모든 UI 텍스트는 한국어로, 자연스러운 한국어 표현 사용
2. **캐릭터 개성**: 각 캐릭터의 말투와 성격이 명확히 구분되도록 구현
3. **반응 속도**: 메시지 전송 후 1초 이내 응답 시작
4. **에러 처리**: 네트워크 오류, API 제한 등 우아한 처리
5. **보안**: API 키 안전한 저장, 사용자 데이터 암호화

## 테스트 요구사항

1. **단위 테스트**: 핵심 비즈니스 로직
2. **위젯 테스트**: 주요 UI 컴포넌트
3. **통합 테스트**: 주요 사용자 플로우
4. **성능 테스트**: 메모리 누수, 렌더링 성능

## 배포 준비사항

1. **앱 아이콘** 및 스플래시 스크린
2. **앱스토어 스크린샷** (한국어)
3. **개인정보 처리방침** 및 이용약관
4. **앱 설명** (ASO 최적화)
5. **버전 관리** 전략

---

이 프롬프트를 사용하여 Flutter 개발자나 AI 코딩 도구에 요청하면, 웹 MVP의 핵심 기능을 모두 포함하면서도 모바일에 최적화된 AI 캐릭터 챗 앱을 구현할 수 있습니다.