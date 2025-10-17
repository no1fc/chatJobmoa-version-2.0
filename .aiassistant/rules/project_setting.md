---
적용: 항상
---

***
## AI 기반 채용 콘텐츠 제작 플랫폼: 프로젝트 기술 설정 가이드

**문서 버전:** 1.1 (AI 스펙 및 개발 환경 업데이트)
**작성일:** 2025년 10월 16일
**작성자:** 프로젝트 테크 리드 (Tech Lead)

### 1. 프로젝트 개요

본 문서는 'AI 기반 채용 콘텐츠 제작 플랫폼' 프로젝트의 기술 스택, 개발 환경, 코딩 규칙 및 아키텍처 원칙을 정의합니다. 프로젝트에 참여하는 모든 개발자와 AI 코딩 어시스턴트는 본 문서의 내용을 **절대적인 규칙**으로 삼아, 통일된 표준에 따라 코드를 작성해야 합니다.

### 2. 핵심 기술 스택 (Core Technology Stack)

PRD의 요구사항을 고려하여, 프로젝트의 안정성, 확장성, 개발 생산성을 극대화할 수 있는 최신 기술 스택을 선정했습니다. 아래 명시된 기술 및 버전 외의 사용은 원칙적으로 금지합니다.

| 카테고리 (Category) | 기술명 (Technology) | 버전/사양 (Version/Specification)        | 주요 역할 및 선정 사유                                                                                |
| :--- | :--- |:-------------------------------------|:---------------------------------------------------------------------------------------------|
| **공통 언어** | **TypeScript** | `~5.x`                               | 모든 코드(프론트엔드, 백엔드)에 적용하여 타입 안정성을 확보하고, AI의 코드 생성 오류를 최소화합니다.                                  |
| **프론트엔드** | **Next.js** | `~14.x`                              | App Router 기반의 SPA로 구성하여 강력한 라우팅과 렌더링 최적화를 지원합니다.                                            |
| | **React** | `~18.x`                              | 컴포넌트 기반 아키텍처를 통해 UI의 재사용성과 유지보수성을 극대화합니다.                                                    |
| | **Zustand** | `~4.x`                               | 가볍고 직관적인 API를 제공하는 상태 관리 라이브러리. 사용자 정보, 공고 입력 데이터 등 전역 상태를 관리합니다.                            |
| | **Tailwind CSS** | `~3.x`                               | Utility-First 접근 방식으로 빠르고 일관된 UI 개발을 지원합니다. 별도의 CSS 파일 작성을 금지합니다.                            |
| | **Axios** | `~1.x`                               | 모든 클라이언트-서버 HTTP 통신에 사용되는 표준 라이브러리입니다.                                                       |
| **백엔드** | **NestJS** | `~10.x`                              | 모듈, 컨트롤러, 서비스 기반의 구조를 강제하여 코드의 예측 가능성과 확장성을 보장하는 Node.js 프레임워크입니다.                           |
| | **Node.js** | `LTS (v20.x 이상)`                     | 백엔드 런타임 환경.                                                                                  |
| **데이터베이스** | **PostgreSQL** | `~16.x`                              | 안정적이고 강력한 기능을 제공하는 오픈소스 관계형 데이터베이스입니다.                                                       |
| | **Prisma** | `~5.x`                               | Type-Safe ORM. 모든 데이터베이스 접근은 Prisma Client를 통해서만 수행되어야 합니다.                                  |
| **외부 AI 연동**| **Google Gemini API** | `gemini-2.5-pro`, `gemini-2.5-flash` | `aiText.service.ts`: 키워드 추천 등 고품질 텍스트 생성에는 `pro`, 단순 생성에는 `flash`를 사용합니다.                    |
| | **Google Gemini API** | `gemini-2.5-flash-image`                  | `aiImage.service.ts`: 이미지 생성 기능이 포함된 `gemini-2.5-flash-image` 모델을 사용하여 채용 포스터 및 웹 배너를 생성합니다. |

### 3. 개발 환경 (Development Environment)

모든 팀원은 아래의 통일된 개발 환경을 구성하여 비효율적인 설정 문제를 방지하고 개발에만 집중할 수 있도록 합니다.

| 카테고리 (Category) | 도구 (Tool) | 필수 사양 / 규칙 (Specification / Rule) |
| :--- | :--- | :--- |
| **IDE** | **IntelliJ IDEA Ultimate** | 최신 버전 사용을 권장합니다. (Community Edition 불가) |
| **필수 IntelliJ 플러그인**| Prettier, ESLint, Prisma | 코드 저장 시 자동으로 포맷팅 및 린팅이 적용되도록 설정해야 합니다. (`JavaScript and TypeScript` 플러그인 활성화 필수) |
| **버전 관리** | **Git & GitHub** | `Git Flow` 브랜칭 전략을 사용하며, 모든 코드는 GitHub Private Repository에서 관리합니다. |
| **패키지 매니저**| **npm** | `pnpm` 이나 `yarn` 대신 `npm`을 사용하여 패키지를 관리합니다. `package-lock.json`을 반드시 커밋에 포함해야 합니다. |
| **코드 품질 관리**| **ESLint & Prettier** | `airbnb-typescript` 규칙셋을 기반으로 프로젝트 규칙을 추가합니다. |
| | **Husky** | `pre-commit` 훅을 사용하여 커밋 이전에 모든 코드가 린트 및 포매팅 규칙을 통과하도록 강제합니다. |

### 4. 코딩 규칙 및 아키텍처 원칙 (Coding Rules & Architectural Principles)

