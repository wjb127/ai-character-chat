# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Character Chat** is a Korean-language character chat MVP designed for **pre-launch email collection** before the official mobile app release. This web application serves as a demo to showcase core character chat functionality and gather user interest through early access registration.

### Business Purpose
- **MVP for Mobile App**: Demonstrates key features before full mobile app launch
- **Email Collection**: Primary goal is gathering pre-registration emails from interested users
- **Market Validation**: Tests user engagement with character chat concept in Korean market

### MVP Core Features
1. **Basic Character Chat**: Users can chat with predefined AI characters with hardcoded prompts
2. **Character Creation**: Users can create custom characters that are saved to database
3. **Character Database**: New characters become available for all users after creation
4. **Multi-AI Backend**: Supports both OpenAI GPT-3.5 and Anthropic Claude models
5. **Email Collection**: Primary CTA for mobile app pre-registration

### Current Implementation Status
- ✅ Basic chat interface with AI model selection
- ✅ Dual authentication system (Supabase + NextAuth with Google)
- ❌ Character system (needs implementation)
- ❌ Character creation interface (needs implementation)
- ❌ Character database management (needs implementation)
- ❌ Email collection system (needs implementation)

## Technology Stack

### Frontend Framework
- **Next.js 15.4.3** with App Router
- **React 19.1.0** with TypeScript
- **Tailwind CSS 4** for styling (using PostCSS plugin)
- **Lucide React** for icons

### Authentication & Database
- **Supabase** for database and authentication
- **NextAuth.js** for social authentication (Google OAuth)
- Dual auth system allowing both email/password and social login

### AI Integration
- **OpenAI SDK** for GPT-3.5 Turbo integration
- **Anthropic SDK** for Claude 3 Sonnet integration
- Custom API routes for AI communication

### Development Tools
- **TypeScript** with strict configuration
- **ESLint** with Next.js configuration
- Modern ES2017+ target

## Architecture & Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/   # NextAuth configuration
│   │   ├── chat/                 # OpenAI GPT endpoint
│   │   └── claude/               # Anthropic Claude endpoint
│   ├── auth/                     # Authentication page
│   ├── chat/                     # Main chat interface
│   ├── globals.css               # Global styles with Tailwind
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Landing page
├── components/                   # Reusable components
│   ├── NavAuth.tsx              # Authentication navigation
│   └── Providers.tsx            # Context providers wrapper
├── contexts/                     # React contexts
│   └── AuthContext.tsx          # Supabase auth context
└── lib/                         # Utility libraries
    └── supabase.ts              # Supabase client configuration
```

## Character System Architecture (To Be Implemented)

### 1. Default Characters (Hardcoded Prompts)
**Default Characters (9 Total)**:
1. **일론 머스크** (🚀) - 혁신가, 기업가, 화성 개척자
   - 콩글리시 사용, First principles thinking
   - "To the moon! 🚀", "Physics doesn't lie"
   
2. **도널드 트럼프** (🏛️) - 전 미국 대통령, 비즈니스 거물
   - 과장된 표현, tremendous 남발
   - "Believe me", "It's going to be beautiful"

3. **AI 여자친구** (💕) - 사랑스럽고 애정 어린 AI
4. **AI 남자친구** (💙) - 든든하고 다정한 AI
5. **댕댕이** (🐕) - 말하는 귀여운 강아지
6. **할아버지** (👴) - 지혜롭고 따뜻한 할아버지
7. **귀여운 꼬마** (👶) - 천진난만한 7살 어린이
8. **츤데레 여친** (😤) - 차갑지만 사실은 다정한
9. **도움이** (🤖) - 친절한 AI 도우미

### 2. Character Database Schema
**Required Supabase Tables**:
```sql
-- Characters table
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

