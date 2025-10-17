import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 기존 데이터 삭제 (개발 환경에서만)
  await prisma.jobPosting.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // 테스트 사용자 생성
  const hashedPassword = await bcrypt.hash('Test1234!', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      phoneNumber: '01012345678',
      emailVerified: true,
      phoneVerified: true,
      termsAgreedAt: new Date(),
      marketingAgreement: false,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'demo@jobmoa.com',
      password: hashedPassword,
      phoneNumber: '01087654321',
      emailVerified: true,
      phoneVerified: true,
      termsAgreedAt: new Date(),
      marketingAgreement: true,
    },
  });

  console.log('✅ Created test users:', {
    user1: user1.email,
    user2: user2.email,
  });

  // 채용 공고 목업 데이터 생성
  const jobPosting1 = await prisma.jobPosting.create({
    data: {
      userId: user1.id,
      title: '프론트엔드 개발자 모집',
      companyName: '(주)테크스타트',
      jobType: 'IT/소프트웨어',
      position: '프론트엔드 개발자',
      experience: '경력 2~5년',
      employment: '정규직',
      salary: '연봉 4,000~6,000만원',
      location: '서울 강남구',
      description: `저희 테크스타트는 혁신적인 웹 서비스를 개발하는 IT 스타트업입니다.
함께 성장할 프론트엔드 개발자를 찾고 있습니다.

[주요 업무]
- React/Next.js 기반 웹 서비스 개발
- UI/UX 개선 및 최적화
- RESTful API 연동
- 반응형 웹 디자인 구현`,
      requirements: `[자격 요건]
- React, TypeScript 실무 경험 2년 이상
- HTML5, CSS3, JavaScript ES6+ 능숙
- Git을 이용한 협업 경험
- 반응형 웹 디자인 경험

[우대 사항]
- Next.js 프레임워크 사용 경험
- 상태 관리 라이브러리 (Redux, Zustand 등) 경험
- UI 컴포넌트 라이브러리 개발 경험
- 웹 성능 최적화 경험`,
      benefits: `[복리후생]
- 4대 보험 가입
- 점심 식대 지원
- 자기계발비 지원 (연 100만원)
- 최신 개발 장비 제공
- 유연 근무제
- 연차 사용 자유
- 경조사 지원`,
      companyInfo: `테크스타트는 2020년 설립된 IT 스타트업으로,
혁신적인 웹/모바일 서비스를 개발하고 있습니다.
직원 수: 30명
업종: IT 서비스`,
      culture: `수평적인 조직문화와 자유로운 소통을 지향합니다.
개인의 성장이 곧 회사의 성장이라고 믿습니다.`,
      status: 'draft',
    },
  });

  const jobPosting2 = await prisma.jobPosting.create({
    data: {
      userId: user1.id,
      title: '백엔드 개발자 (Node.js) 모집',
      companyName: '(주)테크스타트',
      jobType: 'IT/소프트웨어',
      position: '백엔드 개발자',
      experience: '경력 3년 이상',
      employment: '정규직',
      salary: '연봉 4,500~7,000만원',
      location: '서울 강남구',
      description: `확장 가능한 백엔드 시스템을 설계하고 구현할 백엔드 개발자를 찾습니다.

[주요 업무]
- Node.js/NestJS 기반 API 서버 개발
- 데이터베이스 설계 및 최적화
- AWS 기반 클라우드 인프라 관리
- RESTful API 설계 및 구현`,
      requirements: `[자격 요건]
- Node.js 실무 경험 3년 이상
- RDBMS (PostgreSQL, MySQL) 사용 경험
- RESTful API 설계 및 개발 경험
- Git 버전 관리 능숙

[우대 사항]
- NestJS 프레임워크 경험
- TypeScript 사용 경험
- AWS 서비스 (EC2, RDS, S3 등) 경험
- Docker, Kubernetes 사용 경험
- 대용량 트래픽 처리 경험`,
      benefits: `[복리후생]
- 4대 보험 가입
- 점심/저녁 식대 지원
- 자기계발비 지원 (연 150만원)
- 최신 개발 장비 제공
- 재택근무 가능
- 도서 구입비 지원
- 건강검진 지원`,
      companyInfo: `테크스타트는 혁신적인 기술로 세상을 변화시키는 IT 기업입니다.`,
      culture: `기술 중심의 문화, 끊임없는 학습과 성장을 추구합니다.`,
      status: 'draft',
    },
  });

  const jobPosting3 = await prisma.jobPosting.create({
    data: {
      userId: user2.id,
      title: 'UI/UX 디자이너 채용',
      companyName: '디자인랩',
      jobType: '디자인',
      position: 'UI/UX 디자이너',
      experience: '경력 2년 이상',
      employment: '정규직',
      salary: '연봉 3,500~5,000만원',
      location: '서울 마포구',
      description: `사용자 경험을 최우선으로 생각하는 UI/UX 디자이너를 모집합니다.

[주요 업무]
- 웹/모바일 서비스 UI/UX 디자인
- 사용자 리서치 및 분석
- 와이어프레임 및 프로토타입 제작
- 디자인 시스템 구축 및 관리`,
      requirements: `[자격 요건]
- Figma, Sketch 등 디자인 툴 능숙
- UI/UX 디자인 실무 경험 2년 이상
- 사용자 중심 디자인 철학 이해
- 커뮤니케이션 능력 우수

[우대 사항]
- 포트폴리오 보유
- HTML/CSS 기본 지식
- 디자인 시스템 구축 경험
- 애니메이션/인터랙션 디자인 경험`,
      benefits: `[복리후생]
- 4대 보험 가입
- 중식 제공
- 자기계발비 지원
- 최신 장비 제공 (맥북, 듀얼 모니터)
- 유연 출퇴근제
- 연차 자유 사용`,
      companyInfo: `디자인랩은 사용자 경험을 중시하는 디자인 전문 기업입니다.
직원 수: 15명`,
      culture: `크리에이티브한 환경에서 자유롭게 아이디어를 나누고 실현합니다.`,
      status: 'draft',
    },
  });

  const jobPosting4 = await prisma.jobPosting.create({
    data: {
      userId: user2.id,
      title: '마케팅 담당자 모집',
      companyName: '디자인랩',
      jobType: '마케팅/광고',
      position: '디지털 마케팅',
      experience: '신입~경력 3년',
      employment: '정규직',
      salary: '연봉 3,000~4,500만원',
      location: '서울 마포구',
      description: `디지털 마케팅 전략을 수립하고 실행할 마케팅 담당자를 찾습니다.

[주요 업무]
- 디지털 마케팅 전략 수립 및 실행
- SNS 채널 운영 및 콘텐츠 제작
- 광고 캠페인 기획 및 운영
- 마케팅 성과 분석 및 리포팅`,
      requirements: `[자격 요건]
- 디지털 마케팅 관심도가 높은 분
- SNS 활용 능력 우수
- 데이터 분석 능력
- MS Office 능숙

[우대 사항]
- 디지털 마케팅 실무 경험
- 구글 애널리틱스 사용 경험
- 콘텐츠 제작 능력
- 광고 집행 경험 (페이스북, 인스타그램, 구글 등)`,
      benefits: `[복리후생]
- 4대 보험
- 중식 제공
- 자기계발비 지원
- 도서 구입비
- 연차 사용 자유`,
      companyInfo: `디자인랩은 창의적인 솔루션을 제공하는 디자인 기업입니다.`,
      culture: `열정과 창의성을 중시하며, 함께 성장하는 문화를 만들어갑니다.`,
      status: 'draft',
    },
  });

  console.log('✅ Created job postings:', {
    jobPosting1: jobPosting1.title,
    jobPosting2: jobPosting2.title,
    jobPosting3: jobPosting3.title,
    jobPosting4: jobPosting4.title,
  });

  console.log('🎉 Seed completed successfully!');
  console.log('\n📝 Test Accounts:');
  console.log('1. Email: test@example.com');
  console.log('   Password: Test1234!');
  console.log('   Phone: 01012345678');
  console.log('\n2. Email: demo@jobmoa.com');
  console.log('   Password: Test1234!');
  console.log('   Phone: 01087654321');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
