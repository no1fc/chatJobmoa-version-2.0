---
적용: 항상
---

## AI 채용 콘텐츠 제작 플랫폼: UI 디자인 가이드 (v1.1)

**문서 목적:** 본 문서는 'AI 기반 채용 콘텐츠 제작 플랫폼'의 시각적 통일성과 사용자 경험(UX)의 일관성을 확보하기 위한 디자인 규칙을 정의합니다. 모든 UI 요소는 아래 가이드를 준수하여 개발합니다.

### 1\. 글로벌 스타일 (Global Styles)

프로젝트 전반에 걸쳐 일관되게 사용되는 기본 스타일입니다. 안정적인 파란색과 역동적인 녹색의 조화를 통해 기술적 신뢰감과 창의적인 AI 기능을 동시에 표현합니다.

#### 1.1. 색상 팔레트 (Color Palette)

플랫폼의 신뢰성을 나타내는 파란색을 주 색상으로, AI 기능 호출과 같은 긍정적이고 핵심적인 상호작용에는 생동감 있는 녹색을 포인트(Accent) 색상으로 사용합니다.

| 역할 (Role) | 설명 | ClassName (Tailwind CSS) | Hex Code |
| :--- | :--- | :--- | :--- |
| **Primary** | 핵심 버튼, 중요 링크, 활성화된 요소 | `bg-blue-600`, `text-blue-600` | `#2563EB` |
| **Secondary** | 보조 버튼, 비활성화된 요소 배경 | `bg-gray-200`, `text-gray-800` | `#E5E7EB` |
| **Accent & Success**| **AI 기능 호출, 생성 완료, 긍정적 알림** | `bg-green-500`, `text-green-500` | **`#03A63C`** |
| **Surface** | 컴포넌트, 모달 등의 표면 색상 | `bg-white` | `#FFFFFF` |
| **Background**| 페이지 전체 배경색 | `bg-gray-100` | **`#F2F2F2`** |
| **Text** | 본문, 제목 등 기본 텍스트 | `text-slate-900` | `#0F172A` |
| **Text (Sub)**| 부가 설명, 플레이스홀더 | `text-slate-500` | `#64748B`|
| **Border** | 컴포넌트 기본 테두리 | `border-slate-300` | `#CBD5E1` |
| **Error** | 오류, 실패 상태 알림 | `bg-red-500`, `text-red-500` | `#EF4444` |

#### 1.2. 타이포그래피 (Typography)

가독성과 정보의 위계를 명확히 하기 위해 글꼴 크기와 굵기를 체계적으로 정의합니다. 모든 텍스트는 아래 정의된 스타일 클래스 조합을 사용해야 합니다.

| 스타일명 (Style Name) | 사용 예시 | ClassName (Tailwind CSS) |
| :--- | :--- | :--- |
| **Heading 1** | 페이지 최상단 제목 | `text-3xl font-bold text-slate-900` |
| **Heading 2** | 섹션 제목 | `text-2xl font-bold text-slate-900` |
| **Heading 3** | 하위 섹션 제목, 카드 제목 | `text-xl font-semibold text-slate-900` |
| **Body 1 (Default)**| 기본 본문 텍스트 | `text-base font-normal text-slate-900` |
| **Body 2** | 강조 본문 텍스트 | `text-base font-medium text-slate-900` |
| **Caption** | 폼 헬퍼 텍스트, 저작권 표시 | `text-sm font-normal text-slate-500` |
| **Label** | 폼 입력 필드 라벨 | `text-sm font-medium text-slate-700` |


### 2\. UI 컴포넌트 (UI Components)

글로벌 스타일을 기반으로 재사용 가능한 UI 컴포넌트를 설계합니다. 각 컴포넌트는 단일 책임을 가지며, 프로젝트의 핵심 원칙인 **모듈화**와 **재사용성**을 따릅니다.

#### 2.1. 버튼 (Button)

사용자의 행동을 유도하는 가장 기본적인 요소입니다. 용도에 따라 `Primary`, `Secondary`, `Accent` 유형으로 구분하며, `hover`, `focus`, `disabled` 상태를 명확히 정의합니다.

* **설명:**

    * **Primary Button:** '저장하기', '로그인' 등 일반적인 핵심 행동에 사용됩니다.
    * **Accent Button:** 'AI로 생성하기'와 같이 플랫폼의 핵심 기능을 강조하고 사용자의 행동을 강력하게 유도할 때 사용합니다.
    * **Secondary Button:** '취소', '목록으로' 등 보조적인 행동에 사용됩니다.
    * **Disabled State:** 모든 버튼은 비활성화 시 `disabled:opacity-50 disabled:cursor-not-allowed` 클래스를 공통으로 적용합니다.

* **ClassName 정의 (TypeScript/React):**

  ```typescript
  // 기본 버튼 스타일 (padding, font, border-radius 등)
  const baseButtonClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';

  // 크기별 스타일
  const sizeClasses = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
  };

  // 유형별 스타일
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
    accent: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500', // Accent 버튼 추가
    text: 'text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline',
  };
  ```

#### 2.2. 폼 입력 필드 (Form Inputs)

채용 공고 내용 작성 등 사용자의 데이터 입력을 위해 사용됩니다. 라벨, 입력 필드, 도움말 텍스트가 하나의 세트로 구성됩니다.

* **설명:**

    * 사용자가 입력 필드에 집중할 때(`focus` 상태) Primary 색상의 테두리로 시각적 피드백을 제공합니다.
    * 오류 발생 시, 테두리와 도움말 텍스트를 Error 색상으로 변경하여 명확하게 인지시킵니다.

* **ClassName 정의 (TypeScript/React):**

  ```typescript
  // 입력 필드 (Input, Textarea)
  const inputBaseClasses = 'flex h-10 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50';

  // 오류 상태 입력 필드
  const inputErrorClasses = 'border-red-500 focus:ring-red-500';

  // 라벨 (Label)
  const labelClasses = 'text-sm font-medium text-slate-700 mb-2 block';

  // 도움말/오류 메시지 (Caption)
  const helperTextClasses = 'text-sm font-normal text-slate-500 mt-2';
  const errorTextClasses = 'text-sm font-normal text-red-500 mt-2';
  ```

#### 2.3. 모달 (Modal / Popup)

AI 이미지 생성 결과 확인, 중요 정보 재확인 등 현재의 흐름을 방해하지 않으면서 추가적인 정보를 제공하거나 과업을 수행할 때 사용합니다.

* **설명:**

    * 모달 뒷배경은 어둡게 처리하여 사용자가 모달 콘텐츠에 집중하도록 유도합니다.
    * 모달 내부는 `Header`, `Body`, `Footer` 영역으로 구조화하며, Footer에는 주로 버튼 컴포넌트가 위치합니다.

* **ClassName 정의 (TypeScript/React):**

  ```typescript
  // 모달 오버레이 (배경)
  const modalOverlayClasses = 'fixed inset-0 z-50 bg-black/60';

  // 모달 컨테이너 (위치 및 기본 디자인)
  const modalContainerClasses = 'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-white p-6 shadow-lg rounded-lg';

  // 모달 헤더
  const modalHeaderClasses = 'flex flex-col space-y-1.5 text-center sm:text-left';
  const modalTitleClasses = 'text-lg font-semibold text-slate-900'; // Heading 3 스타일 변형
  const modalDescriptionClasses = 'text-sm text-slate-500'; // Caption 스타일

  // 모달 푸터
  const modalFooterClasses = 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4';
  ```