-- User interactions tracking
CREATE TABLE character_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  character_id UUID REFERENCES characters(id),
  message_count INTEGER DEFAULT 1,
  last_interaction TIMESTAMP DEFAULT NOW()
);
```

### 3. Character Creation Interface Components
**Required Components**:
- `CharacterCreator.tsx` - Character creation form
- `CharacterSelector.tsx` - Character selection grid/list
- `CharacterCard.tsx` - Individual character display component
- `CharacterManager.tsx` - User's created characters management

### 4. Enhanced Chat System
**Current Chat Integration** (`/src/app/chat/page.tsx`):
- ✅ Basic AI model selection
- ❌ Character selection (needs implementation)
- ❌ Character-specific prompts (needs implementation)
- ❌ Character context persistence (needs implementation)

## Development Patterns & Conventions

### 1. Client-Side Patterns
- **'use client'** directive for interactive components
- React Hooks for state management
- TypeScript interfaces for type safety
- Custom hooks for authentication (`useAuth`)

### 2. API Design
- RESTful API routes using Next.js App Router
- Consistent error handling patterns
- Request/response type safety
- Environment variable configuration

### 3. Styling Approach
- **Tailwind CSS 4** with PostCSS integration
- Component-scoped styling
- Responsive design patterns
- Custom CSS variables for theming
- Dark mode support via media queries

### 4. TypeScript Configuration
- Strict mode enabled
- Path aliases (`@/*` for `/src/*`)
- Modern ES2017+ target
- Next.js plugin integration

## Environment Dependencies

### Required Environment Variables
```bash
# AI API Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NextAuth Configuration
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint
```

## Key Features & Capabilities

### 1. Multi-Modal AI Chat
- Switch between GPT-3.5 and Claude mid-conversation
- Persistent conversation history during session
- Korean-optimized system prompts for both models

### 2. Flexible Authentication
- Guest mode for immediate access
- Email/password registration via Supabase
- Google OAuth via NextAuth
- Seamless auth state management

### 3. Responsive Design
- Mobile-first approach with Tailwind
- Gradient backgrounds and modern UI
- Loading states and error handling
- Real-time typing indicators

### 4. Korean Localization
- Korean UI text throughout
- AI prompts optimized for Korean responses
- Cultural context in AI system prompts

## Technical Considerations

### 1. Scalability
- Stateless API design
- Client-side state management
- Modular architecture with clear separation

### 2. Security
- Environment variable configuration
- API key protection
- Authentication state validation
- Error message sanitization

### 3. Performance
- Next.js App Router optimization
- Component lazy loading patterns
- Efficient re-rendering with React hooks
- Tailwind CSS optimization

### 4. Maintainability
- TypeScript for type safety
- Clear component structure
- Consistent naming conventions
- Modular context providers

## Recommended Features Based on Commercial Apps

Based on analysis of Character.AI, Replika, and Chai App, here are additional features to consider for mobile app launch:

### 1. Character Discovery & Social Features
- **Character Gallery**: Browse popular/trending characters created by community
- **Character Categories**: Helper, Creative, Entertainment, Educational, etc.
- **Character Ratings**: User rating system for quality control
- **Featured Characters**: Curated character recommendations

### 2. Enhanced Character Creation
- **Visual Avatar Creator**: Simple avatar customization system
- **Character Templates**: Pre-built personality templates users can customize
- **Voice Selection**: Different voice personalities (for future voice features)
- **Character Backstory Generator**: AI-assisted character background creation

### 3. Engagement & Retention Features
- **Conversation History**: Save and resume conversations across sessions
- **Character Relationships**: Track relationship levels with different characters
- **Daily Check-ins**: Encourage daily interaction with favorite characters
- **Character Personalities**: Dynamic personality evolution based on interactions

### 4. Monetization Opportunities
- **Premium Characters**: Access to exclusive, high-quality characters
- **Enhanced AI Models**: Premium users get access to GPT-4 or Claude 3 Opus
- **Unlimited Messages**: Free users get daily message limits
- **Character Creation Limits**: Free users limited to 1-2 custom characters

### 5. Safety & Moderation
- **Content Filtering**: Automatic detection of inappropriate content
- **Character Moderation**: Review system for user-created characters
- **Report System**: Users can report problematic characters or conversations
- **Age-Appropriate Filtering**: Different character sets for different age groups

### 6. Email Collection Strategy
- **Early Access Waitlist**: "Join 10,000+ users waiting for mobile app"
- **Feature Updates**: Email subscribers get notified of new features
- **Character Creation Queue**: Premium features available first to email subscribers
- **Beta Testing Program**: Email list members get early access to mobile beta

## MVP Implementation Priority

### Phase 1 (Current Sprint)
1. ✅ Basic character selection system
2. ✅ Character database integration
3. ✅ Email collection landing page
4. ✅ Character creation form

### Phase 2 (Next Sprint)
1. Character gallery/discovery
2. User-created character management
3. Basic character categories
4. Conversation history persistence

### Phase 3 (Pre-Launch)
1. Character rating system
2. Enhanced character creation tools
3. Social features (sharing characters)
4. Mobile app announcement integration

## Development Workflow

1. **Setup**: Install dependencies and configure environment variables
2. **Character System**: Implement character database and selection system
3. **Email Collection**: Add waitlist signup forms and email integration
4. **Development**: Use `npm run dev` for hot-reload development
5. **Testing**: Test character creation, selection, and chat flows
6. **Deployment**: Configure production environment with email collection analytics

This MVP serves as a market validation tool while building an engaged user base for the upcoming mobile app launch.