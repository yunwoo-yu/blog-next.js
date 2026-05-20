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

type CareerPeriodTarget = Pick<Careers, 'startDate' | 'endDate' | 'period'>;

export type CareerDetailProject = Pick<Project, 'title' | 'date'> & {
	details: ResumeItemProps[];
};

export type CareerDetailServiceGroup = Omit<ServiceGroup, 'projects'> & {
	projects: CareerDetailProject[];
};

export type CareerDetailCareer = Pick<Careers, 'organization' | 'position' | 'startDate' | 'endDate' | 'period'> & {
	serviceGroups: CareerDetailServiceGroup[];
};

export function getCareerPeriod(career: CareerPeriodTarget) {
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
		position: '프론트엔드 개발자 | 제품실 개발팀',
		startDate: '2025.11',
		description:
			'누적 이용자 500만 규모의 Wello와 B2B SaaS Wello-biz에서 사용자 화면과 운영 어드민을 개발하고 있습니다.',
		highlights: [
			{
				text: '웰마켙 NICE Payments PG 연동과 주문 단계별 구매·운영 플로우를 구축해, 오픈 이후 결제 금액 불일치 이슈 0건으로 운영했습니다.',
			},
			{
				text: '의료·통신·신용 3개 기관 마이데이터 연동과 연결 관리 화면을 구축하고, 외부 인증·전자서명 SDK를 React 훅으로 분리했습니다.',
			},
			{
				text: 'React 19·Next.js 16 업그레이드, Wello API 호출 래퍼 정리, 401 토큰 갱신 개선, 레거시 UI 제거를 진행했습니다.',
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
							'의료(KHIS), 통신(KOSCOM), 신용(NICE) 3개 기관의 마이데이터 연동과 연결 관리 화면을 구축했습니다.',
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
						title: '웰마켙 PG 결제·주문 단계별 처리 플로우 구축',
						date: '2026.02 ~ 2026.05',
						description:
							'고향사랑기부 답례품 기반 지역 상품을 웰마켙에서 판매할 수 있도록, NICE Payments PG 연동부터 주문 확인과 배송·반품·환불 운영까지 이어지는 주문 단계별 처리 흐름을 구축했습니다.',
						achievements: [
							{
								title:
									'서버의 주문 준비 데이터를 기준으로 상품·배송 쿠폰, 웰포인트, 결제수단을 하나의 체크아웃 상태로 관리하고 최종 결제 금액을 계산했습니다.',
							},
							{
								title:
									'NICE Payments PG SDK 연동, 결제 요청 파라미터 구성, return URL 처리, 결제 전 예외 차단을 구현해 오픈 이후 결제 금액 불일치 이슈 0건으로 운영했습니다.',
							},
							{
								title:
									'구매 이후 주문 단계에 따라 주문내역, 배송조회, 영수증, 후기 작성과 운영 어드민의 배송·반품·환불 처리를 연결했습니다.',
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
						title: '고향사랑기부 지로 납부 연동 및 결제 안정화',
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
					{
						title: 'Wello 구형 query factory 제거 및 API 호출 래퍼 정리',
						date: '2025.11 ~ 2025.12',
						description:
							'Wello 서버 API가 v2 기준으로 정리되는 과정에서, v1 시절에 화면별로 만들던 구형 query factory 호출부를 제거했습니다. 화면 코드에서 실제 API 주소와 타입을 함께 확인할 수 있도록 Wello API 호출 래퍼를 정리했습니다.',
						achievements: [
							{
								title:
									'pathMapping을 기준으로 Auth·Unauth API, QueryOptions, QueryKey, Mutation을 get:/wello/v2/... 형태의 실제 주소 문자열로 호출할 수 있게 매핑했습니다.',
							},
							{
								title:
									'생성기가 QueryOptions를 만들지 않는 POST 조회성 API도 createQueryOptionsWithPost로 감싸, 검색·검증 화면에서 같은 TanStack Query 패턴을 사용할 수 있게 했습니다.',
							},
							{
								title:
									'90개 이상의 기존 호출부를 주소 기반 래퍼로 옮기고, query-factory 폴더에는 소셜 로그인·제주청년꿈처럼 자동 생성 API로 대체하기 어려운 예외만 남겼습니다.',
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
						title: 'Wello-biz 상세검색 키워드 입력 UX 개선',
						date: '2025.11 ~ 2026.01',
						description:
							'지원사업·조달사업 상세검색에서 키워드를 OR·AND·NOT 조건으로 여러 개 추가해 검색하는 입력 UI를 개선했습니다.',
						achievements: [
							{
								title:
									'검색어를 태그처럼 추가·삭제할 수 있는 자동 리사이징 textarea 입력 컴포넌트를 만들고, Enter 처리 시 IME 조합 상태를 확인해 한글 자음·모음 분리 문제를 해결했습니다.',
							},
							{
								title:
									'지원사업 AI 검색, 지원사업 상세검색, 조달사업 상세검색, 조달 입찰 검색의 11개 키워드 입력 지점에 적용해 검색어 추가·삭제·초기화 동작을 일관되게 맞췄습니다.',
							},
							{
								title:
									'검색 조건 검증은 zod schema로 분리해 OR·AND·NOT 키워드 중 최소 1개 조건을 입력해야 검색할 수 있도록 구성했습니다.',
							},
						],
					},
				],
			},
			{
				service: 'Frontend Platform',
				serviceDescription: 'Admin 운영 도구 공통 기반',
				projects: [
					{
						title: '어드민 인증·개인정보 보호 개선',
						date: '2025.12 ~ 2026.03',
						description:
							'초기 운영 필요에 맞춰 빠르게 만들어진 기존 Vue 어드민을 유지하면서, 신규 어드민 화면은 Next.js로 전환하는 구조였습니다. 데이터팀에서 운영 중 반복 401로 작업이 끊기는 문제를 제보했고, 두 화면이 같은 관리자 세션을 쓰도록 토큰 갱신과 개인정보 조회 기준을 함께 정리했습니다.',
						achievements: [
							{
								title:
									'Next 내부에서 동시에 발생한 401은 하나의 refresh 결과를 기다리게 하고, 성공하면 실패했던 요청을 새 토큰으로 다시 보내도록 구성했습니다.',
							},
							{
								title:
									'refresh 성공 시 access token 조각 쿠키와 refresh token 쿠키를 함께 갱신해 Vue iframe과 Next 화면이 같은 관리자 세션을 보도록 맞췄습니다.',
							},
							{
								title:
									'ISMS-P 결함 조치로 관리자/이용자 목록 자동 조회를 검색 후 조회 방식으로 바꾸고, 복호화 조회 액션을 분리해 불필요한 개인정보 노출을 줄였습니다.',
							},
						],
					},
				],
			},
		],
	},
	{
		organization: '(주)살린',
		position: '프론트엔드 개발자 | ILab',
		startDate: '2023.08',
		endDate: '2025.08',
		description:
			'AI 챗봇 플랫폼, 스타트업 업무 지원 플랫폼, WebGL 아바타 서비스의 사용자 화면과 관리자 CMS를 개발했습니다.',
		highlights: [
			{
				text: 'AI Talker 서비스와 24페이지 관리자 CMS를 구축하고 Next.js 15 SSR 전환으로 고객사별 SEO·사이트맵 자동화를 적용했습니다.',
			},
			{
				text: '외주 인수받은 WebGL 아바타 서비스의 3초 이상 빈 화면을 400~600ms 수준으로 줄이고, 300명 규모 오리엔테이션 행사용 서비스를 출시했습니다.',
			},
			{
				text: 'AI 설문 생성 MVP, CMS UI Kit, 서비스/CMS 보일러플레이트를 개발해 신규 AI·CMS 프로젝트의 초기 구축 속도를 높였습니다.',
			},
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
						date: '2025.01 ~ 2025.08',
						description:
							'고객사가 자체 콘텐츠로 사용자를 응대하고 운영자가 직접 AI를 관리할 수 있도록, OpenAI Assistant API 기반 챗봇 서비스와 24페이지 규모의 관리자 CMS를 함께 설계·구현했습니다.',
						achievements: [
							{
								title:
									'Threads·Messages·Runs 흐름을 SSE로 연결하고 역방향 무한 스크롤을 구현해, 실시간 답변 생성과 채팅 히스토리 조회 UX를 개선했습니다.',
								links: [
									{
										title: '관련글',
										url: 'https://www.ycow-dev.com/blog/posts/next/reverse_infinite_scroll',
									},
								],
							},
							{
								title:
									'프롬프트·모델·응답 스타일·파일 등록·벡터 스토어 관리, 통계 대시보드, AI 콘텐츠 자동 생성 기능을 CMS에 구축해 고객사가 개발팀 도움 없이 챗봇을 운영할 수 있도록 했습니다.',
							},
							{
								title:
									'CSR 기반 React 서비스를 Next.js 15 App Router SSR 구조로 전환하고, 고객사별 동적 메타데이터·다국어 OpenGraph·API 기반 사이트맵을 적용해 검색 노출 관리 흐름을 자동화했습니다.',
							},
							{
								title:
									'무료 고객사의 챗봇 응답 횟수를 기준으로 광고를 자동 삽입하는 기능을 구현해, 서비스 안에서 수익화할 수 있는 장치를 마련했습니다.',
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
					{
						title: 'AI 대화형 설문 생성 MVP',
						date: '2024.08 ~ 2024.12',
						description:
							'대화형으로 설문 목적을 입력하면 AI가 설문 문항을 순차 생성하는 MVP를 프론트엔드, Nest.js API 연동, 배포 파이프라인까지 맡아 개발·배포했습니다.',
						achievements: [
							{
								title:
									'AssistantStream의 텍스트 델타 이벤트를 UI에 실시간 반영하고, 스트리밍 상태에 따라 자동 스크롤·입력 제어·설문 문항 누적 표시를 처리했습니다.',
							},
							{
								title:
									'배포 가능한 환경까지 완성해 팀이 OpenAI 스트리밍 UX를 실제 화면에서 검증할 수 있게 했고, 이후 AI Talker의 SSE·채팅 UI 구현 기반으로 활용했습니다.',
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
							'백엔드 개발자 1명과 2인 팀에서 정부 지원 과제 관리 서비스 웹과 관리자 CMS의 프론트엔드를 단독으로 담당했습니다. Unity 기반 WebGL 가상공간과 연결되는 웹 진입·운영 흐름을 함께 구현했습니다.',
						achievements: [
							{
								title:
									'서비스 웹(Webpack v5)과 관리자 CMS(Vite)를 목적에 맞게 분리해 인증, 대시보드, 사업지원 관리, WebGL 가상공간으로 이동하는 웹 진입 흐름까지 설계·개발했습니다.',
							},
							{
								title:
									'WebGL 가상공간 진입에 필요한 웹 화면과 연결 로직을 서비스 흐름에 붙이고, 서비스 웹·CMS의 초기 로딩 부담은 Lazy Loading, 코드 스플리팅, bundle-analyzer 기반 의존성 정리로 줄였습니다.',
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
									'800~1000줄 규모의 거대 컴포넌트를 공통 컴포넌트와 커스텀 훅으로 분리해 레거시에 큰 영향 없이 기능 수정이 가능한 구조를 만들었습니다. 기존 시스템 분석 범위를 줄여 일정을 단축하고, 300명 규모 대학 OT 및 오디션 시스템을 안정적으로 출시했습니다.',
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
						date: '2023.12 ~ 2024.01',
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

const CAREER_DETAIL_OVERRIDES: Record<string, ResumeItemProps[]> = {
	'마이데이터 연동 및 연결 관리 구축': [
		{
			title:
				'정책 추천 고도화를 위해 사용자가 직접 입력한 프로필을 넘어 의료·통신·신용 데이터를 연결할 수 있는 기반이 필요했습니다. 다만 마이데이터는 단순 API 연동이 아니라 기관별 본인인증, 동의, 전송요구, 전자서명, 재동의, 철회, 전송 이력 확인까지 심사 기준에 맞춰 검증되어야 하는 규제성 플로우였습니다.',
		},
		{
			title:
				'기관마다 다른 인증·동의 절차를 타입 기반 스텝 설정으로 모델링하고, URL 쿼리와 sessionStorage로 새로고침·뒤로가기 이후에도 진행 상태를 복원하도록 구성했습니다. 외부 본인인증 SDK는 전용 React 훅으로 분리해 스크립트 로딩, 전자서명 콜백, cleanup을 한 곳에서 관리했습니다.',
		},
		{
			title:
				'기관별로 달랐던 인증·동의·철회 절차를 공통 스텝 구조로 흡수해, 새로고침·뒤로가기·부분 실패 상황에서도 진행 상태와 예외 처리를 같은 기준으로 검증할 수 있게 했습니다. 이후 기관별 보완 요청이 들어와도 화면을 새로 만드는 대신 스텝 설정과 API 연결 단위로 대응할 수 있는 프론트엔드 구조를 확보했습니다.',
		},
	],
	'웰마켙 PG 결제·주문 단계별 처리 플로우 구축': [
		{
			title:
				'고향사랑기부 답례품 기반 지역 상품을 웰마켙에서 판매하면서, 주문 준비 데이터가 PG 결제·주문내역·운영 처리까지 같은 기준으로 이어져야 했습니다. 상품 금액, 배송비, 쿠폰, 웰포인트가 함께 반영되어 화면 표시 금액과 checkout 요청 금액이 어긋나지 않도록 결제 흐름을 설계해야 했습니다.',
		},
		{
			title:
				'서버 주문 준비 데이터를 기준으로 최종 결제 금액을 계산하고, NICE Payments PG SDK 연동, 결제 요청 파라미터 구성, return URL 처리, 결제 전 예외 차단을 구현했습니다. 구매 이후에는 주문 단계에 따라 주문내역, 배송조회, 영수증, 후기 작성과 운영 어드민의 배송·반품·환불 처리를 연결했습니다.',
		},
		{
			title:
				'결제 전 금액 계산 기준과 예외 상태를 화면에서 먼저 검증해, 오픈 이후 결제 금액 불일치 이슈 0건으로 운영했습니다. 사용자와 운영팀·입점업체가 주문 단계에 맞춰 주문 확인, 배송 처리, 반품·환불, 고객 응대를 이어갈 수 있게 되었습니다.',
		},
	],
	'Wello PC 레이아웃 개편': [
		{
			title:
				'기존 Wello는 PC에서도 600px 폭의 모바일 화면을 그대로 제공해, 넓은 화면에서 정책과 지역 콘텐츠를 함께 탐색하기 어려웠습니다. 앱 사용 비중이 높은 상황에서 PC 웹 사용자가 홈에서 맞춤정책, 동네소식, 정책 활용 가이드로 이어지며 더 오래 탐색할 수 있는 구조가 필요했습니다.',
		},
		{
			title:
				'홈을 중앙 피드와 우측 사이드 영역으로 나누고, 퀵메뉴를 PC 6열 그리드로 전환해 첫 화면에서 탐색 가능한 선택지를 늘렸습니다. 지역 선택값을 기준으로 정책, 정책 활용 가이드, 정책카드, 동네소식, 기부사업, 웰마켓 상품을 피드 카드로 노출하고 콘텐츠 타입별 상세 페이지로 연결했습니다.',
		},
		{
			title:
				'개편 이후 GA4 기준 desktop 평균 참여 시간이 약 20% 증가했습니다. 홈에서 바로 정책·동네소식·정책 활용 가이드를 발견하고 상세 화면으로 이어질 수 있게 되면서, PC 웹에서도 콘텐츠를 이어서 탐색하는 구조를 만들었습니다.',
		},
	],
	'고향사랑기부 지로 납부 연동 및 결제 안정화': [
		{
			title:
				'고향사랑기부는 Wello 내부 PG 결제가 아니라, 기부 신청 후 생성된 납부 식별값으로 외부 지로 납부 화면에서 결제를 완료하는 구조였습니다. 사용자가 외부 화면으로 이동하면 Wello가 진행 상태를 직접 통제하기 어려워, 결제 전 입력 오류나 납부 완료 반영 지연이 중복 기부와 잘못된 완료 처리로 이어질 수 있었습니다.',
		},
		{
			title:
				'이를 줄이기 위해 답례품 없는 기부와 장바구니 기부 양쪽에서 결제 전 주민등록번호 인증, 기부 가능 여부, 기부금, 기부 용도, 배송지 입력 상태를 검증했습니다. 결제 버튼을 누르는 시점에는 최신 기부 완료 이력을 다시 조회해, 이미 기부한 내역이 있으면 사용자가 확인 후 계속 진행 여부를 선택할 수 있게 했습니다.',
		},
		{
			title:
				'외부 지로 납부 화면을 거쳐도 Wello에서 결제 진행 상태를 다시 확인할 수 있게 되면서, 중복 기부 여부 확인과 관련된 CS 문의율을 약 50% 줄였습니다. 납부 화면 이동과 복귀 처리는 실행 환경별로 분기해 앱·웹뷰에서도 같은 기준으로 완료 여부를 확인하도록 했습니다.',
		},
	],
	'어드민 인증·개인정보 보호 개선': [
		{
			title:
				'신규 어드민 화면은 Next.js로 옮기고 있었지만, 초기 운영 필요에 맞춰 빠르게 만들어진 기존 Vue 어드민 화면을 한 번에 걷어낼 수 없어 Next의 레거시 라우트에서 iframe으로 함께 운영했습니다. 레거시 화면은 화면별 세션 처리와 오류 대응이 일관되지 않았고, 데이터팀에서 운영 중 이유 없이 401이 반복되어 작업이 끊긴다는 문제를 제보했습니다. 동시에 ISMS-P 결함 조치에 맞춰 개인정보 조회 기준도 정리해야 했습니다.',
		},
		{
			title:
				'Next 인증 클라이언트에서 401 응답을 받으면 진행 중인 refresh Promise를 재사용해 동시에 실패한 요청들이 같은 갱신 결과를 기다리게 했습니다. 다른 화면에서 이미 쿠키 토큰을 갱신한 경우에는 refresh 없이 새 토큰으로 실패 요청을 다시 보내도록 했고, legacy Vue 요청 인터셉터도 같은 방식으로 동시 401을 단일 refresh 결과에 묶었습니다. refresh 성공 시 access token을 legacy Vue가 읽는 3개 쿠키 조각과 refresh token 쿠키로 갱신해 Vue iframe과 Next 화면이 같은 세션을 보도록 맞췄고, logout·refresh 요청은 재시도 대상에서 제외했습니다.',
		},
		{
			title:
				'운영자가 Vue 레거시 화면과 Next 신규 화면을 오가도 같은 관리자 세션을 이어갈 수 있게 했고, 중복 refresh와 무한 재시도 가능성을 줄였습니다. 개인정보 화면은 자동 조회를 검색 후 조회 방식으로 바꾸고 복호화 조회를 별도 액션으로 분리해, 필요한 경우에만 개인정보에 접근하도록 운영 기준을 강화했습니다.',
		},
	],
	'Wello-biz 상세검색 키워드 입력 UX 개선': [
		{
			title:
				'Wello-biz의 지원사업·조달사업 상세검색은 사용자가 키워드를 OR·AND·NOT 조건으로 여러 개 추가해 검색 범위를 넓히거나 좁히는 구조였습니다. 같은 입력 UX가 지원사업 AI 검색, 지원사업 상세검색, 조달사업 상세검색, 조달 입찰 검색의 11개 키워드 입력 지점에서 반복되었고, 한글 IME 조합 중 Enter를 누르면 검색어가 자음·모음으로 분리되는 문제가 있었습니다.',
		},
		{
			title:
				'검색어를 태그처럼 추가·삭제할 수 있는 자동 리사이징 textarea 입력 컴포넌트를 만들고, Enter 처리 시 nativeEvent.isComposing을 확인해 IME 조합 중에는 검색어 추가를 막았습니다. 검색어 추가·삭제·전체 초기화·포커스 제어·최대 개수 제한을 컴포넌트 내부로 모으고, 각 검색 폼의 zod schema와 연결해 키워드 조건을 검증했습니다.',
		},
		{
			title:
				'한글 검색어 입력 중 자음·모음이 분리되던 문제를 해결하고, OR·AND·NOT 키워드 조건을 11개 입력 지점에서 같은 추가·삭제·초기화 동작과 검증 기준으로 다룰 수 있게 했습니다.',
		},
	],
	'Wello 구형 query factory 제거 및 API 호출 래퍼 정리': [
		{
			title:
				'Wello 서버 API가 v2 기준으로 정리되는 과정에서, v1 시절에 화면별로 만들던 query factory 호출부가 여러 화면에 남아 있었습니다. API 호출 규칙이 화면마다 달라지면 실제 endpoint, query key, 요청·응답 타입을 함께 추적하기 어려웠고, 검색·검증처럼 POST로 조회하는 API는 TanStack Query 옵션이 자동 생성되지 않아 별도 처리 기준이 필요했습니다.',
		},
		{
			title:
				'Wello의 api/index.ts에서 generated pathMapping을 기준으로 SDK 함수와 React Query 함수를 실제 주소 문자열에 다시 매핑했습니다. AuthApi·UnauthApi, AuthQueryOptions·UnauthQueryOptions, QueryKey, InfiniteQueryOptions, Mutation을 모두 get:/wello/v2/... 같은 endpoint 문자열로 접근하게 만들고, POST 조회성 API는 createQueryOptionsWithPost로 감싸 queryKey와 queryFn을 같은 규칙으로 생성했습니다.',
		},
		{
			title:
				'90개 이상의 기존 호출부를 주소 기반 래퍼로 옮겨, 화면에서 호출하는 API 주소를 코드만 보고 확인할 수 있게 했습니다. 현재 query-factory 폴더에는 OpenAPI 생성 API로 대체하기 어려운 소셜 로그인 OAuth 처리와 제주청년꿈 외부 API성 호출만 남기고, Wello v2 API 호출은 주소 기반 래퍼로 추적하도록 정리했습니다.',
		},
	],
	'AI 챗봇 플랫폼 & CMS': [
		{
			title:
				'고객사가 보유한 콘텐츠를 기반으로 사용자를 응대하는 AI 챗봇 서비스가 필요했습니다. 동시에 운영자가 프롬프트, 모델, 응답 스타일, 지식 베이스, 사용량 통계를 개발팀 도움 없이 관리할 수 있는 CMS도 함께 필요했습니다.',
		},
		{
			title:
				'OpenAI Assistant API의 Threads·Messages·Runs 흐름을 SSE로 연결해 답변 생성 과정을 실시간으로 보여주고, 역방향 무한 스크롤로 채팅 히스토리 조회 UX를 개선했습니다. CMS에서는 파일 등록, 벡터 스토어 관리, AI 콘텐츠 자동 생성, 통계 대시보드, 프롬프트·모델 설정 화면을 구현했습니다.',
		},
		{
			title:
				'CSR 기반 React 서비스를 Next.js 15 App Router SSR 구조로 전환하고, 고객사별 동적 메타데이터·다국어 OpenGraph·API 기반 사이트맵을 적용해 검색 노출 관리 흐름을 자동화했습니다. 고객사는 챗봇 응대와 CMS 운영을 직접 관리할 수 있게 되었고, 무료 고객사에는 응답 횟수 기반 광고 삽입으로 수익화 장치를 붙였습니다.',
		},
	],
	'AI 대화형 설문 생성 MVP': [
		{
			title:
				'OpenAI API를 활용한 신규 서비스 가능성을 빠르게 검증해야 했습니다. 단순 데모가 아니라 사용자가 대화로 설문 목적을 입력하면 AI가 문항을 순차 생성하고, 팀이 실제 화면에서 스트리밍 UX를 확인할 수 있는 MVP가 필요했습니다.',
		},
		{
			title:
				'Nest.js API 통신과 SSE 스트리밍을 연결하고, 프론트엔드에서는 AssistantStream의 텍스트 델타 이벤트를 받아 UI에 실시간 반영했습니다. 스트리밍 상태에 따라 자동 스크롤과 입력 가능 상태를 제어하고, 생성된 설문 문항이 순차적으로 누적되는 흐름을 구현했습니다.',
		},
		{
			title:
				'AI 설문 생성 MVP를 배포 가능한 환경까지 완성해 팀이 실제 화면에서 아이디어와 사용성을 검증할 수 있게 했습니다. 이 과정에서 SSE 처리, 스트리밍 UI, AI 응답 상태 관리, 자동 스크롤 패턴을 먼저 검증했고, 이후 AI Talker의 실시간 채팅 UI 구현 기반으로 활용했습니다.',
		},
	],
	'서비스 웹 + 관리자 CMS 프론트엔드 단독 개발': [
		{
			title:
				'Swing은 스타트업 업무 지원 기능과 Unity 기반 WebGL 가상 오피스를 함께 제공하는 서비스였습니다. 저는 백엔드 개발자 1명과 2인 팀에서 서비스 웹·관리자 CMS와 WebGL 가상공간으로 이어지는 진입·연결 흐름의 프론트엔드를 맡았습니다.',
		},
		{
			title:
				'서비스 웹은 Webpack v5, 관리자 CMS는 Vite로 분리해 인증, 대시보드, 사업지원 관리, WebGL 가상공간 진입 화면과 연결 로직을 구현했습니다. 서비스 웹·CMS의 초기 로딩 부담은 Lazy Loading, 코드 스플리팅, bundle-analyzer 기반 의존성 정리로 줄였습니다.',
		},
		{
			title:
				'프론트엔드 영역을 단독으로 설계·개발해 웹 서비스와 CMS 운영 흐름을 출시 가능한 상태로 만들었습니다. 프로젝트 성격에 따라 빌드 환경을 분리하고 번들 구조를 관리한 경험은 이후 보일러플레이트와 CMS UI Kit 구축으로 이어졌습니다.',
		},
	],
	'아바타 스튜디오 성능 개선 및 CMS 개발': [
		{
			title:
				'외주 업체에서 인수받은 WebGL 아바타 서비스는 3D 렌더링과 대용량 정적 자산 때문에 3초 이상 빈 화면이 노출되고, 800~1000줄 규모의 거대 컴포넌트가 유지보수를 어렵게 만들고 있었습니다.',
		},
		{
			title:
				'Suspense와 lazy loading으로 전체 UI가 블로킹되던 구조를 분리하고, 3D·JSON 정적 자산을 AWS S3와 CDN으로 이전했습니다. 거대 컴포넌트는 공통 컴포넌트와 커스텀 훅으로 나눠 신규 기능을 레거시와 분리된 구조로 붙였습니다.',
		},
		{
			title:
				'3초 이상 노출되던 빈 화면을 400~600ms 수준으로 줄이고, 기존 시스템 분석 범위를 줄여 개발 일정을 단축했습니다. 이 구조를 바탕으로 300명 규모 대학 OT와 오디션 시스템을 안정적으로 출시했습니다.',
		},
	],
	'CMS 전용 UI Kit & 보일러플레이트': [
		{
			title:
				'프로젝트마다 React 초기 세팅과 CMS UI 커스터마이징을 반복하면서, 화면 개발보다 환경 구성과 공통 컴포넌트 조정에 시간이 많이 쓰이고 있었습니다.',
		},
		{
			title:
				'서비스 웹용 Webpack v5 보일러플레이트와 CMS용 Vite 보일러플레이트를 분리하고, Rollup.js 기반 CMS UI 라이브러리를 CJS/ESM 환경에서 사용할 수 있게 구성했습니다. Storybook과 Chromatic을 붙여 컴포넌트 단위 개발과 시각적 회귀 확인 흐름도 만들었습니다.',
		},
		{
			title:
				'Yarn Berry 모노레포와 Lerna 버전 관리 구조로 UI 라이브러리, 설정, 유틸 공통 패키지를 함께 관리했습니다. 이후 CMS 프로젝트에서 반복 세팅을 줄이고 공통 UI를 같은 기준으로 재사용할 수 있는 기반을 마련했습니다.',
		},
	],
};

export const CAREER_DETAILS: CareerDetailCareer[] = CAREERS.map(career => ({
	organization: career.organization,
	position: career.position,
	startDate: career.startDate,
	endDate: career.endDate,
	period: career.period,
	serviceGroups: career.serviceGroups.map(group => ({
		service: group.service,
		serviceUrl: group.serviceUrl,
		serviceDescription: group.serviceDescription,
		printBreakBefore: group.printBreakBefore,
		projects: group.projects.map(project => ({
			title: project.title,
			date: project.date,
			details: CAREER_DETAIL_OVERRIDES[project.title] ?? project.achievements,
		})),
	})),
}));

const EDUCATION: Education[] = [
	{ title: '한국방송통신대학교 — 컴퓨터과학과', period: '2026.03 ~ 재학 중' },
	{
		title: '멋쟁이사자처럼 — 프론트엔드 스쿨 3기',
		period: '2022.08 ~ 2023.01 수료',
	},
	{
		title: '방송정보국제교육원 — UI/UX 기반 웹퍼블리싱&프론트엔드 양성과정',
		period: '2021.10 ~ 2022.03 수료',
	},
];

const ACTIVITIES: Activity[] = [
	{
		title: '오픈소스 컨트리뷰션 아카데미',
		organization: '과학기술정보통신부',
		period: '2023.07 ~ 2024.01',
		items: [
			'과학기술정보통신부 장관상 대상 수상',
			'CNCF 졸업 프로젝트 Argo Workflows 컨트리뷰터 멘티 활동 (GitHub 13.6k+ Stars)',
			{
				text: '드롭다운 컴포넌트의 클래스 → 함수형 전환, 워크플로우 목록 toolbar UI 개선, Cron Workflow 실행 이력 노출 등 3개 PR 머지',
				links: [
					{
						title: '#11901',
						url: 'https://github.com/argoproj/argo-workflows/pull/11901',
					},
					{
						title: '#11444',
						url: 'https://github.com/argoproj/argo-workflows/pull/11444',
					},
					{
						title: '#11811',
						url: 'https://github.com/argoproj/argo-workflows/pull/11811',
					},
				],
			},
		],
	},
	{
		title: '항해플러스 프론트엔드 6기',
		organization: '',
		period: '2025.07 ~ 2025.09',
		items: [
			'TDD 기반 단위·통합 테스트(Vitest + RTL)와 성능 프로파일링을 반복하며 기능 검증과 렌더링 최적화 훈련',
			'바닐라 JS → React → TypeScript로 같은 문제를 점진적으로 전환하며 프레임워크 동작 원리와 타입 설계 학습',
			'클린 코드 리팩토링, SRP 기반 컴포넌트 설계, FSD 아키텍처 적용',
		],
	},
];

const RESUME: Resume = {
	careers: CAREERS,
	education: EDUCATION,
	activities: ACTIVITIES,
};

export default RESUME;
