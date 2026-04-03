import { ResumeItemProps } from '@/components/resume/ResumeItem';
import { ResumeLinkProps } from '@/components/resume/ResumeLink';

export type Project = {
	title: string;
	description: string;
	date?: string;
	skills?: string[];
	achievements: ResumeItemProps[];
	links?: ResumeLinkProps[];
};

export type ServiceGroup = {
	service: string;
	serviceDescription?: string;
	projects: Project[];
	printBreakBefore?: boolean;
};

export type CareerHighlight = {
	text: string;
	subItems?: string[];
};

export type Careers = {
	organization: string;
	position: string;
	startDate?: string;
	endDate?: string;
	period?: string;
	description: string;
	highlights: CareerHighlight[];
	techStack: string[];
	serviceGroups: ServiceGroup[];
};

export function getCareerPeriod(career: Careers) {
	if (career.period) return { text: career.period, duration: '', isOngoing: false };
	if (!career.startDate) return { text: '', duration: '', isOngoing: false };

	const start = new Date(career.startDate.replace('.', '-') + '-01');
	const end = career.endDate ? new Date(career.endDate.replace('.', '-') + '-01') : new Date();
	const isOngoing = !career.endDate;

	const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
	const years = Math.floor(months / 12);
	const remainingMonths = months % 12;

	let duration = '';
	if (years > 0 && remainingMonths > 0) duration = `${years}년 ${remainingMonths}개월`;
	else if (years > 0) duration = `${years}년`;
	else duration = `${months}개월`;

	const startStr = career.startDate;
	const endStr = isOngoing ? '재직 중' : career.endDate!;

	return { text: `${startStr} ~ ${endStr}`, duration, isOngoing };
}

export function getCareerPeriodText(career: Careers): string {
	const { text, duration } = getCareerPeriod(career);
	return duration ? `${text} (${duration})` : text;
}

export type Education = {
	title: string;
	period: string;
};

export type Activity = {
	title: string;
	organization: string;
	period: string;
	items: string[];
};

export type Resume = {
	careers: Careers[];
	education: Education[];
	activities: Activity[];
};

