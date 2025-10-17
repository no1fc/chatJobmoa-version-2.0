# AI 채용 콘텐츠 제작 플랫폼: 백엔드 기능 명세서 (상세 v1)

## PRJ-001: 채용 프로젝트 생성 및 관리

본 기능은 인증된 사용자가 자신의 채용 공고 프로젝트를 생성, 조회, 수정, 삭제하는 **CRUD(Create, Read, Update, Delete)** 작업을 담당합니다. 생성된 프로젝트는 `INP-*` 기능들을 통해 상세 내용이 채워지는 기반 데이터가 됩니다.

### 1\. 사용자 시나리오 (User Scenario)

* **프로젝트 생성:** 김 대리는 로그인 후 대시보드(`/dashboard`)에서 '새 프로젝트 시작하기' 버튼을 클릭하여 `/new` 페이지로 이동합니다. '백엔드 개발자 채용'이라는 제목을 입력하고 '프로젝트 생성' 버튼을 클릭합니다. 생성 성공 후, 해당 프로젝트의 상세 정보 입력 페이지(`/posting/[id]`/page.tsx])로 이동합니다.
* **프로젝트 목록 조회:** 김 대리가 대시보드(`/dashboard`)에 접속하자, 자신이 생성한 프로젝트 목록(제목, 상태, 최종 수정일)이 최신순으로 표시됩니다.
* **프로젝트 수정:** 김 대리는 대시보드 목록에서 '수정' 버튼을 클릭하여 `/posting/[id]`/page.tsx] 페이지로 이동합니다. 프로젝트 제목을 '시니어 백엔드 개발자 채용'으로 변경하고 '저장하기' 버튼을 클릭합니다.
* **프로젝트 삭제:** 김 대리는 대시보드 목록에서 특정 프로젝트의 '삭제' 버튼을 클릭하고 확인 팝업에서 '확인'을 누릅니다. 해당 프로젝트가 목록에서 사라집니다.

### 2\. API 명세 (API Specification)

**공통 사항:** 모든 API는 `Authorization: Bearer <accessToken>` 헤더가 필요하며, `AuthGuard('jwt')`를 통해 인증됩니다.

#### 2.1. 새 채용 프로젝트 생성 (Create)

* **Endpoint:** `POST /postings`
* **Description:** 사용자의 새 채용 프로젝트를 초기 상태로 생성합니다.
* **Request:**
    * **Body (`CreatePostingDto`):**
      ```json
      {
        "title": "시니어 백엔드 개발자 채용"
      }
      ```
* **Response:**
    * **Success (201 Created):** 생성된 `JobPosting` 객체 반환.
      ```json
      {
        "id": "clx123abcde",
        "title": "시니어 백엔드 개발자 채용",
        "status": "DRAFT",
        "createdAt": "2025-10-17T02:30:00.000Z",
        "updatedAt": "2025-10-17T02:30:00.000Z",
        "userId": "user-cuid-12345",
        // ... (나머지 필드는 null 또는 default 값)
      }
      ```
    * **Error (400 Bad Request):** `title` 누락 시 (ValidationPipe).
    * **Error (401 Unauthorized):** JWT 토큰 누락 또는 유효하지 않음.

#### 2.2. 내 채용 프로젝트 목록 조회 (Read - List)

* **Endpoint:** `GET /postings`
* **Description:** 현재 로그인한 사용자의 프로젝트 목록을 페이징하여 조회합니다.
* **Request (`GetPostingsQueryDto`):**
    * Query Parameters: `page` (기본 1), `limit` (기본 10), `sortBy` (기본 'createdAt'), `order` (기본 'desc')
* **Response:**
    * **Success (200 OK):** `PostingListResponse` 객체 반환.
      ```json
      {
        "data": [
          { "id": "...", "title": "...", "status": "...", "updatedAt": "..." },
          // ...
        ],
        "meta": {
          "totalItems": 15,
          "currentPage": 1,
          "totalPages": 2
        }
      }
      ```
    * **Error (401 Unauthorized):** JWT 토큰 누락 또는 유효하지 않음.

#### 2.3. 특정 채용 프로젝트 상세 조회 (Read - Detail)

* **Endpoint:** `GET /postings/:id`
* **Description:** 특정 ID의 프로젝트 상세 정보를 조회합니다.
* **Request:**
    * **Path Variable:** `id` (프로젝트 CUID)
* **Response:**
    * **Success (200 OK):** `JobPosting` 전체 객체 반환.
    * **Error (401 Unauthorized):** JWT 토큰 누락 또는 유효하지 않음.
    * **Error (404 Not Found):** 프로젝트가 없거나 소유주가 아님.

#### 2.4. 채용 프로젝트 수정 (Update)

* **Endpoint:** `PATCH /postings/:id`
* **Description:** 특정 프로젝트의 정보를 부분적으로 수정합니다. **이 API는 `INP-*` 기능들의 텍스트/선택 값 저장을 담당합니다.**
* **Request:**
    * **Path Variable:** `id`
    * **Body (`UpdatePostingDto`):** (수정할 필드만 포함)
      ```json
      {
        "title": "새로운 제목",
        "companyName": "새 회사명"
        // ... 등 JobPosting 모델의 필드들
      }
      ```
