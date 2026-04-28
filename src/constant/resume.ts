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
	serviceUrl?: string;
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

export type ActivityItem = {
	text: string;
	links?: ResumeLinkProps[];
};

export type Activity = {
	title: string;
	organization: string;
	period: string;
	items: (string | ActivityItem)[];
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
			'누적 이용자 500만의 AI 기반 정책 추천 플랫폼 Wello와 B2B SaaS Wello-biz의 프론트엔드를 담당하고 있습니다. 규제성 데이터 연동, 커머스 전환, 운영 백오피스처럼 제품 확장에 필요한 기능을 만들고, 레거시 정리·보안 대응·성능 개선으로 운영 품질을 높이고 있습니다.',
		highlights: [
			{ text: '의료·통신·신용 3개 기관의 마이데이터 연동 플로우와 연결 관리 체계를 설계하고 API 연동' },
			{ text: '기부 중심 상품 도메인을 커머스 서비스로 확장하기 위한 결제·주문·후기·운영 백오피스 기반 구축' },
			{ text: '모바일 중심 Wello 서비스를 PC 레이아웃으로 개편하며 통합검색과 주요 상세 페이지를 담당' },
			{ text: '레거시 Vue/Next.js 공존 어드민의 401 토큰 갱신 파이프라인을 구현해 세션 단절 문제 해결' },
			{
				text: 'React 19·Next.js 16 업그레이드, OpenAPI 기반 타입 생성, 레거시 의존성 제거로 유지보수성 개선',
			},
		],
		techStack: [
			'React 19',
			'Next.js 16',
			'TypeScript',
			'TanStack Query v5',
			'Zustand',
			'Tailwind CSS',
			'Zod',
			'OpenAPI',
			'Storybook',
		],
		serviceGroups: [
			{
				service: 'Wello',
				serviceUrl: 'https://www.welfarehello.com/',
				serviceDescription: 'AI 기반 개인 맞춤형 정책 추천 플랫폼',
				projects: [
					{
						title: '마이데이터 연동 및 연결 관리 구축',
						date: '2025.12 ~ 2026.03',
						description:
							'AI 정책 추천의 정확도를 높이기 위해 의료(KHIS), 통신(KOSCOM), 신용(NICE) 데이터를 연동해야 했습니다. 외부 본인인증·전자서명 SDK와 규제성 동의 플로우가 포함된 도메인이라, 상태 모델링부터 API 연동, QA 대응까지 프론트엔드 전반을 담당했습니다.',
						achievements: [
							{
								title:
									'기관별로 다른 인증·동의·전송요구·전자서명 단계를 타입 기반 스텝 설정으로 모델링했습니다. URL 쿼리와 sessionStorage를 조합해 새로고침·뒤로가기에도 플로우 상태가 유지되도록 설계하고 기관별 API를 연동했습니다.',
							},
							{
								title:
									'전역 객체로 동작하는 외부 본인인증 SDK를 TypeScript 타입과 전용 훅으로 감싸 스크립트 로딩, 전자서명 콜백, cleanup, stale closure 방지를 한 곳에서 관리하도록 분리했습니다.',
							},
							{
								title:
									'연결 관리 대시보드, 기관 상세, 전송 이력, 재동의, 일괄 철회를 17개 동적 라우트로 구성했습니다. 연동 상태 기반 route guard와 부분 실패 처리를 적용해 일부 기관 철회 실패 시에도 실패 건만 사용자에게 피드백하도록 만들었습니다.',
							},
						],
					},
					{
						title: '커머스 서비스 결제/주문 플로우 구축',
						date: '2026.02 ~ 2026.04',
						description:
							'기부 중심으로 운영되던 상품 도메인을 일반 커머스 형태로 확장해야 했습니다. 상품 선택 이후 결제, 쿠폰, 포인트, 주문 완료, 후기 작성까지 이어지는 핵심 구매 여정을 제품 출시 기준에 맞춰 구현했습니다.',
						achievements: [
							{
								title:
									'상품, 배송지, 쿠폰, 포인트, 결제수단을 하나의 체크아웃 상태로 관리하고 주문 생성·결제 요청·주문 완료까지 이어지는 구매 파이프라인을 구현했습니다.',
							},
							{
								title:
									'쿠폰 적용 정책이 옵션별에서 상품별로 바뀌는 요구사항 변경을 결제 상태 모델에 흡수했습니다. 쿠폰 할인액, 포인트 사용액, 최종 결제 금액이 일관되게 계산되도록 금액 산정 흐름을 재구성했습니다.',
							},
							{
								title:
									'주문 이후 별점·텍스트·이미지 업로드 기반 후기 작성 플로우를 구축해 구매 완료 후 사용자 생성 콘텐츠가 운영 백오피스와 이어질 수 있는 기반을 마련했습니다.',
							},
						],
					},
					{
						title: 'Wello PC 레이아웃 개편',
						date: '2026.04',
						description:
							'기존 Wello 서비스는 PC에서도 모바일 중심 레이아웃으로 제공되어 검색 결과 탐색과 상세 정보 확인에 한계가 있었습니다. 통합검색과 주요 상세 페이지의 PC 레이아웃 전환을 담당했습니다.',
						achievements: [
							{
								title:
									'통합검색을 PC 화면에 맞춰 검색 입력, 검색어 칩, 필터 사이드바, 정렬, 페이지네이션, 인기 정책을 함께 볼 수 있는 구조로 재배치했습니다.',
							},
							{
								title:
									'정책 상세 페이지를 AI 요약, 지원대상, 지원내용, 신청방법, 준비서류, 관할기관, 댓글/공유/북마크 액션이 구분되는 섹션형 구조로 구성했습니다.',
							},
						],
					},
					{
						title: '고향사랑기부 핵심 여정 안정화',
						date: '2025.11 ~ 2026.04',
						description:
							'기부, 인증, 페이지 전환처럼 사용자가 바로 이탈하거나 중복 행동을 할 수 있는 지점을 우선 안정화했습니다. 단순 UI 수정이 아니라 Next.js App Router의 캐시·로딩 경계·인증 쿠키 반영 타이밍까지 원인을 추적했습니다.',
						achievements: [
							{
								title:
									'기부 상세 진입 시 납부 이력을 확인해 이미 기부한 사용자에게 확인 모달을 노출하도록 구현했습니다. 중복 납부 가능성을 낮추고 결제 전 사용자 확인 단계를 보강했습니다.',
							},
							{
								title:
									'로그인/로그아웃 직후 인증 상태가 잘못 보이는 문제를 Router Cache와 쿠키 반영 타이밍 관점에서 분석하고, 필요한 경로를 하드 내비게이션으로 전환해 인증 상태가 일관되게 반영되도록 했습니다.',
							},
							{
								title:
									'루트 loading.tsx가 모든 라우트 전환을 덮어 화면이 깜빡이던 문제를 제거하고, 필요한 위치에만 Suspense boundary를 배치해 이전 화면을 유지한 채 전환되도록 개선했습니다.',
								links: [
									{
										title: '관련글',
										url: 'https://www.ycow-dev.com/blog/posts/next/loading_vs_suspense',
									},
								],
							},
						],
					},
				],
			},
			{
				service: 'Commerce Admin',
				serviceDescription: '커머스 운영 백오피스',
				projects: [
					{
						title: '커머스 운영 백오피스 구축',
						date: '2026.01 ~ 2026.04',
						description:
							'커머스 도메인이 추가되면서 포인트, 입점업체, 프로모션, 타임세일, 고객센터, 주문 관리 기능을 운영팀이 직접 다룰 수 있는 백오피스가 필요했습니다. 서로 다른 운영 도메인의 목록·상세·등록·수정·검색 흐름을 일관된 관리 경험으로 묶었습니다.',
						achievements: [
							{
								title:
									'포인트 내역 조회, 관리자 지급·차감, 신용카드 프로모션, 입점업체, 타임세일, 1:1 문의, 후기 관리까지 7개 운영 도메인의 목록·상세·등록·수정·검색 필터·페이지네이션 패턴을 구축했습니다.',
							},
							{
								title:
									'주문 완료, 배송 준비, 배송 완료, 취소, 반품 등 주문 상태별로 가능한 운영 액션을 정리했습니다. 현재 상태에서 수행할 수 있는 배송·취소·반품 처리만 노출되도록 구성해 잘못된 상태 변경을 줄이고, 주문 처리 UI를 일관된 패턴으로 확장할 수 있도록 했습니다.',
							},
							{
								title:
									'입점업체 데이터 복사, 암호화 필드 복호화 조회, 배송 조회, 날짜 범위 필터 등 운영자가 주문·정산·고객 응대 과정에서 반복적으로 쓰는 관리 기능을 안정화했습니다.',
							},
						],
					},
				],
			},
			{
				service: 'Admin 공통',
				serviceDescription: 'Wello · Wello-biz 운영 어드민',
				projects: [
					{
						title: '어드민 인증·개인정보 보호 개선',
						date: '2025.12 ~ 2026.03',
						description:
							'레거시 Vue admin과 Next.js admin이 iframe으로 공존하면서 토큰 만료 시 수동 재로그인이 필요했고, 개인정보 조회 화면은 ISMS-P 결함 조치가 필요했습니다. 운영 도구의 세션 안정성과 개인정보 보호 기준을 함께 개선했습니다.',
						achievements: [
							{
								title:
									'토큰 만료로 401이 발생하면 한 번만 refresh를 시도하고, 성공 시 실패했던 요청을 다시 보내는 인증 파이프라인을 구현했습니다. 동시에 발생한 401 요청은 같은 refresh 결과를 기다리게 해 중복 갱신을 막았습니다.',
							},
							{
								title:
									'iframe으로 공존하는 Vue·Next 어드민이 같은 쿠키를 공유하도록 hostname 기반 쿠키 도메인을 런타임에 계산했습니다. logout 요청은 refresh 대상에서 제외해 무한 재시도 루프를 차단했습니다.',
							},
							{
								title:
									'ISMS-P 결함 조치로 관리자/이용자 목록 자동 조회를 검색 후 조회 방식으로 바꾸고, 개인정보 열람 사유 입력·사전 정의 셀렉트 박스를 적용해 불필요한 개인정보 노출을 줄였습니다.',
							},
						],
					},
				],
			},
			{
				service: 'Wello-biz',
				serviceUrl: 'https://www.wellobiz.com/',
				serviceDescription: 'B2B SaaS 비즈니스 플랫폼',
				projects: [
					{
						title: '레거시 정리 및 기능 개선',
						date: '2025.11 ~ 2026.01',
						description:
							'레거시 UI와 불필요한 의존성으로 번들이 무거워지고 입력 UX 문제도 발생하고 있었습니다. 초기 운영 이슈를 처리하면서 레거시 구조를 함께 정리해 유지보수성과 사용자 경험을 개선했습니다.',
						achievements: [
							{
								title:
									'Chakra UI 의존 전역 컴포넌트와 legacy-assets 폴더를 제거하고, `src/containers` 기반 Pages Router 잔재를 App Router 구조로 이전했습니다. 137개 파일에 걸친 UI 교체와 123개 에셋 파일 삭제로 레거시 의존을 줄였습니다.',
							},
							{
								title:
									'Swiper, react-swipeable, react-feather, yup 등 중복·대체 가능한 라이브러리를 정리하고, Embla Carousel·Pointer Events·SVG 컴포넌트·zod 기반으로 구현을 단순화했습니다.',
							},
							{
								title:
									'지원사업/조달사업 검색 입력을 자동 리사이징 textarea와 칩 입력 UI로 개선하고, DOM 값을 직접 초기화하던 코드를 제거해 한글 IME 자음·모음 분리 버그를 해결했습니다.',
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
						title: '프론트엔드 플랫폼 현대화 및 보안 대응',
						date: '2025.11 ~ 2026.04',
						description:
							'신규 기능 개발과 병행해 프론트엔드 공통 기반을 현대화했습니다. 프레임워크 메이저 업그레이드, API 타입 생성 체계 전환, 번들 최적화, 보안 취약점 대응, UI 품질 기준 강화를 함께 다뤄 장기 유지보수 비용을 낮췄습니다.',
						achievements: [
							{
								title:
									'React 18→19, Next.js 15→16 메이저 업그레이드를 253개 파일에 적용했습니다. Turbopack 설정 전환, middleware→proxy 컨벤션 변경, 서버 컴포넌트 params 비동기 Breaking Change 마이그레이션까지 함께 처리했습니다.',
							},
							{
								title:
									'865줄 규모의 수동 API 래핑과 9개 쿼리 팩토리를 OpenAPI 기반 자동 생성 클라이언트로 전환했습니다. 90개 이상의 소비자 파일을 마이그레이션해 백엔드 스펙 변경에 따른 타입 불일치를 런타임 전에 감지하도록 바꿨습니다.',
							},
							{
								title:
									'번들 최적화로 lottie-web SVG-only 빌드(약 100KB 절감), html2canvas-pro(200KB+) 제거, 날짜 라이브러리 단일화를 진행했습니다. 직렬 요청으로 네트워크 워터폴이 발생하던 화면도 함께 개선해 주요 화면의 로딩 부담을 낮췄습니다.',
							},
							{
								title:
									'Next.js CVE-2026-23869와 레거시 Vue axios 보안 취약점을 선제 확인해 팀에 공유하고 패치했습니다. Storybook a11y addon을 error 모드로 전환하고 인터랙션 테스트를 추가해 UI 품질 기준도 강화했습니다.',
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
							'고객사가 자체 콘텐츠로 사용자를 응대하고 운영자가 직접 AI를 관리할 수 있도록, 챗봇 서비스와 24페이지 규모의 관리자 CMS를 함께 설계·구현했습니다.',
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
									'통계 대시보드, AI 콘텐츠 자동 생성, 벡터 스토어 관리, 프롬프트·모델·응답 스타일 설정 기능을 갖춘 CMS를 구축해 고객사가 개발팀 도움 없이 챗봇을 운영할 수 있도록 했습니다.',
							},
							{
								title:
									'응답 횟수 기반 광고 자동 삽입 기능을 구현해 무료 고객사도 서비스 안에서 수익화할 수 있는 장치를 마련했습니다.',
							},
							{
								title:
									'iOS Safari 가상 키보드로 채팅 화면이 밀리는 문제를 scrollY 기반 복원 로직으로 해결해 모바일 Safari에서도 안정적인 대화 경험을 제공했습니다.',
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
							'백엔드 개발자 1명과 2인 팀에서 정부 지원 과제 관리 서비스 웹과 관리자 CMS의 프론트엔드를 단독으로 담당했습니다. Unity 기반 WebGL 가상공간은 별도 개발 산출물로 연동하고, 웹 서비스와 CMS 운영 흐름을 맡았습니다.',
						achievements: [
							{
								title:
									'서비스 웹(Webpack v5)과 관리자 CMS(Vite)를 목적에 맞게 분리해 인증, 대시보드, 사업지원 관리, 가상공간 진입 흐름까지 웹 프론트엔드 영역을 설계·개발했습니다.',
							},
							{
								title:
									'Unity WebGL 빌드 산출물 연동으로 커지던 초기 로딩 부담을 Lazy Loading과 코드 스플리팅으로 분리하고, bundle-analyzer로 불필요한 코드와 의존성을 제거했습니다.',
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
							'인수받은 WebGL 아바타 서비스는 3D 렌더링과 대용량 정적 자산 때문에 3초 이상 빈 화면이 노출되고 있었습니다. 기존 CRA 레거시와 분리된 구조로 성능 개선과 운영 요구를 반영했습니다.',
						achievements: [
							{
								title:
									'3초 이상 노출되던 빈 화면을 400~600ms 수준으로 줄였습니다. Suspense + lazy로 즉시 렌더링 구조로 전환하고, 정적 자산을 AWS S3 + CDN으로 이전해 초기 로딩 병목을 해소했습니다.',
							},
							{
								title:
									'800~1000줄 규모의 거대 컴포넌트를 공통 컴포넌트와 커스텀 훅으로 분리해 레거시에 큰 영향 없이 기능 수정이 가능한 구조를 만들었고, 이를 기반으로 300명 규모 대학 OT 및 오디션 시스템을 안정적으로 출시했습니다.',
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
							'프로젝트마다 반복되던 Webpack 설정과 CMS UI 커스터마이징 비용을 줄이기 위해 서비스 웹/CMS 보일러플레이트와 CMS 전용 UI Kit를 구축했습니다.',
						achievements: [
							{
								title:
									'서비스 웹(Webpack v5)과 CMS(Vite) 보일러플레이트, Rollup.js 기반 CJS/ESM UI 라이브러리를 구축해 이후 CMS 프로젝트에서 공통으로 재사용할 수 있는 기반을 만들었습니다. Storybook + Chromatic으로 시각적 회귀 테스트까지 표준화했습니다.',
							},
							{
								title:
									'Yarn Berry 모노레포와 Lerna 버전 관리 구조를 도입해 UI 라이브러리, 설정, 유틸 공통 패키지를 함께 관리하고 신규 프로젝트의 초기 환경 구축 부담을 줄였습니다.',
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
			{
				text: '드롭다운 컴포넌트의 클래스 → 함수형 전환, 워크플로우 목록 toolbar UI 개선, Cron Workflow 상세에 실행 이력 노출 기능 등 3개 PR 머지',
				links: [
					{ title: '#11901', url: 'https://github.com/argoproj/argo-workflows/pull/11901' },
					{ title: '#11444', url: 'https://github.com/argoproj/argo-workflows/pull/11444' },
					{ title: '#11811', url: 'https://github.com/argoproj/argo-workflows/pull/11811' },
				],
			},
		],
	},
	{
		title: '테오의 스프린트 15기',
		organization: '',
		period: '2023.06',
		items: [
			'FE 6, BE 2, 디자이너 1 구성으로 5일간 기획→설계→개발→배포 스프린트',
			'AI 이미지 생성, 3D 애니메이션 로더, 실시간 페어 프로그래밍 기능 개발',
		],
	},
];

const RESUME: Resume = {
	careers: CAREERS,
	education: EDUCATION,
	activities: ACTIVITIES,
};

export default RESUME;
