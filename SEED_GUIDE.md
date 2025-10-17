# 테스트 데이터 생성 가이드

## 개요
이 가이드는 개발/테스트 환경에서 목업(Mock) 데이터를 생성하는 방법을 설명합니다.

## 생성되는 데이터

### 1. 테스트 사용자 계정 (2개)

#### 계정 1 - 일반 사용자
- **이메일**: `test@example.com`
- **비밀번호**: `Test1234!`
- **전화번호**: `01012345678`
- **마케팅 동의**: 비동의

#### 계정 2 - 데모 사용자
- **이메일**: `demo@jobmoa.com`
- **비밀번호**: `Test1234!`
- **전화번호**: `01087654321`
- **마케팅 동의**: 동의

### 2. 채용 공고 데이터 (4개)

#### 사용자 1 (test@example.com) - 2개 공고
1. **프론트엔드 개발자 모집** - (주)테크스타트
   - 직종: IT/소프트웨어
   - 경력: 2~5년
   - 연봉: 4,000~6,000만원
   - 위치: 서울 강남구

2. **백엔드 개발자 (Node.js) 모집** - (주)테크스타트
   - 직종: IT/소프트웨어
   - 경력: 3년 이상
   - 연봉: 4,500~7,000만원
   - 위치: 서울 강남구

#### 사용자 2 (demo@jobmoa.com) - 2개 공고
3. **UI/UX 디자이너 채용** - 디자인랩
   - 직종: 디자인
   - 경력: 2년 이상
   - 연봉: 3,500~5,000만원
   - 위치: 서울 마포구

4. **마케팅 담당자 모집** - 디자인랩
   - 직종: 마케팅/광고
   - 경력: 신입~경력 3년
   - 연봉: 3,000~4,500만원
   - 위치: 서울 마포구

## 실행 방법

### 사전 준비
1. PostgreSQL 설치 및 실행
2. 백엔드 의존성 설치
```bash
cd backend
npm install
```

3. 환경변수 설정 (.env 파일 생성)
```bash
cp .env.example .env
# .env 파일에서 DATABASE_URL 설정
# 예: DATABASE_URL="postgresql://user:password@localhost:5432/ai_recruit_platform?schema=public"
```

### Seed 실행

#### 방법 1: 마이그레이션과 함께 실행
```bash
cd backend

# 데이터베이스 마이그레이션 (최초 1회)
npx prisma migrate dev --name init

# Seed 데이터 생성
npm run prisma:seed
```

#### 방법 2: 마이그레이션 시 자동 실행
```bash
cd backend

# 마이그레이션 실행 시 seed가 자동으로 실행됩니다
npx prisma migrate reset
```

### 실행 결과 확인
성공 시 다음과 같은 메시지가 출력됩니다:
```
🌱 Starting seed...
✅ Cleared existing data
✅ Created test users: { user1: 'test@example.com', user2: 'demo@jobmoa.com' }
✅ Created job postings: {
  jobPosting1: '프론트엔드 개발자 모집',
  jobPosting2: '백엔드 개발자 (Node.js) 모집',
  jobPosting3: 'UI/UX 디자이너 채용',
  jobPosting4: '마케팅 담당자 모집'
}
🎉 Seed completed successfully!

📝 Test Accounts:
1. Email: test@example.com
   Password: Test1234!
   Phone: 01012345678

2. Email: demo@jobmoa.com
   Password: Test1234!
   Phone: 01087654321
```

## 데이터 확인

### Prisma Studio로 확인
```bash
cd backend
npm run prisma:studio
```
브라우저에서 http://localhost:5555 접속하여 데이터 확인

### 프론트엔드에서 확인
1. 프론트엔드 서버 실행
```bash
cd frontend
npm run dev
```

2. http://localhost:3055/login 접속
3. 테스트 계정으로 로그인
4. 대시보드에서 채용 공고 확인 (향후 PRJ-001 구현 후)

## 주의사항

⚠️ **경고**: Seed 실행 시 기존 데이터가 모두 삭제됩니다!
- `prisma.user.deleteMany()`
- `prisma.jobPosting.deleteMany()`
- `prisma.verification.deleteMany()`

운영 환경에서는 절대 실행하지 마세요!

## 문제 해결

### 1. "PrismaClientValidationError: Unknown argument `url`"
- PostgreSQL이 실행 중인지 확인
- .env 파일의 DATABASE_URL이 올바른지 확인

### 2. "Error: P1001: Can't reach database server"
- PostgreSQL 서버가 실행 중인지 확인
- 데이터베이스가 생성되어 있는지 확인

### 3. "ts-node: command not found"
```bash
cd backend
npm install ts-node --save-dev
```

### 4. Seed 재실행
데이터를 초기화하고 다시 생성하려면:
```bash
cd backend
npm run prisma:seed
```

## 추가 명령어

```bash
# Prisma Client 재생성
npm run prisma:generate

# 마이그레이션 생성
npm run prisma:migrate

# Prisma Studio 실행 (GUI)
npm run prisma:studio

# 모든 데이터 초기화 및 재생성
npx prisma migrate reset
```

## 다음 단계

Seed 데이터 생성 후:
1. 테스트 계정으로 로그인 테스트
2. 채용 공고 목록 조회 API 테스트 (PRJ-001)
3. 채용 공고 상세 조회 테스트
4. AI 기능 테스트 준비

## 참고 파일
- `backend/prisma/schema.prisma` - 데이터베이스 스키마
- `backend/prisma/seed.ts` - Seed 스크립트
- `backend/package.json` - Seed 실행 명령어