* **Response:**
    * **Success (200 OK):** 수정된 `JobPosting` 전체 객체 반환.
    * **Error (400 Bad Request):** DTO 유효성 검사 실패 시 (ValidationPipe).
    * **Error (401 Unauthorized):** JWT 토큰 누락 또는 유효하지 않음.
    * **Error (404 Not Found):** 프로젝트가 없거나 소유주가 아님.

#### 2.5. 채용 프로젝트 삭제 (Delete)

* **Endpoint:** `DELETE /postings/:id`
* **Description:** 특정 프로젝트를 삭제합니다.
* **Request:**
    * **Path Variable:** `id`
* **Response:**
    * **Success (204 No Content):** Body 없음.
    * **Error (401 Unauthorized):** JWT 토큰 누락 또는 유효하지 않음.
    * **Error (404 Not Found):** 프로젝트가 없거나 소유주가 아님.

### 3\. 핵심 비즈니스 로직 (Core Business Logic)

* **인증 및 인가 (`posting.service.ts`):**
    * 모든 요청에 대해 `AuthGuard('jwt')`를 통해 JWT 토큰을 검증하고 `req.user` (`{ userId, email }`) 를 주입받습니다.
    * `findOne`, `update`, `remove` 메소드에서는 Prisma 쿼리 시 `where: { id: postingId, userId: userId }` 조건을 사용하여 **요청자가 해당 프로젝트의 소유주인지 확인**합니다. 일치하는 프로젝트가 없으면 `NotFoundException`을 발생시킵니다.
* **생성 (`create`):** 요청받은 `title`과 인증된 `userId`를 사용하여 새 `JobPosting` 레코드를 생성하고, `status`는 'DRAFT'로 초기화합니다.
* **수정 (`update`):** 소유권 확인 후, `UpdatePostingDto`에 포함된 필드만 Prisma의 `update` 메소드를 통해 업데이트합니다. `updatedAt`은 자동으로 갱신됩니다.
* **삭제 (`remove`):** 소유권 확인 후, Prisma의 `delete` 메소드를 통해 레코드를 삭제합니다. `User` 모델과의 관계에서 `onDelete: Cascade`가 설정되어 있어 관련 데이터가 함께 삭제될 수 있습니다.

### 4\. 데이터 모델 (Data Model)

* **ORM:** Prisma
* **Database:** PostgreSQL
* **Model (`schema.prisma`):**
  ```prisma
  model JobPosting {
    id        String   @id @default(cuid()) //
    title     String
    status    String   @default("DRAFT")
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
    userId String @map("user_id")

    // ... (INP-* 및 GEN-* 관련 필드들, 추후 명세에서 상세 기술) ...

    @@index([userId])
    @@map("job_postings")
  }

  model User {
    id          String    @id @default(cuid())
    email       String    @unique
    // ... (USR-001 관련 필드들)
    jobPostings JobPosting[]
    @@map("users")
  }
  ```

### 5\. 예외 처리 (Exception Handling)

| HTTP Status          | 발생 상황 (Scenario)                     | 처리 주체                | 응답 메시지          |
| :------------------- | :--------------------------------------- | :----------------------- | :------------------- |
| **401 Unauthorized** | JWT 토큰 누락 또는 유효하지 않음.        | `AuthGuard`              | `"Unauthorized"`     |
| **404 Not Found** | 존재하지 않거나 소유하지 않은 `:id` 요청. | `posting.service.ts`     | `"Project not found."` |
| **400 Bad Request** | DTO 유효성 검사 실패 (e.g., `title` 누락). | `ValidationPipe`         | (필드별 오류 메시지) |

-----

## INP-001: 핵심 채용 정보 입력

본 기능은 `PRJ-001`에서 생성된 채용 프로젝트에 공고의 뼈대가 되는 핵심 정보(회사명, 직종, 직무 등)를 입력하고 저장합니다.

### 1\. 사용자 시나리오 (User Scenario)

김 대리는 `/posting/[id]` 페이지/page.tsx]에서 '회사명', '직종', '직무', '경력 요건', '고용 형태', '급여 수준', '근무지' 필드를 입력하고 '저장하기' 버튼을 클릭합니다. 저장 성공 알림이 표시됩니다.

### 2\. API 명세 (API Specification)

* **Endpoint:** `PATCH /postings/:id` (**`PRJ-001` 재사용**)
* **Description:** 특정 프로젝트의 `INP-001` 관련 필드를 업데이트합니다.
* **Request:**
    * **Body (`UpdatePostingDto`):** (업데이트할 필드만 포함)
      ```json
      {
        "companyName": " (주)AI 솔루션즈", //
        "jobType": "IT/인터넷/통신", //
        "position": "시니어 백엔드 개발자", //
        "careerLevel": "SENIOR", //
        "employmentType": "FULL_TIME", //
        "salaryRange": "회사 내규에 따름", //
        "workLocation": "서울시 강남구" //
      }
      ```
* **Response:**
    * **Success (200 OK):** 수정된 `JobPosting` 전체 객체 반환.
    * **Error (400, 401, 404):** `PRJ-001`과 동일.

