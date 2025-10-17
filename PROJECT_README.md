# AI 채용 콘텐츠 제작 플랫폼

## 프로젝트 개요
중소기업 채용 담당자를 위한 AI 기반 채용 콘텐츠 자동 생성 플랫폼입니다.
기본적인 채용 정보만 입력하면 AI가 전문적인 채용 공고 포스터, 웹 배너, HTML 페이지를 자동으로 생성합니다.

## 기술 스택

### 프론트엔드 (Port: 3055)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **State Management**: Zustand 4.x
- **Styling**: Tailwind CSS 3.x
- **HTTP Client**: Axios 1.x

### 백엔드 (Port: 3056)
- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 16.x
- **ORM**: Prisma 5.x
- **AI API**: Google Gemini API

## 프로젝트 구조

```
chatJobmoa-version-2.0/
├── frontend/                    # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── page.tsx       # 메인 랜딩 페이지 (PGE-001)
│   │   │   └── layout.tsx     # 루트 레이아웃
│   │   ├── components/         # React 컴포넌트
│   │   │   ├── common/        # 공통 UI 컴포넌트
│   │   │   │   └── Button.tsx
│   │   │   └── layout/        # 레이아웃 컴포넌트
│   │   ├── services/          # API 통신 서비스
│   │   ├── store/             # Zustand 상태 관리
│   │   ├── utils/             # 유틸리티 함수
│   │   └── styles/            # 글로벌 스타일
│   │       └── globals.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
├── backend/                     # NestJS 백엔드
│   ├── src/
│   │   ├── controllers/        # API 컨트롤러
│   │   ├── services/          # 비즈니스 로직
│   │   ├── models/            # 데이터 모델
│   │   ├── routes/            # 라우팅
│   │   ├── utils/             # 유틸리티
│   │   ├── app.module.ts      # 루트 모듈
│   │   ├── app.controller.ts  # 루트 컨트롤러
│   │   ├── app.service.ts     # 루트 서비스
│   │   └── main.ts            # 엔트리 포인트
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .env.example
│
└── Docs/                        # 프로젝트 문서
    └── module_markdown/
        └── PGE-001.md          # 메인 랜딩 페이지 기능명세서
```

## 시작하기

### 사전 요구사항
- Node.js v20.x 이상
- npm
- PostgreSQL 16.x
- IntelliJ IDEA Ultimate

### 설치 및 실행

#### 1. 프론트엔드 설정
```bash
cd frontend
npm install
npm run dev
```
프론트엔드는 http://localhost:3055 에서 실행됩니다.

#### 2. 백엔드 설정
```bash
cd backend
npm install

# .env 파일 생성 (env.example 참고)
cp .env.example .env

# 개발 서버 실행
npm run start:dev
```
백엔드는 http://localhost:3056 에서 실행됩니다.

## 구현된 기능

### PGE-001: 메인 랜딩 페이지
- [x] 서비스 소개 페이지 (`/src/app/page.tsx`)
- [x] 핵심 가치 제안 섹션
- [x] 주요 기능 소개 (AI 포스터, 웹 배너, HTML 생성)
- [x] 타겟 사용자별 혜택 안내
- [x] CTA 버튼 (회원가입/로그인)
- [x] 반응형 디자인 (Tailwind CSS)

### 공통 UI 컴포넌트
- [x] Button 컴포넌트 (Primary, Secondary, Accent 변형)
- [x] 디자인 시스템 (색상, 타이포그래피)

## 개발 규칙

### 코딩 컨벤션
- **타입 안정성**: `any` 타입 사용 금지, TypeScript strict mode 사용
- **컴포넌트**: 함수형 컴포넌트와 Hooks만 사용
- **비동기 처리**: async/await와 try/catch 사용
- **내보내기**: Named Exports 사용 (`export default` 금지)
- **임포트**: 절대 경로 (`@/components`) 사용
- **스타일링**: Tailwind CSS 유틸리티 클래스만 사용 (별도 CSS 파일 금지)

### 아키텍처 원칙
1. **모듈화 (Modularity)**: 관련 기능을 응집도 높게 독립적인 단위로 구성
2. **재사용성 (Reusability)**: 공통 로직과 UI를 범용적인 형태로 제작
3. **낮은 결합도 (Loose Coupling)**: 모듈 간 의존성 최소화

## 문서
- [제품 요구사항 명세서 (PRD)](.aiassistant/rules/Project_PRD.md)
- [UI 디자인 가이드](.aiassistant/rules/design_guide.md)
- [기술 설정 가이드](.aiassistant/rules/project_setting.md)
- [PGE-001 기능명세서](Docs/module_markdown/PGE-001.md)

## 라이선스
Private Project

## 작성자
프로젝트 팀