const CAREERS: Careers[] = [
	{
		organization: '주식회사 웰로',
		position: '매니저 | 제품실 개발팀',
		startDate: '2025.11',
		description:
			'누적 이용자 500만의 AI 기반 정책 추천 플랫폼 Wello와 B2B SaaS Wello-biz의 프론트엔드를 담당하며, 마이데이터 3개 기관 연동·커머스 결제 플로우 구축·React 19 마이그레이션 등 기능 개발과 기술 부채 해소를 병행하고 있습니다.',
		highlights: [
			{ text: '마이데이터 연동 서비스(의료·통신·신용) 3개 기관 공통 구조 설계·구현' },
			{ text: '커머스 결제·주문 플로우 + 관리자 백오피스 구축 (나이스페이 PG 연동)' },
			{ text: '고향사랑기부 플랫폼 인증·내비게이션 개선 등 기능 개선' },
			{
				text: 'React 19 + Next.js 16 업그레이드, UI 라이브러리 전환, 번들 최적화 등 DX 대규모 개선',
			},
		],
		techStack: [
			'React 19',
			'Next.js 16',
			'TypeScript',
			'Zustand',
			'TanStack Query v5',
			'Tailwind CSS',
			'Zod',
			'Storybook',
		],
		serviceGroups: [
			{
				service: 'Wello',
				serviceDescription: 'AI 기반 개인 맞춤형 정책 추천 플랫폼',
				projects: [
					{
						title: '마이데이터 연동',
						date: '2026.02 ~ 03',
						description:
							'의료(KHIS)·통신(KOSCOM)·신용(NICE) 3개 기관의 인증·동의·전자서명 플로우가 모두 다른 상황에서, 기관마다 별도 구현하면 코드가 3배로 불어나고 신규 기관 추가가 거의 불가능한 구조였습니다. 3개 기관의 연결·관리 전 구간을 공통 구조 하나로 커버하도록 설계했습니다.',
						achievements: [
							{
								title:
									'멀티스텝 흐름을 커스텀 훅으로 추상화하고 URL params + sessionStorage로 상태를 관리하여, 신규 기관 추가 시 스텝 정의만 추가하면 되는 구조로 설계했습니다. 브라우저 뒤로가기·새로고침에도 진행 상태가 유지됩니다.',
							},
							{
								title:
									'20개 이상 약관을 한 화면에 나열하면 사용자가 끝까지 확인하지 않는 문제 → 가시 영역 추적 커스텀 훅을 설계하여 스크롤에 따라 자동 체크, 미확인 약관으로 자동 스크롤을 유도하는 UX를 구현했습니다.',
							},
						],
					},
					{
						title: '커머스 서비스 결제 및 주문 시스템 구축',
						date: '2026.01 ~ 03',
						description:
							'고향사랑기부 답례품의 높은 사용자 반응을 바탕으로 커머스 사업 확장이 결정되었습니다. 기존 기부 플랫폼은 기부금 납부만 처리하는 단순한 구조여서 상품 주문·배송·환불 등 커머스 전 플로우를 나이스페이 PG 연동 기반으로 처음부터 설계해야 했고, 향후 입점업체 확대에 대응할 수 있는 확장 가능한 관리자 백오피스가 필요했습니다.',
						achievements: [
							{
								title:
									'나이스페이 PG 연동 기반으로 장바구니 → 쿠폰/포인트 적용 → 결제 → 주문 완료 → 주문 내역(상태별 UI 분기 · 배송 추적) → 후기 작성까지 사용자 구매 플로우 전 구간을 구현했습니다.',
							},
							{
								title:
									'웰포인트, 프로모션, 입점업체, 타임세일, 고객센터 등 5개 영역의 관리자 백오피스를 구축하고, 각 영역을 목록 조회 → 검색 필터 → 상세 → 등록/수정의 일관된 구조로 설계하여 신규 영역 추가 시 빠르게 확장할 수 있도록 했습니다.',
							},
						],
					},
					{
						title: '고향사랑기부 기능 개선',
						date: '2025.11 ~ 2026.03',
						description:
							'입사 후 행정안전부 선정 고향사랑기부 플랫폼을 파악하는 과정에서, 인증 세션 불안정과 페이지 전환 시 깜빡임 문제를 발견하여 우선적으로 해결했습니다.',
						achievements: [
							{
								title:
									'인증 상태 변경(로그인/로그아웃) 후 클라이언트 내비게이션으로 이동하면, Router Cache가 이전 상태의 RSC payload를 반환하고 partial rendering으로 layout이 재실행되지 않아 쿠키 변경이 반영되지 않는 문제 → 하드 내비게이션으로 전환하여 캐시를 우회하고, 서버가 변경된 쿠키를 읽어 인증 상태를 정상 반영했습니다.',
							},
							{
								title:
									'루트 loading.tsx의 instant loading state가 페이지 전환 시 깜빡임을 유발하는 문제 → App Router의 내비게이션이 React transition 기반으로 동작하여 이미 표시된 Suspense fallback을 다시 트리거하지 않는 점을 활용, loading.tsx를 제거하고 Suspense boundary로 전환하여 이전 페이지를 유지한 채 새 페이지가 준비되면 전환되도록 개선했습니다.',
							},
						],
					},
				],
			},
			{
				service: 'Wello-biz',
				serviceDescription: 'B2B SaaS 비즈니스 플랫폼',
				projects: [
					{
						title: '레거시 정리 및 기능 개선',
						date: '2025.11 ~ 2026.01',
						description:
							'Chakra UI의 전역 스타일이 신규 컴포넌트 개발 시마다 예측할 수 없는 스타일 충돌을 일으켜, 기능 개발보다 사이드이펙트 디버깅에 더 많은 시간이 소요되고 있었습니다. UI 라이브러리와 라우터 등 레거시 구조를 먼저 정리한 뒤, 비즈니스 기능 개선을 진행했습니다.',
						achievements: [
							{
								title:
									'11개 전역 컴포넌트를 Tailwind CSS 기반으로 교체하여 스타일 영향 범위를 격리하고, Pages Router → App Router 전환으로 Next.js 컨벤션에 맞는 구조로 정리했습니다.',
							},
							{
								title:
									'한글 입력 시 자음/모음이 분리되는 버그 → textarea의 value를 직접 초기화하는 코드가 IME composition을 중단시키는 것이 원인으로, DOM 조작을 제거하고 React 상태 업데이트로 전환하여 해결했습니다.',
							},
						],
					},
				],
			},
			{
				service: '공통',
				serviceDescription: 'Wello · Wello-biz · Admin 전반',
				projects: [
					{
						title: 'DX 대규모 개선',
						date: '2025.11 ~ 2026.03',
						description:
							'기능 개발을 하면서 프레임워크 버전 차이로 인한 빌드 이슈, API 변경 시 런타임에서야 발견되는 타입 에러, 불필요한 코드가 포함된 번들 등 팀 전체의 개발 속도를 저하시키는 기술 부채가 쌓여 있었습니다. 기능 개발과 병행하여 이를 체계적으로 해소했습니다.',
						achievements: [
							{
								title:
									'React 18→19, Next.js 15→16 + Turbopack 전환으로 로컬 개발 환경의 서버 시작 및 HMR 속도를 개선하고, 서버 컴포넌트 params 비동기 Breaking Change 전체 마이그레이션을 진행했습니다.',
							},
							{
								title:
									'API 변경 시 타입 불일치를 런타임까지 잡지 못하는 수동 래핑 방식의 쿼리 클라이언트 → OpenAPI 스펙 기반 자동 생성으로 전환하여 컴파일 타임에 타입 에러를 감지하고, API 연동 시 휴먼 에러를 방지했습니다.',
							},
							{
								title:
									'Vue 레거시와 Next.js admin이 공존하는 환경에서 토큰 만료 시 수동 재로그인이 필요한 문제 → 401 인터셉터와 토큰 갱신 파이프라인을 도입하고, 동적 cookie domain 처리로 iframe 간 세션을 공유하여 수동 재로그인을 제거했습니다.',
							},
							{
								title:
									'번들 최적화: lottie-web SVG-only 빌드(약 100KB 절감), html2canvas-pro(200KB+) → modern-screenshot, date-fns(18KB gzip) → dayjs(6KB gzip) 등 경량 대안으로 교체하여 번들 사이즈를 절감했습니다.',
							},
						],
					},
				],
			},
		],
	},
	{
		organization: '(주)살린',
		position: '팀원 | ILab',
		startDate: '2023.08',
		endDate: '2025.08',
		description:
			'OpenAI Assistant API 기반 AI 챗봇 서비스와 관리자 CMS를 개발하며, 신규 서비스 설계부터 CSR→SSR 전환, 성능 최적화, 팀 개발 환경 표준화까지 담당했습니다.',
		highlights: [
			{ text: 'AI 챗봇 플랫폼 + 24페이지 관리자 CMS 설계·개발 (SSE 스트리밍, 역방향 무한 스크롤)' },
			{
				text: '외주 인수받은 WebGL 아바타 서비스의 3초 빈 화면을 Suspense + lazy로 즉시 렌더링 전환, CDN 이전으로 초기 로딩 400~600ms 단축',
			},
			{ text: 'CSR → Next.js 15 SSR 전환, 고객사별 SEO 수작업 완전 자동화 및 UX 리뉴얼' },
			{ text: 'CMS 전용 UI Kit(CJS/ESM) + SSR/SPA 각각의 보일러플레이트 구축' },
			{ text: '대화형 설문 MVP 풀스택 개발·배포 (Nest.js + SSE 스트리밍)' },
		],
		techStack: [
			'React',
			'TypeScript',
			'Next.js 15',
			'Nest.js',
			'TanStack Query',
			'Emotion',
			'Zustand',
			'Webpack',
			'Vite',
		],
		serviceGroups: [
			{
				service: 'AI Talker',
				serviceDescription: 'AI 챗봇 플랫폼',
				projects: [
					{
						title: 'AI 챗봇 플랫폼 & CMS',
						date: '2024.08 ~ 2025.08',
						description:
							'고객사가 자사 콘텐츠를 등록하면 사용자가 콘텐츠를 탐색하면서 AI 챗봇과 실시간 상담까지 할 수 있는 통합 플랫폼이 필요했습니다. 챗봇 서비스와 고객사가 직접 AI를 커스터마이즈할 수 있는 24페이지 규모의 관리자 CMS를 설계·구현했습니다.',
						achievements: [
							{
								title:
									'OpenAI Assistant API의 SSE 응답을 활용한 토큰 단위 스트리밍 + 타이핑 효과로 자연스러운 대화 경험을 구현하고, 역방향 무한 스크롤로 최신 메시지부터 점진적 로딩하여 채팅 히스토리 조회 성능 및 UX를 개선했습니다.',
								links: [
									{
										title: '관련글',
										url: 'https://www.ycow-dev.com/blog/posts/next/reverse_infinite_scroll',
									},
								],
							},
							{
								title:
									'통계 대시보드, AI 콘텐츠 자동 생성, 벡터 스토어 관리, 고객사별 프롬프트·모델·응답 스타일 커스터마이즈 기능을 포함한 24페이지 관리자 CMS를 개발했습니다.',
							},
							{
								title:
									'무료 고객사의 수익화 방안이 필요한 상황에서, 챗봇 응답 횟수를 카운팅하여 일정 주기마다 광고가 채팅에 자동 삽입되는 수익화 기능을 구현했습니다.',
							},
							{
								title:
									'iOS Safari에서 가상 키보드가 올라오면 viewport가 줄어들며 채팅 레이아웃이 깨지는 문제 → visualViewport API 기반으로 CSS 변수를 동적 계산하여 키보드 높이에 맞게 레이아웃을 보정했습니다.',
								links: [
									{
										title: '관련글',
										url: 'https://www.ycow-dev.com/blog/posts/issues/ios_virtual_keyboards',
									},
								],
							},
						],
					},
					{
						title: 'SSR 전환 및 UI 리뉴얼',
						date: '2025.01 ~ 2025.08',
						description:
							'기존 CSR 방식의 메타데이터 수동 관리와 검색 엔진 크롤링 문제를 해결하기 위해 Next.js 15 App Router 기반 SSR로 전환하고, 고객사별 SEO 워크플로우를 자동화했습니다.',
						achievements: [
							{
								title:
									'기존에는 고객사 추가 시마다 메타데이터와 사이트맵을 수동 작성 → 동적 메타데이터 생성과 다국어 SEO를 고객사별로 자동 적용하고, API 기반 동적 사이트맵으로 신규 고객사 검색 색인·노출까지 자동화했습니다.',
							},
							{
								title:
									'shadcn/ui 기반 공통 컴포넌트를 구축하여 UI 일관성을 높이고 신규 화면 개발·변경 시간을 단축했습니다.',
							},
						],
					},
				],
			},
			{
				service: 'Swing',
				serviceDescription: '스타트업 업무 지원 플랫폼',
				projects: [
					{
						title: '서비스 웹 + 관리자 CMS 프론트엔드 단독 개발',
						date: '2024.01 ~ 07',
						description:
							'백엔드 개발자 1명과 2인 팀으로 운영되어, WebGL 기반 3D 가상 오피스와 정부 지원 과제 관리 등 업무 지원 서비스의 프론트엔드 전 영역을 단독으로 담당했습니다.',
						achievements: [
							{
								title:
									'서비스 특성에 맞춰 서비스 웹(Webpack v5)과 관리자 CMS(Vite)의 빌드 환경을 분리하고, 인증/대시보드/사업지원/가상오피스 등 전체 기능을 개발했습니다.',
							},
							{
								title:
									'WebGL 자산으로 초기 번들이 비대해지는 문제 → Lazy Loading + 코드 스플리팅과 bundle-analyzer를 활용하여 번들 사이즈를 지속적으로 최적화했습니다.',
							},
						],
					},
				],
			},
			{
				service: 'Localo',
				serviceDescription: 'WebGL 아바타 서비스',
				projects: [
					{
						title: '아바타 스튜디오 성능 개선 및 CMS 개발',
						date: '2023.08 ~ 12',
						description:
							'외주 업체에서 인수받은 WebGL 아바타 서비스가 3D 렌더링 로딩으로 3초 이상 빈 화면이 노출되고, 대용량 정적 자산으로 초기 로딩이 느린 상황이었습니다. 종료 예정인 CRA 기반 레거시 환경이라 전면 리팩토링 대신 기존 시스템과 분리된 모듈화 구조를 설계했습니다.',
						achievements: [
							{
								title:
									'3D 렌더링 컴포넌트(@react-three/fiber)의 동기 로딩이 전체 UI를 블로킹하여 3초 이상 빈 화면 노출 → Suspense + lazy()로 분리하여 즉시 렌더링으로 전환하고, 정적 자산 CDN 이전으로 초기 로딩을 400~600ms 단축했습니다.',
							},
							{
								title:
									'레거시에 영향 없는 모듈화 구조 + TanStack Query 기반 상태 관리로 300명 규모 대학 OT 및 오디션 시스템을 성공적으로 런칭했습니다.',
							},
						],
					},
				],
			},
			{
				service: '공통',
				projects: [
					{
						title: 'CMS 전용 UI Kit & 보일러플레이트 / 대화형 설문 MVP',
						date: '2023.12 ~ 2024.12',
						description:
							'새 프로젝트를 시작할 때마다 Webpack 설정부터 반복해야 했고, CMS 개발 시에는 MUI/Antd의 과도한 커스터마이징으로 개발 속도가 떨어지고 있었습니다. 이를 해결하기 위해 프로젝트 성격별 보일러플레이트와 CMS 전용 UI 라이브러리를 구축했습니다. 이후 OpenAI API 기반 대화형 설문 생성 MVP를 백엔드부터 배포까지 풀스택으로 주도 개발했습니다.',
						achievements: [
							{
								title:
									'SSR용(Webpack v5)과 SPA CMS용(Vite) 보일러플레이트를 각각 제작하고, CMS 전용 UI 라이브러리를 Rollup.js 기반 CJS/ESM 양방향 빌드로 구축했습니다. Storybook + Chromatic으로 시각적 회귀 테스트 환경까지 갖췄습니다.',
							},
							{
								title:
									'Yarn Berry 모노레포 + Lerna 버전 관리로 의존성을 통합하고, 신규 프로젝트 시작 시 환경 구축 대신 비즈니스 로직에 바로 집중할 수 있는 구조를 확보했습니다.',
							},
							{
								title:
									'설문 MVP: Nest.js 백엔드에서 SSE 스트리밍을 구현하고, 프론트엔드에서 AI 응답을 실시간 출력하여 설문 항목이 순차적으로 완성되는 UX를 구현했습니다. Jenkins → AWS S3 자동 배포까지 구축했습니다.',
							},
						],
					},
				],
			},
		],
	},
];