### 3\. 핵심 비즈니스 로직 (Core Business Logic)

* **`posting.controller.ts`의 `update` 메소드:**
    * `ValidationPipe`를 통해 `UpdatePostingDto`의 필드 유효성 검사 (e.g., `IsString`, `IsOptional`).
    * `posting.service.ts`의 `update` 메소드 호출.

### 4\. 데이터 모델 (Data Model)

* **Model (`schema.prisma` - 관련 필드):**
  ```prisma
  // ... JobPosting 모델 ...
    companyName    String? @map("company_name") //
    jobType       String? @map("jobType")        //
    position       String? @map("position")        //
    careerLevel    String? @map("career_level")     //
    employmentType String? @map("employment_type")  //
    salaryRange    String? @map("salary_range")     //
    workLocation   String? @map("work_location")    //
  // ...
  ```

### 5\. 예외 처리 (Exception Handling)

* `PRJ-001`의 `PATCH /postings/:id`와 동일.

-----

## INP-002: AI 키워드/자격요건 추천

사용자가 입력한 직종(`jobType`), 직무(`position`) 정보를 기반으로 AI가 채용 공고에 적합한 키워드와 자격요건을 추천합니다.

### 1\. 사용자 시나리오 (User Scenario)

김 대리가 `/posting/[id]` 페이지에서 직종과 직무를 입력한 후, 'AI 추천 받기' 버튼(Accent Button)을 클릭합니다. 잠시 후 버튼 근처 영역에 추천 키워드 목록과 추천 자격요건 목록이 표시됩니다.

### 2\. API 명세 (API Specification)

* **Endpoint:** `POST /ai/recommend/keywords` (**신규**)
* **Description:** 직무 정보를 바탕으로 AI에게 키워드 및 자격요건 추천을 요청합니다.
* **Request:**
    * **Headers:** `Authorization: Bearer <accessToken>`
    * **Body:**
      ```json
      {
        "jobType": "IT/인터넷/통신",
        "position": "시니어 백엔드 개발자"
      }
      ```
* **Response:**
    * **Success (200 OK):**
      ```json
      {
        "keywords": ["Java", "Spring Boot", "MSA", ...],
        "qualifications": ["대용량 트래픽 처리 경험", ...]
      }
      ```
    * **Error (400 Bad Request):** `jobType` 또는 `position` 누락 시.
    * **Error (401 Unauthorized):** JWT 토큰 누락 또는 유효하지 않음.
    * **Error (503 Service Unavailable):** AI API 호출 실패 시.

### 3\. 핵심 비즈니스 로직 (Core Business Logic)

1.  **`ai.controller.ts` (신규):** `@Post('/recommend/keywords')` 핸들러 구현, `AuthGuard` 적용.
2.  **`aiText.service.ts` (신규):**
    * **의존성 주입:** `ConfigService` (`GEMINI_API_KEY`), Gemini API 클라이언트 (별도 모듈화 권장).
    * **메소드 (`recommendKeywords`):**
        * 입력받은 `jobType`, `position`으로 프롬프트 생성 (예: "직종 '{jobType}', 직무 '{position}'에 대한 채용 공고 키워드 7개와 우대 자격요건 5개를 JSON 형식(`{\"keywords\": [...], \"qualifications\": [...]}`)으로 추천해줘.").
        * `project_setting.md`에 따라 Gemini API (`gemini-1.5-pro` 또는 `flash`) 호출.
        * 응답(JSON 문자열)을 파싱하여 객체로 반환. 파싱 실패 시 예외 처리.

### 4\. 데이터 모델 (Data Model)

* 이 기능은 DB에 직접 데이터를 저장하지 않으므로, 관련 모델 변경은 없습니다. `JobPosting` 테이블의 `jobType`, `position` 필드를 읽어서 AI 프롬프트에 사용합니다.

### 5\. 예외 처리 (Exception Handling)

| HTTP Status                 | 발생 상황 (Scenario)                       | 처리 주체                | 응답 메시지                                        |
| :-------------------------- | :----------------------------------------- | :----------------------- | :------------------------------------------------- |
| **400 Bad Request** | `jobType` 또는 `position` 누락.            | `ValidationPipe`         | `"jobType should not be empty"`                  |
| **401 Unauthorized** | JWT 토큰 누락 또는 유효하지 않음.          | `AuthGuard`              | `"Unauthorized"`                                   |
| **503 Service Unavailable** | Gemini API 호출 실패 (타임아웃, API 키 오류 등). | `aiText.service.ts`    | `"AI service unavailable."`                      |
| **500 Internal Server Error** | Gemini 응답 파싱 실패 등 예상치 못한 오류. | `aiText.service.ts`    | `"Failed to process AI recommendation."`         |

-----

## INP-003: 기업 정보 입력

채용 공고에 포함될 회사 소개, 문화, 복리후생 텍스트와 회사 로고 이미지를 입력받아 저장합니다.

### 1\. 사용자 시나리오 (User Scenario)

