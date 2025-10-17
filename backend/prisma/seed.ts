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
            userId: user1.id, // user1 또는 다른 유저 ID
            title: '[채용연계형] 서비스 기획 인턴 모집',
            companyName: '(주)스타트업캠프',
            jobType: '기획/PM',
            position: '서비스 기획자 (인턴)',
            careerLevel: '신입/인턴 (경력 무관)',
            employmentType: '인턴 (3개월 근무 후 정규직 전환 검토)',
            salaryRange: '월 250만원 (인턴 급여)',
            workLocation: '서울 서초구 (강남역)',
            companyIntro: '스타트업캠프는 차세대 유니콘을 꿈꾸는 초기 스타트업을 위한 액셀러레이터입니다. 다양한 산업의 성장을 돕는 플랫폼을 운영합니다.',
            companyCulture: `[주요 업무]
- 신규 서비스 아이템 발굴 및 시장 조사
- 서비스 정책 수립 및 기능 명세서(IA) 작성
- 스토리보드(화면 설계) 작성
- 개발/디자인팀과의 커뮤니케이션 및 일정 조율 보조

[자격 요건]
- 4년제 대학 졸업(예정)자
- IT 서비스 및 스타트업 생태계에 대한 높은 관심
- 논리적인 사고와 원활한 커뮤니케이션 능력
- MS Office (PPT, Excel) 활용 능력 우수

[우대 사항]
- 기획 관련 공모전 수상 또는 동아리 활동 경험
- Figma, Sketch 등 와이어프레임 툴 사용 경험
- 개발/디자인에 대한 기본적인 이해`,
            benefits: `[복리후생 (인턴)]
- 4대 보험 가입
- 중식 제공 및 무제한 스낵바 운영
- 현업 실무진의 체계적인 1:1 멘토링
- 인턴 기간 수료증 발급
- 정규직 전환 시 스톡옵션 부여 기회`,
            status: 'published', // 'published' (게시됨) 또는 'draft' (임시저장)
        },
    });

  const jobPosting2 = await prisma.jobPosting.create({
    data: {
      userId: user1.id,
      title: '백엔드 개발자 (Node.js) 모집',
      companyName: '(주)테크스타트',
      jobType: 'IT/소프트웨어',
      position: '백엔드 개발자',
        careerLevel: '경력 3년 이상',
        employmentType: '정규직',
        salaryRange: '연봉 4,500~7,000만원',
        workLocation: '서울 강남구',
        companyIntro: `테크스타트는 혁신적인 기술로 세상을 변화시키는 IT 기업입니다.
        기술 중심의 문화, 끊임없는 학습과 성장을 추구합니다.`,
        companyCulture: `확장 가능한 백엔드 시스템을 설계하고 구현할 백엔드 개발자를 찾습니다.

[주요 업무]
- Node.js/NestJS 기반 API 서버 개발
- 데이터베이스 설계 및 최적화
- AWS 기반 클라우드 인프라 관리
- RESTful API 설계 및 구현
        [자격 요건]
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
      status: 'draft',
    },
  });

    const jobPosting3 = await prisma.jobPosting.create({
        data: {
            userId: user1.id, // user1 또는 다른 유저 ID
            title: 'React 프론트엔드 개발자 채용 (신입/경력)',
            companyName: '(주)웹프론티어',
            jobType: 'IT/웹개발',
            position: '프론트엔드 개발자',
            careerLevel: '신입/경력 1년 이상',
            employmentType: '정규직 (수습 3개월)',
            salaryRange: '연봉 3,500~5,000만원',
            workLocation: '서울 마포구 (홍대입구역)',
            companyIntro: '웹프론티어는 사용자 경험(UX)을 최우선으로 생각하는 디자인 중심의 IT 기업입니다. 자유로운 분위기에서 함께 성장할 동료를 찾습니다.',
            companyCulture: `[주요 업무]
- React, Next.js 기반 웹 서비스 개발 및 운영
- UI/UX 디자이너와의 협업을 통한 화면 구현
- 웹 표준 및 접근성을 준수한 시맨틱 마크업
- 코드 리뷰 및 웹 성능 최적화

[자격 요건]
- React, JavaScript(ES6+), TypeScript에 대한 이해
- HTML/CSS에 대한 깊은 이해
- Git을 이용한 버전 관리 경험
- 새로운 기술 학습에 대한 열정

[우대 사항]
- Next.js 또는 SSR 경험
- Storybook 등 UI 테스트 도구 경험
- 상태 관리 라이브러리 (Recoil, Zustand) 사용 경험
- 백엔드 API 연동 경험`,
            benefits: `[복리후생]
- 유연근무제 (9시~11시 자율 출근)
- 중식 식대 제공
- 무제한 간식 및 커피 제공
- 연차 외 리프레시 휴가 (연 3일)
- 생일 당일 유급 휴가 및 상품권
- 사내 스터디 및 동호회 지원`,
            status: 'published',
        },
    });

    const jobPosting4 = await prisma.jobPosting.create({
        data: {
            userId: user2.id, // user2 또는 다른 유저 ID
            title: '[경력] 퍼포먼스 마케터 모집',
            companyName: '(주)그로스해커스',
            jobType: '마케팅/광고',
            position: '퍼포먼스 마케터',
            careerLevel: '경력 2년 이상',
            employmentType: '정규직',
            salaryRange: '연봉 4,000~6,000만원',
            workLocation: '경기 성남시 분당구 (판교역)',
            companyIntro: '그로스해커스는 데이터 기반의 마케팅 전략을 통해 고객사의 폭발적인 성장을 돕는 전문 에이전시입니다.',
            companyCulture: `[주요 업무]
- 검색 광고(SA) 및 디스플레이 광고(DA) 운영
- 페이스북, 구글, 네이버 등 주요 매체 광고 효율 분석 및 최적화
- A/B 테스트 기획 및 실행, 랜딩 페이지 최적화 (LPO)
- 마케팅 성과 데이터 분석 및 리포팅

[자격 요건]
- 퍼포먼스 마케팅 실무 경력 2년 이상
- GA, GTM 등 데이터 분석 툴 활용 능력
- 데이터에 기반한 논리적 사고 및 문제 해결 능력
- 주도적인 업무 수행 능력

[우대 사항]
- 스타트업 또는 광고 에이전시 근무 경험
- SQL 활용 능력
- CRM 마케팅 또는 그로스 해킹 경험`,
            benefits: `[복리후생]
- 분기별 성과 기반 인센티브 지급
- 마케팅 관련 교육/세미나비 전액 지원
- 자유로운 연차 사용 (반반차 가능)
- 통신비 지원
- 도서 구입비 무제한 지원
- 사내 카페테리아 운영`,
            status: 'published',
        },
    });

    const jobPosting5 = await prisma.jobPosting.create({
        data: {
            userId: user1.id, // user1 또는 다른 유저 ID
            title: '[경력] 모바일 앱 UI/UX 디자이너 채용',
            companyName: '(주)크리에이티브 스튜디오',
            jobType: '디자인',
            position: 'UI/UX 디자이너',
            careerLevel: '경력 5년 이상',
            employmentType: '정규직',
            salaryRange: '면접 후 협의',
            workLocation: '서울 성동구 (성수동)',
            companyIntro: '저희는 감각적인 디자인과 사용자 편의성을 동시에 추구하는 디자인 전문 스튜디오입니다. 최고의 동료들과 함께 멋진 서비스를 만들어갈 디자이너를 찾습니다.',
            companyCulture: `[주요 업무]
- 모바일 앱/웹 서비스의 UI/UX 설계
- 사용자 리서치, 페르소나 정의, 유저 저니맵 작성
- 와이어프레임 및 프로토타이핑 (Figma, Protopie)
- 디자인 시스템 구축 및 관리
- 기획자, 개발자와의 긴밀한 협업

[자격 요건]
- UI/UX 디자인 실무 경력 5년 이상 (또는 그에 준하는 역량)
- Figma, Sketch 등 디자인 툴 활용 능력 최상
- 논리적인 디자인 설계 및 근거 제시 능력
- 포트폴리오 제출 필수

[우대 사항]
- 디자인 시스템 구축 및 운영 경험
- 개발 프로세스에 대한 높은 이해도
- 인터랙션 디자인 경험
- 사용자 데이터 분석 및 활용 경험`,
            benefits: `[복리후생]
- 주 1회 재택근무 시행
- 최고 사양 디자인 장비 지원 (맥북 프로, 4K 모니터)
- 디자인 관련 유료 구독 서비스 지원 (Adobe CC, Zeplin 등)
- 자율 복장 및 유연한 출퇴근
- 점심 식대 및 야근 시 저녁/교통비 지원
- 체력단련비 지원`,
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