const EDUCATION: Education[] = [
	{ title: '한국방송통신대학교 — 컴퓨터과학과', period: '2026.03 ~ 재학 중' },
	{ title: '멋쟁이사자처럼 — 프론트엔드 스쿨 3기', period: '2022.08 ~ 2023.01 수료' },
	{
		title: '방송정보국제교육원 — UI/UX 기반 웹퍼블리싱&프론트엔드 양성과정',
		period: '2021.10 ~ 2022.03 수료',
	},
];

const ACTIVITIES: Activity[] = [
	{
		title: '항해플러스 프론트엔드 6기',
		organization: '',
		period: '2025.07 ~ 2025.09',
		items: [
			'바닐라 JS → React → TypeScript 점진적 전환을 통한 프레임워크 동작 원리 학습',
			'클린 코드 리팩토링, SRP 기반 컴포넌트 설계, FSD 아키텍처 적용',
			'TDD 기반 단위/통합 테스트(Vitest + RTL), 성능 프로파일링 및 렌더링 최적화',
		],
	},
	{
		title: '오픈소스 컨트리뷰션 아카데미',
		organization: '과학기술정보통신부',
		period: '2023.07 ~ 2024.01',
		items: [
			'CNCF 졸업 프로젝트 Argo Workflows 컨트리뷰터 멘티 활동 (GitHub 13.6k++)',
			'과학기술정보통신부 장관상 수상 (대상)',
			'React UI 레거시 클래스 컴포넌트를 함수형으로 전환하고, 워크플로우 목록 화면의 필터링 UX 개선을 제안·구현하여 PR 제출',
		],
	},
	{
		title: '테오의 스프린트 15기',
		organization: '',
		period: '2023.06',
		items: [
			'FE 6, BE 2, 디자이너 1 구성으로 5일간 기획→설계→개발→배포 스프린트',
			'AI 이미지 생성, 3D 애니메이션 로더, 실시간 페어프로그래밍 기능 개발',
		],
	},
];

const RESUME: Resume = {
	careers: CAREERS,
	education: EDUCATION,
	activities: ACTIVITIES,
};

export default RESUME;