김 대리가 `/posting/[id]` 페이지에서 '회사 소개', '기업 문화', '복리후생' 텍스트 영역에 내용을 입력합니다/page.tsx]. '로고 업로드' 버튼을 클릭하여 로컬 파일을 선택하면 이미지가 업로드되고 미리보기가 표시됩니다. '저장하기' 버튼을 누릅니다.

### 2\. API 명세 (API Specification)

#### 2.1. 텍스트 정보 저장

* **Endpoint:** `PATCH /postings/:id` (**`PRJ-001` 재사용**)
* **Description:** `INP-003`의 텍스트 필드(`companyIntro`, `companyCulture`, `benefits`)를 업데이트합니다.
* **Request:**
    * **Body (`UpdatePostingDto`):**
      ```json
      {
        "companyIntro": "우리는...",
        "companyCulture": "자유로운 분위기...",
        "benefits": "- 식대 지원\n- 자율 출퇴근"
      }
      ```
* **Response:** `PRJ-001`과 동일.

#### 2.2. 회사 로고 이미지 업로드 (**수정된 요구사항 반영**)

* **Endpoint:** `POST /postings/:id/logo-upload` (**신규**)
* **Description:** 프로젝트(`:id`)의 로고 이미지를 서버에 업로드하고, **파일 접근 URL**을 DB에 저장합니다.
* **Request:**
    * **Headers:** `Authorization: Bearer <accessToken>`, `Content-Type: multipart/form-data`
    * **Body:** `file`: 이미지 파일 (e.g., `logo.png`)
* **Response:**
    * **Success (200 OK):** 업데이트된 `JobPosting` 객체 반환 (URL 포함).
      ```json
      {
        "id": "clx123abcde",
        // ...
        "logoImageUrl": "http://localhost:3056/uploads/logos/clx123abcde-timestamp.png", // 서버 URL 예시
        "updatedAt": "..."
      }
      ```
    * **Error (400 Bad Request):** 파일 누락, 이미지 파일 아님, 파일 크기 초과.
    * **Error (401 Unauthorized):** JWT 토큰 누락 또는 유효하지 않음.
    * **Error (404 Not Found):** 프로젝트가 없거나 소유주가 아님.
    * **Error (500 Internal Server Error):** 파일 저장 실패.

### 3\. 핵심 비즈니스 로직 (Core Business Logic)

* **텍스트 저장:** `PRJ-001`의 `update` 로직과 동일. `companyIntro`, `companyCulture`, `benefits` 필드는 `@db.Text` 타입이므로 긴 텍스트 저장 가능.
* **로고 업로드 (`posting.controller.ts` / `posting.service.ts`):**
    1.  **컨트롤러 설정:**
        * `@Post(':id/logo-upload')` 라우트 핸들러 추가.
        * `@UseInterceptors(FileInterceptor('file', multerOptions))` 적용.
        * `multerOptions` 설정:
            * `storage`: `diskStorage` 사용.
            * `destination`: `./uploads/logos` (서버 내 저장 경로). **(주의: 이 경로는 서버 실행 위치 기준이며, 실제 서비스에서는 설정 필요)**
            * `filename`: 고유 파일명 생성 로직 (e.g., `postingId + '-' + Date.now() + extname(file.originalname)`).
            * `limits`: 파일 크기 제한 (e.g., `fileSize: 5 * 1024 * 1024` // 5MB).
            * `fileFilter`: 이미지 MIME 타입(`image/png`, `image/jpeg` 등)만 허용.
    2.  **서비스 로직 (`uploadLogo` 메소드 신규 추가):**
        * `posting.service.ts`의 `findOne`을 호출하여 소유권 확인.
        * 업로드된 파일 정보(`file`)를 받습니다 (`@UploadedFile()` 데코레이터 사용).
        * 파일 저장 성공 시, **서버 접근 URL** 생성 (e.g., `http://localhost:3056/uploads/logos/${file.filename}`). **(주의: `localhost:3056`은 환경 변수 등으로 관리 필요)**
        * `prisma.jobPosting.update`를 호출하여 `logoImageUrl` 필드에 생성된 URL 저장.
        * 업데이트된 `JobPosting` 객체 반환.
    3.  **정적 파일 서빙 설정 (`main.ts`):**
        * NestJS의 `ServeStaticModule`을 사용하여 `/uploads` 경로를 정적 파일 제공 경로로 설정해야 합니다. (e.g., `ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'uploads'), serveRoot: '/uploads' })`)

### 4\. 데이터 모델 (Data Model)

* **Model (`schema.prisma` - 관련 필드):**
  ```prisma
  // ... JobPosting 모델 ...
    companyIntro   String? @map("company_intro")    @db.Text //
    companyCulture String? @map("company_culture")  @db.Text
    benefits       String? @map("benefits")         @db.Text //
    logoImageUrl   String? @map("logo_image_url")           //
  // ...
  ```

### 5\. 예외 처리 (Exception Handling)

| HTTP Status                 | 발생 상황 (Scenario)                    | 처리 주체                           | 응답 메시지                        |
| :-------------------------- | :-------------------------------------- | :---------------------------------- | :--------------------------------- |
| **400 Bad Request** | 이미지 파일 아님 (`fileFilter`).        | `FileInterceptor` / `multerOptions` | `"Invalid file type."`           |
| **413 Payload Too Large** | 파일 크기 제한 초과 (`limits`).         | `FileInterceptor` / `multerOptions` | `"File too large."`                |
| **404 Not Found** | 존재하지 않거나 소유하지 않은 `:id` 요청. | `posting.service.ts`                | `"Project not found."`           |
| **500 Internal Server Error** | 서버 디스크 쓰기 실패 등.               | `NestJS` / `diskStorage`            | `"Failed to save file."`         |

-----

## INP-004: 이미지 생성 스타일 설정

AI 이미지 생성(`GEN-001`) 시 참조할 색상 톤과 스타일 컨셉을 저장합니다.

### 1\. 사용자 시나리오 (User Scenario)

김 대리가 `/posting/[id]` 페이지/page.tsx]의 '디자인 스타일' 섹션에서 '색상 톤'으로 '블루 계열'을, '스타일 컨셉'으로 '전문적인'을 선택하고 '저장하기' 버튼을 누릅니다.