**AI 코딩 어시스턴트는 아래의 원칙과 규칙을 코드 생성 시 반드시 준수해야 합니다.** 이 섹션의 내용은 프로젝트의 코드 품질을 결정하는 가장 중요한 부분입니다.

#### 핵심 아키텍처 원칙

AI 어시스턴트는 모든 코드를 생성할 때 아래 3가지 원칙을 최우선으로 고려해야 합니다.

1.  **모듈화 (Modularity)**
    * **설명:** 관련된 기능은 응집도 높게, 독립적인 단위(파일, 컴포넌트, 모듈)로 묶어야 합니다.
    * **지시:**
        * React 컴포넌트는 단일 책임을 가져야 하며, 자체 폴더 내에 `index.tsx` 와 스타일 파일을 구성하는 것을 원칙으로 합니다.
        * NestJS에서는 기능 단위로 모듈(`*.module.ts`)을 명확히 분리하고, 각 모듈은 독립적으로 작동할 수 있어야 합니다.

2.  **재사용성 (Reusability)**
    * **설명:** 반복되는 로직이나 UI는 언제든 다른 곳에서 가져다 쓸 수 있도록 범용적인 형태로 만들어야 합니다.
    * **지시:**
        * 버튼, 입력 필드, 모달 등 공통 UI 요소는 `/src/components/common` 디렉토리 내에 독립적인 컴포넌트로 만드십시오.
        * 여러 서비스에서 공통으로 사용되는 함수(예: 날짜 포맷팅, 데이터 검증)는 `/src/utils` 디렉토리에 분리하여 관리합니다.

3.  **낮은 결합도 (Loose Coupling)**
    * **설명:** 한 모듈의 변경이 다른 모듈에 미치는 영향을 최소화해야 합니다.
    * **지시:**
        * 컴포넌트 간 데이터 전달은 `props`를 원칙으로 하되, 복잡한 의존성은 Zustand 스토어를 통해 상태를 분리하여 관리합니다.
        * NestJS 서비스 간의 의존성은 반드시 의존성 주입(Dependency Injection)을 통해 해결하며, 서비스는 구체적인 구현이 아닌 인터페이스(Interface/Type)에 의존해야 합니다.

---

#### ✅ 반드시 사용할 것 (MUST USE)

* **TypeScript Strict Mode**: `tsconfig.json`의 `compilerOptions`에서 `"strict": true` 설정을 반드시 유지해야 합니다.
* **Next.js App Router**: 모든 프론트엔드 라우팅은 `/src/app` 디렉토리 기반의 App Router를 사용합니다.
* **Functional Components & Hooks**: 모든 React 컴포넌트는 함수형 컴포넌트와 Hooks (`useState`, `useEffect` 등)로 작성해야 합니다.
* **Async/Await**: 모든 비동기 로직은 `Promise.then().catch()` 대신 `async/await` 와 `try/catch` 구문을 사용해야 합니다.
* **Named Exports**: `export default` 대신 `export const ComponentName = ...` 과 같이 명명된 내보내기를 사용해 이름의 일관성을 유지합니다.
* **절대 경로 임포트 (Absolute Imports)**: `../../components` 와 같은 상대 경로 대신 `tsconfig.json`에 설정된 `@/components` 와 같은 절대 경로를 사용해야 합니다.
* **환경 변수**: 모든 API 키, DB 접속 정보 등 민감한 정보는 반드시 `.env` 파일에 정의하고 `process.env`를 통해 접근해야 합니다. 코드에 직접 하드코딩하는 것을 엄격히 금지합니다.
* **API 요청/응답 타입 정의**: 모든 API 통신에 사용되는 데이터의 `Request`, `Response` 타입을 명확히 `interface` 또는 `type`으로 정의하고 사용해야 합니다.

---

#### ❌ 절대 사용하지 말 것 (MUST NOT USE)

* **`any` 타입**: **어떠한 경우에도 `any` 타입을 사용해서는 안 됩니다.** 타입 추론이 불가능한 경우, `unknown`을 사용한 후 타입 가드(Type Guard)를 통해 타입을 좁혀서 사용해야 합니다.
* **`export default`**: 명명된 내보내기(Named Export)만 허용합니다.
* **Class Components**: React의 클래스형 컴포넌트(`class App extends React.Component`)는 절대 사용하지 않습니다.
* **CSS / Sass / Styled-Components**: **모든 스타일링은 Tailwind CSS 유틸리티 클래스만을 사용해야 합니다.** 별도의 `.css`, `.scss` 파일 작성이나 `styled-components`와 같은 CSS-in-JS 라이브러리 사용을 금지합니다.
* **하나의 파일에 모든 코드 작성**: 컴포넌트, 서비스, 로직, 상태 등 모든 것을 하나의 거대한 파일에 작성하는 행위를 엄격히 금지합니다. 기능 단위로 파일을 분리하는 **모듈화 원칙**을 반드시 지켜야 합니다.
* **Prisma 외의 DB 직접 접근**: 모든 데이터베이스 관련 로직은 반드시 Prisma Client를 통해서만 수행되어야 합니다. Raw SQL 쿼리 문자열을 코드에 직접 작성하는 것을 금지합니다.
* **`var` 키워드**: 변수 선언 시 `var`를 사용하지 않고, `const` 사용을 기본으로 하되 재할당이 필요한 경우에만 `let`을 사용합니다.
* **전역 상태의 남용**: 서버에서 한 번 받아오거나 특정 페이지에서만 사용되는 상태는 `useState` 또는 `useQuery` 같은 지역적 상태 관리 방식을 사용해야 합니다. 모든 데이터를 무분별하게 Zustand 스토어에 넣는 것을 금지합니다.