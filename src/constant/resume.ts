import type { ResumeItemProps } from '@/components/resume/ResumeItem';
import type { ResumeLinkProps } from '@/components/resume/ResumeLink';

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

	const start = new Date(`${career.startDate.replace('.', '-')}-01`);
	const end = career.endDate ? new Date(`${career.endDate.replace('.', '-')}-01`) : new Date();
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
			'누적 이용자 500만의 AI 기반 정책 추천 플랫폼 Wello와 B2B SaaS Wello-biz의 프론트엔드를 담당하며, 신규 서비스 확장과 기존 UX 안정화, DX 개선을 함께 이끌고 있습니다.',
		highlights: [
			{ text: '의료·통신·신용 3개 기관 마이데이터 플로우를 공통 구조로 통합해 신규 연동 확장 비용 절감' },
			{ text: '주문·결제·배송·후기·백오피스를 구축해 기부 중심 서비스의 커머스 확장 기반 마련' },
			{ text: '인증 상태 불일치·페이지 전환 깜빡임을 해소해 핵심 사용자 여정의 UX 안정화' },
			{
				text: 'React 19 + Next.js 16 업그레이드, 디자인 시스템·번들 개선으로 DX와 유지보수성 향상',
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
						title: '커머스 서비스 결제 및 주문 시스템 구축',
						date: '2026.03 ~',
						description:
							'기부금 납부 중심이던 서비스를 상품 주문·결제·배송까지 확장할 커머스 전환이 필요했습니다. 사용자 구매 여정과 관리자 백오피스를 함께 구축해 신규 비즈니스 확장의 실행 기반을 만들고 있습니다.',
						achievements: [
							{
								title:
									'나이스페이 PG 연동으로 쿠폰·포인트 적용, 결제, 주문 내역, 후기 작성까지 이어지는 구매 여정을 구현해 사용자가 서비스 안에서 주문 후 행동까지 끊김 없이 완료할 수 있도록 했습니다.',
							},
							{
								title:
									'프로모션, 포인트 지급, 타임세일, 고객센터, 입점업체, 주문 상태 변경·송장 입력 기능을 갖춘 백오피스를 구축해 운영팀이 주문 흐름을 직접 관리할 수 있도록 했습니다.',
							},
						],
					},
					{
						title: '고향사랑기부 기능 개선',
						date: '2026.01',
						description:
							'입사 직후 핵심 서비스에서 인증 상태 불일치와 페이지 전환 깜빡임이 반복되어 사용자가 신뢰하기 어려운 UX가 발생하고 있었습니다. 원인을 분석해 주요 여정의 안정성을 우선 개선했습니다.',
						achievements: [
							{
								title:
									'로그인/로그아웃 직후 인증 상태가 잘못 보이는 UX 오류를 해결했습니다. Router Cache가 이전 RSC payload를 재사용해 쿠키 변경이 즉시 반영되지 않는 문제를 확인했고, 하드 내비게이션으로 전환해 인증 상태가 일관되게 반영되도록 했습니다.',
							},
							{
								title:
									'페이지 전환마다 전체 화면이 깜빡이는 문제를 제거했습니다. 루트 loading.tsx가 모든 라우트 전환을 덮고 있었고, 이를 제거한 뒤 필요한 위치에만 Suspense boundary를 배치해 이전 화면을 유지한 채 자연스럽게 전환되도록 개선했습니다.',
								links: [
									{
										title: '관련글',
										url: 'https://www.ycow-dev.com/blog/posts/next/loading_vs_suspense',
									},
								],
							},
						],
					},
					{
						title: '마이데이터 연동',
						date: '2025.12',
						description:
							'AI 정책 추천의 정확도를 높이기 위해 의료·통신 마이데이터 연동과 신용등급 조회가 필요했습니다. 인증 보안 심사를 통과해야 하는 규제 영역이어서, 3개 기관의 인증·동의·전자서명 플로우 구현부터 심사 대응까지 프론트엔드 전반을 담당했습니다.',
						achievements: [
							{
								title:
									'의료·통신·신용 3개 기관의 인증 플로우를 공통 구조로 통합해 기관별 개별 구현 비용이 비례 증가하지 않도록 했습니다. 이후 신규 기관 추가도 설정 중심으로 확장할 수 있는 기반을 마련했습니다.',
							},
							{
								title:
									'20개 이상의 약관 동의 과정을 자동 스크롤·동의 UX로 단순화해 사용자가 필요한 항목을 직접 찾지 않아도 흐름을 완료할 수 있도록 했습니다. 가시 영역 추적 훅을 설계해 복잡한 동의 절차의 인지 부담을 낮췄습니다.',
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
							'레거시 UI와 불필요한 의존성으로 번들이 무거워지고 입력 UX 문제도 발생하고 있었습니다. 기술 부채를 먼저 정리한 뒤 기능 개선을 진행해 유지보수성과 사용자 경험을 함께 개선했습니다.',
						achievements: [
							{
								title:
									'Chakra UI 의존 전역 컴포넌트 11개를 Tailwind CSS 기반으로 교체해 번들 부담을 줄이고, 레거시 UI 라이브러리 의존성을 완전히 제거했습니다.',
							},
							{
								title:
									'textarea value를 직접 초기화하던 DOM 조작을 걷어내 한글 IME 입력 버그를 해결했습니다. 자음·모음 분리 없이 안정적으로 입력할 수 있도록 UX를 복구했습니다.',
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
							'기존 Vue 레거시와 Next.js가 iframe으로 공존하는 환경에서 런타임 타입 오류, 수동 재로그인, 불필요한 번들 증가가 반복되고 있었습니다. 기능 개발과 병행해 공통 기반을 정리하며 장애 예방, 개발 속도, 사용자 세션 안정성을 함께 개선했습니다.',
						achievements: [
							{
								title:
									'React 18→19, Next.js 15→16, Turbopack 전환을 완료해 로컬 서버 시작과 HMR 체감을 개선하고, 서버 컴포넌트 params 비동기 Breaking Change 마이그레이션을 마쳤습니다.',
							},
							{
								title:
									'865줄 규모의 수동 API 래핑을 OpenAPI 기반 자동 생성으로 전환해, 백엔드 스펙 변경 시 타입 불일치를 런타임 전에 감지하도록 바꿨습니다.',
							},
							{
								title:
									'401 인터셉터와 토큰 갱신 파이프라인을 도입해 토큰 만료 시 수동 재로그인을 제거하고 세션 단절 경험을 줄였습니다.',
							},
							{
								title:
									'번들 최적화로 lottie-web SVG-only 빌드(약 100KB 절감), html2canvas-pro(200KB+) 제거, 날짜 라이브러리 단일화를 진행해 주요 화면의 로딩 부담을 낮췄습니다.',
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
			'3개 서비스(AI 챗봇·업무 지원 플랫폼·WebGL 아바타)의 프론트엔드를 담당하며, 신규 서비스 출시와 레거시 개선을 병행했습니다. 성능 병목 해소, CSR→SSR 전환, 팀 공통 개발 기반 구축으로 사용자 경험과 팀 생산성을 함께 끌어올렸습니다.',
		highlights: [
			{ text: 'AI 챗봇 플랫폼과 24페이지 CMS를 구축해 고객사가 개발팀 도움 없이 챗봇을 운영할 수 있는 기반 마련' },
			{
				text: '외주 인수받은 WebGL 아바타 서비스의 3초 빈 화면을 400~600ms 수준으로 단축',
			},
			{ text: 'CSR 서비스를 Next.js 15 SSR로 전환해 SEO 수작업을 자동화하고 고객사 운영 효율 개선' },
			{ text: 'CMS 전용 UI Kit와 SSR/SPA 보일러플레이트를 구축해 신규 프로젝트 초기 세팅 비용 절감' },
			{ text: 'AI 기반 대화형 설문 MVP를 풀스택으로 개발·배포해 신규 서비스 검증 지원' },
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
							'고객사가 자체 콘텐츠를 바탕으로 사용자를 응대하고, 운영자가 직접 AI를 관리할 수 있는 플랫폼이 필요했습니다. 챗봇 서비스와 24페이지 규모의 관리자 CMS를 함께 설계·구현해 운영 독립성과 사용자 대화 경험을 동시에 확보했습니다.',
						achievements: [
							{
								title:
									'SSE 기반 실시간 스트리밍과 역방향 무한 스크롤을 구현해 자연스러운 대화 흐름과 채팅 히스토리 조회 UX를 개선했습니다.',
								links: [
									{
										title: '관련글',
										url: 'https://www.ycow-dev.com/blog/posts/next/reverse_infinite_scroll',
									},
								],
							},
							{
								title:
									'통계 대시보드, AI 콘텐츠 자동 생성, 벡터 스토어 관리, 프롬프트·모델·응답 스타일 설정 기능을 갖춘 CMS를 구축해 고객사가 개발팀 도움 없이 챗봇을 직접 운영할 수 있도록 했습니다.',
							},
							{
								title:
									'응답 횟수 기반 광고 자동 삽입 기능을 구현해 무료 고객사도 서비스 안에서 수익화할 수 있는 장치를 마련했습니다.',
							},
							{
								title:
									'iOS Safari 가상 키보드로 채팅 화면이 밀리는 문제를 해결해 모바일 Safari에서도 동일한 대화 경험을 제공했습니다. 포커스 시점 scrollY를 기준으로 복원 로직을 구현해 하단 가상 영역 노출을 제거했습니다.',
								links: [
									{
										title: '관련글',
										url: 'https://www.ycow-dev.com/blog/posts/issues/ios_virtual_keyboards',
									},
								],
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
							'백엔드 개발자 1명과 2인 팀으로 운영되어, WebGL 기반 3D 가상 오피스와 정부 지원 과제 관리 서비스를 빠르게 출시할 프론트엔드 오너가 필요했습니다. 서비스 웹과 관리자 CMS 전반을 단독으로 맡아 초기 제품 구축과 운영 기반을 함께 만들었습니다.',
						achievements: [
							{
								title:
									'서비스 웹(Webpack v5)과 관리자 CMS(Vite)를 목적에 맞게 분리해 인증·대시보드·사업지원·가상오피스까지 프론트엔드 전 영역을 혼자 설계·개발했습니다.',
							},
							{
								title:
									'WebGL 자산으로 커지던 초기 번들을 Lazy Loading + 코드 스플리팅으로 분리하고 bundle-analyzer로 불필요한 코드와 의존성을 제거해 초기 로딩 부담을 줄였습니다.',
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
							'인수받은 WebGL 아바타 서비스는 3D 렌더링과 대용량 정적 자산 때문에 3초 이상 빈 화면이 노출되고 있었습니다. 종료 예정인 CRA 레거시라 전면 리팩토링 대신 기존 시스템과 분리된 모듈화 구조를 설계해 성능 개선과 운영 요구를 빠르게 반영했습니다.',
						achievements: [
							{
								title:
									'3초 이상 노출되던 빈 화면을 400~600ms 수준으로 줄였습니다. Suspense + lazy로 즉시 렌더링 구조로 전환하고, 정적 자산을 AWS S3 + CDN으로 이전해 초기 로딩 병목을 해소했습니다.',
							},
							{
								title:
									'800~1000줄 규모의 거대 컴포넌트를 공통 컴포넌트와 커스텀 훅으로 분리해 레거시에 큰 영향 없이 기능 수정이 가능한 구조를 만들었고, 이를 기반으로 300명 규모 대학 OT 및 오디션 시스템을 안정적으로 런칭했습니다.',
							},
						],
					},
				],
			},
			{
				service: '공통',
				projects: [
					{
						title: 'CMS 전용 UI Kit & 보일러플레이트',
						date: '2023.12 ~ 2024.12',
						description:
							'프로젝트를 새로 시작할 때마다 Webpack 설정을 반복했고, CMS 개발은 MUI/Antd 커스터마이징 비용이 커서 속도가 느렸습니다. 프로젝트 성격별 보일러플레이트와 CMS 전용 UI Kit를 구축해 신규 개발 착수 비용을 줄이고 팀의 공통 생산성을 높였습니다.',
						achievements: [
							{
								title:
									'서비스 웹(Webpack v5)과 CMS(Vite) 보일러플레이트, Rollup.js 기반 CJS/ESM UI 라이브러리를 구축해 이후 CMS 프로젝트에서 공통으로 재사용할 수 있는 기반을 만들었습니다. Storybook + Chromatic으로 시각적 회귀 테스트까지 표준화했습니다.',
							},
							{
								title:
									'Yarn Berry 모노레포 + Lerna 버전 관리 구조를 도입해 UI 라이브러리뿐 아니라 설정·유틸 공통 패키지도 함께 관리하도록 바꿨고, 신규 프로젝트에서 환경 구축보다 비즈니스 로직에 더 빨리 진입할 수 있게 했습니다.',
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
			'CNCF 졸업 프로젝트 Argo Workflows 컨트리뷰터 멘티 활동 (GitHub 13.6k+ Stars)',
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