### 2\. API 명세 (API Specification)

* **Endpoint:** `PATCH /postings/:id` (**`PRJ-001` 재사용**)
* **Description:** `INP-004` 관련 필드(`colorTone`, `styleConcept`)를 업데이트합니다.
* **Request:**
    * **Body (`UpdatePostingDto`):**
      ```json
      {
        "colorTone": "BLUE",
        "styleConcept": "PROFESSIONAL"
      }
      ```
* **Response:** `PRJ-001`과 동일.

### 3\. 핵심 비즈니스 로직 (Core Business Logic)

* **`posting.controller.ts`:**
    * `UpdatePostingDto`에 `colorTone`, `styleConcept` 필드 정의 및 `@IsOptional()`, `@IsString()` (또는 `@IsEnum()` 사용 시 Enum 정의 필요) 데코레이터 추가.
* **`posting.service.ts`:** `PRJ-001`의 `update` 로직 사용.

### 4\. 데이터 모델 (Data Model)

* **Model (`schema.prisma` - 관련 필드):**
  ```prisma
  // ... JobPosting 모델 ...
    colorTone    String? @map("color_tone")       //
    styleConcept String? @map("style_concept")    //
  // ...
  ```

### 5\. 예외 처리 (Exception Handling)

* `PRJ-001`의 `PATCH /postings/:id`와 동일. (Enum 사용 시 400 Bad Request 추가 가능)

-----

## INP-005: 중소기업 취업자 지원 혜택 안내

백엔드가 관리하는 **활성화된** 중소기업 지원 혜택 목록을 조회하고, 사용자가 선택한 혜택 ID 목록을 저장합니다.

### 1\. 사용자 시나리오 (User Scenario)

김 대리가 `/posting/[id]` 페이지의 '지원 혜택 선택' 섹션에 진입하자, "청년내일채움공제", "소득세 감면" 등 현재 **신청 가능한** 혜택 목록이 표시됩니다. (종료된 혜택은 보이지 않음). 김 대리가 이 중 원하는 혜택들을 체크하고 '저장하기' 버튼을 클릭합니다.

### 2\. API 명세 (API Specification)

#### 2.1. 활성 혜택 목록 조회

* **Endpoint:** `GET /benefits` (**신규**)
* **Description:** 사용자가 선택할 수 있는 활성화된(`isActive: true`) 중소기업 지원 혜택 목록 전체를 조회합니다.
* **Request:** (No Body, No Auth required - 공통 정보)
* **Response:**
    * **Success (200 OK):** `SmeBenefit` 객체 배열 반환.
      ```json
      [
        {
          "id": "benefit-cuid-001",
          "name": "청년내일채움공제",
          "description": "...",
          "sourceUrl": "https://...",
          "isActive": true,
          "lastChecked": "..."
        },
        // ... (isActive가 true인 혜택만)
      ]
      ```

#### 2.2. 선택한 혜택 저장

* **Endpoint:** `PATCH /postings/:id` (**`PRJ-001` 재사용**)
* **Description:** 사용자가 선택한 혜택 ID 목록을 JSON 문자열 형태로 `selectedBenefitsJson` 필드에 저장합니다.
* **Request:**
    * **Body (`UpdatePostingDto`):**
      ```json
      {
        "selectedBenefitsJson": "[\"benefit-cuid-001\", \"benefit-cuid-002\"]"
      }
      ```
* **Response:** `PRJ-001`과 동일.

### 3\. 핵심 비즈니스 로직 (Core Business Logic)

1.  **혜택 목록 조회 (`smeBenefit.controller.ts` / `smeBenefit.service.ts` - 신규):**
    * 컨트롤러: `@Get('/')` 핸들러 정의.
    * 서비스 (`getActiveBenefits`): `prisma.smeBenefit.findMany({ where: { isActive: true } })` 실행.
2.  **혜택 정보 동기화 (배경 작업 - `smeBenefit.service.ts`):**
    * `@Cron()` 데코레이터 (e.g., `@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)`)를 사용하여 스케줄링된 메소드(`syncBenefits`) 구현 (NestJS 스케줄러 모듈 필요).
    * `syncBenefits` 메소드:
        * 외부 데이터 소스(공공 API 등) 호출 로직 구현.
        * DB의 `SmeBenefit` 목록과 비교.
        * 신규 혜택은 `create`.
        * 변경된 혜택은 `update`.
        * 외부 소스에 없는 혜택은 `update({ data: { isActive: false } })`.
        * `lastChecked` 필드 업데이트.
3.  **선택 저장:**
    * `UpdatePostingDto`에 `selectedBenefitsJson` 필드 추가 및 `@IsOptional()`, `@IsString()` `@IsJSON()` 데코레이터 적용.
    * `posting.service.ts`의 `update` 로직 사용.

### 4\. 데이터 모델 (Data Model)

* **Model (`schema.prisma` - 관련 필드 및 신규 모델):**
  ```prisma
  // ... JobPosting 모델 ...
    selectedBenefitsJson String? @map("selected_benefits_json") @db.Text //
  // ...

  // [신규 모델] 중소기업 지원 혜택
  model SmeBenefit {
    id          String   @id @default(cuid())
    name        String
    description String   @db.Text
    sourceUrl   String?
    isActive    Boolean  @default(true) //
    lastChecked DateTime @updatedAt

    @@map("sme_benefits")
  }
  ```

### 5\. 예외 처리 (Exception Handling)

| HTTP Status                 | 발생 상황 (Scenario)                           | 처리 주체                | 응답 메시지                                           |
| :-------------------------- | :--------------------------------------------- | :----------------------- | :---------------------------------------------------- |
| **400 Bad Request** | `selectedBenefitsJson`이 유효 JSON 아님.       | `ValidationPipe`         | `"selectedBenefitsJson must be a valid JSON string"` |
| **500 Internal Server Error** | `GET /benefits` DB 조회 실패.                | `smeBenefit.service.ts`  | `"Failed to fetch benefits."`                       |
| **500 Internal Server Error** | `@Cron` 작업 중 외부 API 호출 또는 DB 오류.  | `smeBenefit.service.ts`  | (서버 로그 기록)                                      |

-----

## GEN-001: AI 이미지 콘텐츠 생성

입력된 프로젝트 정보와 스타일 설정을 기반으로 AI를 통해 채용 포스터(세로) 및 웹 배너(가로) 이미지를 생성합니다.

### 1\. 사용자 시나리오 (User Scenario)

김 대리가 `/posting/[id]` 페이지에서 정보 입력을 마치고 'AI 이미지 생성하기' 버튼(Accent Button)을 클릭합니다. 로딩 상태가 표시된 후, 페이지 내에 생성된 포스터와 배너 이미지가 나타납니다.

### 2\. API 명세 (API Specification)

* **Endpoint:** `POST /generate/:id/images` (**신규**)
* **Description:** `:id` 프로젝트 정보를 기반으로 포스터/배너 이미지를 생성하여 서버에 저장하고, 접근 URL을 DB에 업데이트합니다.
* **Request:**
    * **Headers:** `Authorization: Bearer <accessToken>`
    * **Body:** (Empty)
* **Response:**
    * **Success (200 OK):** 생성된 이미지 URL 포함하여 업데이트된 `JobPosting` 객체 반환.
      ```json
      {
        "id": "clx123abcde",
        // ... (모든 프로젝트 정보) ...
        "generatedPosterUrl": "http://localhost:3056/uploads/postings/clx123abcde/poster-timestamp.png", //
        "generatedBannerUrl": "http://localhost:3056/uploads/postings/clx123abcde/banner-timestamp.png",
        "updatedAt": "..."
      }
      ```
    * **Error (400 Bad Request):** 이미지 생성 필수 정보(e.g., 직무, 스타일) 누락 시.
    * **Error (401 Unauthorized):** JWT 토큰 누락 또는 유효하지 않음.
    * **Error (404 Not Found):** 프로젝트가 없거나 소유주가 아님.
    * **Error (503 Service Unavailable):** AI 이미지 생성 API 호출 실패.
    * **Error (500 Internal Server Error):** 생성된 이미지 저장 실패.

### 3\. 핵심 비즈니스 로직 (Core Business Logic)

1.  **`generation.controller.ts` (신규):** `@Post(':id/images')` 핸들러 구현, `AuthGuard` 적용.
2.  **`generation.service.ts` (신규):**
    * **의존성 주입:** `PrismaService`, `PostingService` (소유권 확인용), `AiImageService` (신규).
    * **메소드 (`generateImages`):**
        * `postingService.findOne`으로 프로젝트 조회 및 소유권 확인.
        * **필수 값 검증:** `posting.position`, `posting.companyName`, `posting.colorTone`, `posting.styleConcept` 등 프롬프트 생성에 필요한 값이 있는지 확인. 없으면 `BadRequestException` 발생.
        * `aiImageService.generatePosterAndBanner` 호출 (아래 상세).
        * 반환된 파일 경로(e.g., `/uploads/postings/...`)를 **서버 URL**로 변환 (e.g., `http://localhost:3056/...`).
        * `prisma.jobPosting.update`로 `generatedPosterUrl`, `generatedBannerUrl` 필드 업데이트.
        * 업데이트된 `JobPosting` 객체 반환.
3.  **`aiImage.service.ts` (신규):**
    * **의존성 주입:** `ConfigService` (`GEMINI_API_KEY`), Gemini API 클라이언트.
    * **메소드 (`generatePosterAndBanner`):**
        * `JobPosting` 데이터를 인자로 받음.
        * **프롬프트 엔지니어링:** `posting` 데이터를 조합하여 포스터용, 배너용 프롬프트 생성 (스타일, 색상, 회사명, 직무, 로고 URL 등 포함).
        * `project_setting.md`에 따라 Gemini API (`gemini-1.5-flash` 사용) 이미지 생성 호출 (포스터, 배너 각각 또는 병렬 처리).
        * **이미지 저장:**
            * API 응답으로 받은 이미지 데이터(e.g., base64)를 디코딩하여 Buffer로 변환.
            * `fs.promises` 또는 `fs-extra`를 사용하여 서버 파일 시스템에 저장. 저장 경로는 고유해야 함 (e.g., `./uploads/postings/[postingId]/poster-[timestamp].png`). 해당 디렉토리 없으면 생성 (`mkdir -p`).
            * 저장된 **상대 경로** (e.g., `/uploads/postings/...`)를 반환. (URL 변환은 `generation.service.ts`에서 수행).
            * 오류 발생 시 예외 처리.

### 4\. 데이터 모델 (Data Model)

* **Model (`schema.prisma` - 관련 필드):**
  ```prisma
  // ... JobPosting 모델 ...
    generatedPosterUrl String? @map("generated_poster_url") //
    generatedBannerUrl String? @map("generated_banner_url")
  // ...
  ```

### 5\. 예외 처리 (Exception Handling)

| HTTP Status                 | 발생 상황 (Scenario)                       | 처리 주체                  | 응답 메시지                                      |
| :-------------------------- | :----------------------------------------- | :------------------------- | :----------------------------------------------- |
| **400 Bad Request** | 이미지 생성 필수 정보 누락.                | `generation.service.ts`    | `"Missing required fields for generation."`    |
| **401 Unauthorized** | JWT 토큰 누락 또는 유효하지 않음.          | `AuthGuard`                | `"Unauthorized"`                                 |
| **404 Not Found** | 프로젝트가 없거나 소유주가 아님.           | `posting.service.ts`       | `"Project not found."`                         |
| **503 Service Unavailable** | Gemini 이미지 생성 API 호출 실패.          | `aiImage.service.ts`       | `"AI image generation failed."`                |
| **500 Internal Server Error** | 생성된 이미지 파일 저장 실패.              | `aiImage.service.ts`       | `"Failed to save generated image."`            |

-----

## GEN-002: HTML 채용 공고 생성

입력된 모든 텍스트/선택 정보와 선택된 중소기업 혜택 상세 정보를 조합하여 AI를 통해 반응형 HTML 코드를 생성합니다.

### 1\. 사용자 시나리오 (User Scenario)

김 대리가 `/posting/[id]` 페이지에서 정보 입력을 마치고 'HTML 공고 생성' 버튼(Accent Button)을 클릭합니다. 로딩 후, 생성된 HTML 코드 결과가 화면에 표시되거나 저장되었다는 메시지가 나타납니다.

### 2\. API 명세 (API Specification)

* **Endpoint:** `POST /generate/:id/html` (**신규**)
* **Description:** `:id` 프로젝트 정보를 기반으로 HTML 코드를 생성하고 DB에 저장합니다.
* **Request:**
    * **Headers:** `Authorization: Bearer <accessToken>`
    * **Body:** (Empty)
* **Response:**
    * **Success (200 OK):** 생성된 HTML 문자열과 함께 업데이트된 `JobPosting` 객체 반환.
      ```json
      {
        "id": "clx123abcde",
        // ... (모든 프로젝트 정보) ...
        "generatedHtml": "<!DOCTYPE html><html>...", //
        "updatedAt": "..."
      }
      ```
    * **Error (400 Bad Request):** HTML 생성 필수 정보(e.g., 직무, 회사소개) 누락 시.
    * **Error (401 Unauthorized):** JWT 토큰 누락 또는 유효하지 않음.
    * **Error (404 Not Found):** 프로젝트가 없거나 소유주가 아님.
    * **Error (503 Service Unavailable):** AI 텍스트 생성 API 호출 실패.

### 3\. 핵심 비즈니스 로직 (Core Business Logic)

1.  **`generation.controller.ts`:** `@Post(':id/html')` 핸들러 구현, `AuthGuard` 적용.
2.  **`generation.service.ts`:**
    * **의존성 주입:** `PrismaService`, `PostingService`, `SmeBenefitService` (신규), `AiTextService`.
    * **메소드 (`generateHtml`):**
        * `postingService.findOne`으로 프로젝트 조회 및 소유권 확인.
        * **필수 값 검증:** HTML 생성에 필요한 필드(e.g., `position`, `companyIntro`) 확인.
        * **혜택 정보 조합:**
            * `posting.selectedBenefitsJson` 파싱 (try-catch로 오류 처리).
            * 파싱된 ID 배열이 비어있지 않다면, `smeBenefitService.findBenefitsByIds(parsedIds)` 호출하여 `SmeBenefit` 상세 정보 목록 조회.
        * `aiTextService.generateHtml` 호출 (아래 상세).
        * 반환된 HTML 문자열을 `prisma.jobPosting.update`로 `generatedHtml` 필드에 저장.
        * 업데이트된 `JobPosting` 객체 반환.
3.  **`aiText.service.ts`:**
    * **메소드 (`generateHtml`):**
        * `JobPosting` 데이터와 조회된 `SmeBenefit` 상세 목록을 인자로 받음.
        * **프롬프트 엔지니어링:** 모든 텍스트 정보(회사소개, 직무, 복리후생 등)와 혜택 상세 정보를 구조화된 JSON 형태로 만들어 프롬프트에 포함.
        * **프롬프트 지시:** "다음 JSON 데이터를 기반으로 **Tailwind CSS 유틸리티 클래스**만을 사용한 **하나의 완성된 반응형 HTML** 코드를 생성해줘. `<head>`에 Tailwind CDN 스크립트(`https://cdn.tailwindcss.com`)를 포함하고, `design_guide.md`의 색상(Primary: `bg-blue-600`)과 타이포그래피 규칙을 준수해줘. `<style>` 태그나 인라인 `style=`은 사용하지 마. JSON 데이터: `{ \"posting\": {...}, \"benefits\": [{...}] }`"
        * `project_setting.md`에 따라 Gemini API (`gemini-1.5-pro`) 호출.
        * 응답(HTML 문자열) 반환. 오류 발생 시 예외 처리.

### 4\. 데이터 모델 (Data Model)

* **Model (`schema.prisma` - 관련 필드):**
  ```prisma
  // ... JobPosting 모델 ...
    generatedHtml      String? @map("generated_html")       @db.Text //
  // ...

  // ... SmeBenefit 모델 (INP-005에서 정의) ...
  ```

### 5\. 예외 처리 (Exception Handling)

| HTTP Status                 | 발생 상황 (Scenario)                       | 처리 주체                  | 응답 메시지                                    |
| :-------------------------- | :----------------------------------------- | :------------------------- | :--------------------------------------------- |
| **400 Bad Request** | HTML 생성 필수 정보 누락.                  | `generation.service.ts`    | `"Missing required fields for generation."`  |
| **401 Unauthorized** | JWT 토큰 누락 또는 유효하지 않음.          | `AuthGuard`                | `"Unauthorized"`                               |
| **404 Not Found** | 프로젝트가 없거나 소유주가 아님.           | `posting.service.ts`       | `"Project not found."`                       |
| **503 Service Unavailable** | Gemini 텍스트 생성 API 호출 실패.          | `aiText.service.ts`        | `"AI text generation failed."`               |
| **500 Internal Server Error** | `selectedBenefitsJson` 파싱 실패 등.       | `generation.service.ts`    | `"Failed to process data for generation."`   |

-----

## OUT-001: 결과물 개별 미리보기

생성된 포스터, 웹 배너 이미지, HTML 채용 공고를 개별적으로 확인하는 기능입니다. 백엔드 관점에서는 저장된 결과물 URL 또는 HTML 데이터를 제공하는 역할입니다.

### 1\. 사용자 시나리오 (User Scenario)

김 대리가 `/result/[id]` 페이지에 접속합니다. 페이지 내에서 이전에 `GEN-001`과 `GEN-002`를 통해 생성된 포스터 이미지, 배너 이미지, 그리고 HTML 렌더링 결과(iframe 등)를 각각 확인할 수 있습니다.

### 2\. API 명세 (API Specification)

* **Endpoint:** `GET /postings/:id` (**`PRJ-001` 재사용**)
* **Description:** 프로젝트의 모든 정보(생성된 결과물 URL 및 HTML 포함)를 조회합니다.
* **Response:**
    * **Success (200 OK):** `JobPosting` 전체 객체 반환. 프론트엔드는 이 객체에서 `generatedPosterUrl`, `generatedBannerUrl`, `generatedHtml` 필드를 사용하여 미리보기를 구성합니다.
    * **Error (401, 404):** `PRJ-001`과 동일.

### 3\. 핵심 비즈니스 로직 (Core Business Logic)

* `PRJ-001`의 `findOne` 로직과 동일합니다. 백엔드는 저장된 데이터(이미지 URL, HTML 문자열)를 제공할 뿐, 미리보기 렌더링 자체는 프론트엔드(`StaticPagePreview.tsx`)에서 처리합니다.
* **정적 파일 서빙:** `GEN-001`에서 생성된 이미지를 브라우저에서 접근 가능하도록 `/uploads` 경로에 대한 정적 파일 서빙이 설정되어 있어야 합니다 (`main.ts` 설정).

### 4\. 데이터 모델 (Data Model)

* `PRJ-001`의 `JobPosting` 모델을 사용하며, `generatedPosterUrl`, `generatedBannerUrl`, `generatedHtml` 필드를 읽습니다.

### 5\. 예외 처리 (Exception Handling)

* `PRJ-001`의 `GET /postings/:id`와 동일.

-----