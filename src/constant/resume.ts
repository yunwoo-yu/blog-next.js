import type { ResumeItemProps } from '@/components/resume/ResumeItem';
import type { ResumeLinkProps } from '@/components/resume/ResumeLink';

export type Project = {
	title: string;
	date?: string;
	achievements: ResumeItemProps[];
};

export type ServiceGroup = {
	service: string;
	serviceUrl?: string;
	serviceDescription?: string;
	projects: Project[];
	printBreakBefore?: boolean;
};

export type Careers = {
	organization: string;
	position: string;
	startDate?: string;
	endDate?: string;
	exitReason?: string;
	period?: string;
	description: string;
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

const toCareerDate = (date: string) => {
	const [year, month, day = '01'] = date.split('.');
	return new Date(Number(year), Number(month) - 1, Number(day));
};

export function getCareerPeriod(career: CareerPeriodTarget) {
	if (career.period) return { text: career.period, duration: '', isOngoing: false };
	if (!career.startDate) return { text: '', duration: '', isOngoing: false };

	const start = toCareerDate(career.startDate);
	const end = career.endDate ? toCareerDate(career.endDate) : new Date();
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
		organization: '웰로',
		position: '프론트엔드 개발자 | 제품실 개발팀',
		startDate: '2025.11',
		endDate: '2026.06',
		exitReason: '경영악화로 인한 권고사직',
		description:
			'누적 이용자 500만 규모의 Wello와 B2B SaaS Wello-biz에서 pnpm·Turborepo 기반 모노레포 환경으로 사용자 서비스, 커머스, 마이데이터, 통합 어드민 프론트엔드 개발을 담당했습니다.',
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
						title: '웰마켙 PG 결제·주문 단계별 처리 플로우 구축',
						date: '2026.02 ~ 2026.05',
						achievements: [
							{
								title:
									'주문서에 반영되는 상품 금액, 배송비, 쿠폰, 웰포인트, 결제수단을 하나의 체크아웃 상태로 관리하고 최종 결제 금액을 계산했습니다.',
							},
							{
								title:
									'주문서에 표시되는 금액과 PG 결제 요청 금액이 어긋나지 않도록 계산 기준과 예외 상태를 검증하고, NICE Payments 승인·return URL 처리까지 연결해 오픈 이후 결제 금액 불일치 이슈 0건으로 운영했습니다.',
							},
							{
								title:
									'구매 이후 주문 단계에 따라 주문내역, 배송조회, 영수증, 후기 작성과 운영 어드민의 배송·반품·환불 처리를 연결했습니다.',
							},
						],
					},
					{
						title: 'Wello 반응형 전환 · 통합검색 구축',
						date: '2026.04',
						achievements: [
							{
								title:
									'모바일 고정폭(600px)으로 설계된 다수 페이지를 데스크탑까지 대응하는 반응형으로 전환하고, 필터 UI를 PC 사이드바·모바일 바텀 드로어로 분리해 여러 카테고리가 공통으로 재사용하도록 했습니다.',
							},
							{
								title:
									'흩어진 콘텐츠를 한 곳에서 찾도록 통합검색을 신규 구축하고, 검색어·필터·페이지를 모두 URL에 직렬화해 공유·새로고침·뒤로가기에도 검색 상태가 유지되도록 했습니다.',
							},
							{
								title:
									'카테고리마다 다른 필터 파라미터를 문자열·숫자·enum 등 타입에 맞게 파싱하고 잘못된 값은 기본값으로 보정했으며, 핵심 직렬화·파싱 로직은 단위 테스트로 검증했습니다.',
							},
						],
					},
					{
						title: '중복 기부 방지 및 반복 CS 문의 감소',
						date: '2025.12 ~ 2026.01',
						achievements: [
							{
								title:
									'답례품 없는 기부와 장바구니 기부 양쪽에서 결제 전 입력값과 기부 가능 여부를 검증하고, 최신 기부 완료 이력을 다시 조회해 중복 기부 가능성을 차단했습니다.',
							},
							{
								title:
									'이미 기부한 내역이 있으면 결제 직전 확인 모달을 노출하고, 외부 지로 납부 화면 이동·복귀 후에도 Wello에서 진행 상태를 다시 확인할 수 있도록 처리했습니다.',
							},
							{
								title:
									'중복 기부 여부 확인 문의가 반복되던 지점을 결제 전 확인 단계로 옮겨, 배포 후 관련 CS 문의를 줄였습니다.',
							},
						],
					},
					{
						title: '마이데이터 연동 및 연결 관리 구축',
						date: '2025.11 ~ 2025.12',
						achievements: [
							{
								title:
									'기관마다 인증·동의·전송요구·전자서명 단계와 API 처리 방식이 달라, 어댑터 패턴으로 기관별 단계 구성과 요청·응답 처리를 분리하고 화면 전환·진행 상태 저장·실패 처리는 공통화했습니다.',
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
				],
			},
			{
				service: 'Wello-biz',
				serviceUrl: 'https://www.wellobiz.com/',
				serviceDescription: 'B2B SaaS 비즈니스 플랫폼',
				projects: [
					{
						title: 'Wello-biz 상세검색 키워드 입력 UX 개선',
						date: '2025.11 ~ 2025.12',
						achievements: [
							{
								title:
									'검색어를 태그처럼 추가·삭제할 수 있는 자동 리사이징 textarea 입력 컴포넌트를 만들고, IME 조합 단계의 Enter 입력을 일반 입력 확정과 분리해 한글 검색어가 완성 전 상태로 추가되는 문제를 해결했습니다.',
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
				service: 'Wello·Wello-biz Admin',
				serviceDescription: '통합 운영 어드민',
				projects: [
					{
						title: '어드민 인증·개인정보 보호 개선',
						date: '2026.01',
						achievements: [
							{
								title:
									'Next와 Vue 양쪽 API 클라이언트의 401 응답 처리를 통일하고, 진행 중인 refresh Promise를 공유해 중복 refresh 요청을 막았습니다.',
							},
							{
								title:
									'refresh 성공 시 access token 조각 쿠키와 refresh token 쿠키를 함께 갱신해 Vue iframe과 Next 화면이 같은 관리자 세션을 보도록 변경했습니다.',
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
		organization: '살린',
		position: '프론트엔드 개발자 | ILab',
		startDate: '2023.08',
		endDate: '2025.08',
		exitReason: '경영악화로 인한 권고사직',
		description:
			'AI 챗봇 플랫폼, WebGL 아바타 서비스, 스타트업 업무 지원 서비스의 사용자 화면과 관리자 CMS 프론트엔드 개발을 담당했습니다.',
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
						achievements: [
							{
								title:
									'Threads·Messages·Runs를 SSE로 연결하고 역방향 무한 스크롤을 구현해, 실시간 답변 생성과 채팅 히스토리 조회 UX를 개선했습니다.',
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
									'CSR 기반 React 서비스를 Next.js 15 App Router SSR 구조로 전환하고, 고객사별 동적 메타데이터·다국어 OpenGraph·API 기반 사이트맵을 적용해 검색 노출 관리를 자동화했습니다.',
							},
							{
								title:
									'무료 플랜에는 응답 횟수 기반 광고 삽입 로직을 적용해 서비스 내 수익화 실험이 가능하도록 했습니다.',
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
						date: '2024.01 ~ 2024.07',
						achievements: [
							{
								title:
									'서비스 웹(Webpack v5)과 관리자 CMS(Vite)를 목적에 맞게 분리해 인증, 대시보드, 사업지원 관리, WebGL 가상공간 진입 화면까지 설계·개발했습니다.',
							},
							{
								title:
									'WebGL 가상공간 진입에 필요한 웹 화면과 연결 로직을 서비스 구조에 통합하고, 서비스 웹·CMS의 초기 로딩 부담은 Lazy Loading, 코드 스플리팅, bundle-analyzer 기반 의존성 정리로 줄였습니다.',
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
			{
				service: 'Localo',
				serviceDescription: 'WebGL 아바타 서비스',
				projects: [
					{
						title: '아바타 스튜디오 성능 개선',
						date: '2023.10 ~ 2023.12',
						achievements: [
							{
								title:
									'3초 이상 지연되던 첫 화면 표시를 400~600ms 수준으로 단축했습니다. Suspense + lazy로 렌더링 블로킹 구간을 분리하고, 3D·JSON 정적 자산을 AWS S3 + CDN으로 이전해 초기 로딩 병목을 해소했습니다.',
							},
							{
								title:
									'800~1000줄 규모의 거대 컴포넌트를 공통 컴포넌트와 커스텀 훅으로 분리해 레거시에 큰 영향 없이 기능 수정이 가능한 구조를 만들었습니다.',
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
				'정책 추천 고도화를 위해 의료·통신·신용 마이데이터 연동이 필요했습니다. 단순 API 연동이 아니라 기관별 본인인증, 동의, 전송요구, 전자서명, 재동의, 철회, 전송 이력 확인까지 심사 기준에 맞춰 검증되어야 하는 규제성 플로우였습니다.',
		},
		{
			title:
				'기관마다 단계 구성과 API 처리 방식이 달라 어댑터 패턴을 적용했습니다. 기관별로 필요한 단계, 요청 생성, 응답 정규화, 에러 매핑을 어댑터로 분리하고, 공통 로직은 단계 실행, 진행 상태 저장, 화면 전환, 실패 처리만 담당하게 했습니다. 스텝 식별자는 URL 쿼리스트링에, 인증 중간값은 세션스토리지에 분리해 저장했습니다. 새로고침 시에는 진행 상태를 복원하고, 탭 종료 시에는 인증 중간값이 남지 않도록 관리했습니다.',
		},
		{
			title:
				'기관별 보완 요청이 들어와도 화면을 새로 만들지 않고 어댑터 단위 수정으로 대응할 수 있는 구조를 확보했습니다. 새 기관이 추가되더라도 기관별 어댑터를 중심으로 대응하고, 기존 화면과 공통 플로우 변경 범위를 줄일 수 있게 됐습니다.',
		},
	],
	'웰마켙 PG 결제·주문 단계별 처리 플로우 구축': [
		{
			title:
				'고향사랑기부 답례품 기반 지역 상품을 웰마켙에서 판매하면서, 주문서에 표시되는 금액과 실제 PG 결제 요청 금액이 같은 기준으로 계산되어야 했습니다. 상품 금액, 배송비, 쿠폰, 웰포인트가 함께 반영되는 구조라 결제 전 금액 계산과 예외 상태를 화면에서 먼저 검증해야 했습니다.',
		},
		{
			title:
				'상품 금액·배송비·쿠폰·웰포인트·결제수단을 단일 체크아웃 상태로 관리하고, 최종 결제금액은 체크아웃 API 반환값을 NicePay SDK에 그대로 전달해 계산 경로 불일치 가능성을 없앴습니다. 결제 요청 전 배송지·결제수단·약관을 순서대로 검증하고, 결제 흐름 전반에서 각 케이스에 맞는 예외처리를 했습니다. 구매 후에는 취소·반품·환불 흐름을 주문 단계에 따라 어드민과 연결했습니다.',
		},
		{
			title:
				'주문서부터 결제 승인·배송·반품·환불·어드민 연결까지 커머스 주문 플로우 전체를 설계·구현해 오픈했습니다. 5월까지 결제 금액 관련 이슈 0건으로 안정적으로 운영했고, 사용자·운영팀·입점업체가 같은 주문 상태 기준으로 배송 처리, 반품·환불, 고객 응대를 이어갈 수 있는 기반을 만들었습니다.',
		},
	],
	'Wello 반응형 전환 · 통합검색 구축': [
		{
			title:
				'기존 Wello는 PC에서도 600px 고정폭 모바일 화면을 그대로 노출했습니다. 앱 중심 서비스임에도 PC 웹 유입이 적지 않았지만 넓은 화면을 살리지 못했고, 고향사랑기부·커머스 등 서비스가 늘면서 정책·답례품·동네소식·기부사업 등 콘텐츠가 영역별로 흩어져 사용자가 원하는 정보를 한 번에 찾기도 어려웠습니다.',
		},
		{
			title:
				'흩어진 콘텐츠를 한 곳에서 찾도록 통합검색을 신규 구축하고, 검색 상태를 URL에 직렬화해 공유·새로고침·뒤로가기에도 유지되도록 했습니다. 카테고리별 필터를 타입에 맞게 파싱하고, 필터 UI는 PC 사이드바·모바일 드로어로 분리해 여러 카테고리가 공통으로 쓰도록 했습니다. 핵심 직렬화·파싱 로직은 단위 테스트로 검증했습니다.',
		},
		{
			title:
				'모바일 전용이던 화면들을 PC까지 확장하고, 흩어진 콘텐츠를 딥링크 가능한 통합검색으로 묶었습니다. 개편 이후 GA4 기준 desktop 평균 참여 시간이 약 20% 증가했습니다.',
		},
	],
	'중복 기부 방지 및 반복 CS 문의 감소': [
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
				'외부 지로 납부 화면을 거쳐도 Wello에서 결제 진행 상태를 다시 확인할 수 있게 하면서, 중복 기부 여부를 묻는 반복 CS 문의를 줄였습니다. 납부 화면 이동과 복귀 처리는 실행 환경별로 분기해 앱·웹뷰에서도 같은 기준으로 완료 여부를 확인하도록 했습니다.',
		},
	],
	'어드민 인증·개인정보 보호 개선': [
		{
			title:
				'Next.js 신규 어드민과 Vue 레거시 어드민을 iframe 기반 멀티 프레임워크 구조로 병행 운영했습니다. 양쪽 어드민은 같은 관리자 세션을 공유해야 했지만, API 클라이언트와 토큰 만료 대응이 달라 401 오류가 반복되고 운영 작업이 끊기는 문제가 있었습니다. 또한 ISMS-P 결함 조치에 맞춰 개인정보 조회 기준도 함께 정비해야 했습니다.',
		},
		{
			title:
				'Next와 Vue의 API 클라이언트에 공통 401 처리 기준을 적용했습니다. refresh 진행 상태와 Promise를 파일 최상위 변수로 관리해, 여러 요청이 동시에 401로 실패해도 첫 요청만 refresh token API를 호출하고 나머지는 같은 Promise를 await하도록 했습니다. 실패 요청 헤더의 토큰과 현재 쿠키 토큰이 다르면 refresh 없이 최신 쿠키 토큰으로 재시도하도록 했습니다.',
		},
		{
			title:
				'이를 통해 운영자가 Vue와 Next 화면을 오가도 동일한 세션을 유지할 수 있게 했고, 반복 401과 중복 refresh로 인한 작업 중단을 줄였습니다. 개인정보 화면은 자동 조회를 검색 후 조회 방식으로 바꾸고 복호화 조회를 별도 액션으로 분리해, 필요한 경우에만 개인정보에 접근하도록 개선했습니다.',
		},
	],
	'Wello-biz 상세검색 키워드 입력 UX 개선': [
		{
			title:
				'Wello-biz의 지원사업·조달사업 상세검색은 사용자가 키워드를 OR·AND·NOT 조건으로 여러 개 추가해 검색 범위를 넓히거나 좁히는 구조였습니다. 같은 입력 UX가 지원사업 AI 검색, 지원사업 상세검색, 조달사업 상세검색, 조달 입찰 검색의 11개 지점에서 반복되었고, 한글 IME 조합 중 Enter를 누르면 완성되지 않은 문자열이 검색 조건으로 추가되는 문제가 있었습니다.',
		},
		{
			title:
				'검색어를 태그처럼 추가·삭제할 수 있는 자동 리사이징 textarea 입력 컴포넌트를 만들고, 키 입력 처리에서 IME composition 상태를 기준으로 조합 중 Enter 이벤트와 일반 입력 확정을 분리했습니다. 검색어 추가·삭제·전체 초기화·포커스 제어·최대 개수 제한을 컴포넌트 내부로 모으고, 각 검색 폼의 zod schema와 연결해 키워드 조건을 검증했습니다.',
		},
		{
			title:
				'한글 검색어 입력 중 자음·모음이 분리되던 문제를 해결하고, OR·AND·NOT 키워드 조건을 11개 입력 지점에서 같은 추가·삭제·초기화 동작과 검증 기준으로 다룰 수 있게 했습니다.',
		},
	],
	'AI 챗봇 플랫폼 & CMS': [
		{
			title:
				'고객사가 보유한 콘텐츠를 기반으로 사용자를 응대하는 AI 챗봇 서비스가 필요했습니다. 동시에 운영자가 프롬프트, 모델, 응답 스타일, 지식 베이스, 사용량 통계를 개발팀 도움 없이 관리할 수 있는 CMS도 함께 필요했습니다.',
		},
		{
			title:
				'OpenAI Assistant API의 Threads·Messages·Runs 흐름을 서버 SSE 응답으로 전달해 답변 생성 과정을 실시간으로 보여주고, 역방향 무한 스크롤로 채팅 히스토리 조회 UX를 개선했습니다. CMS에서는 파일 등록, 벡터 스토어 관리, AI 콘텐츠 자동 생성, 통계 대시보드, 프롬프트·모델 설정 화면을 구현했습니다.',
		},
		{
			title:
				'CSR 기반 React 서비스를 Next.js 15 App Router SSR 구조로 전환하고, 고객사별 동적 메타데이터·다국어 OpenGraph·API 기반 사이트맵을 적용해 검색 노출 관리를 자동화했습니다. 고객사는 챗봇 응대와 CMS 운영을 직접 관리할 수 있게 되었고, 무료 플랜에는 응답 횟수 기반 광고 삽입 로직을 적용해 서비스 내 수익화 실험이 가능하도록 했습니다.',
		},
	],
	'AI 대화형 설문 생성 MVP': [
		{
			title:
				'OpenAI API를 활용한 신규 서비스 가능성을 빠르게 검증해야 했습니다. 사용자가 대화로 설문 목적을 입력하면 AI가 문항을 순차 생성하고, 팀이 실제 화면에서 스트리밍 UX를 확인할 수 있는 MVP가 필요했습니다.',
		},
		{
			title:
				'Nest.js API를 통해 OpenAI 응답 스트림을 SSE로 전달하고, 프론트엔드에서 텍스트 델타를 받아 설문 문항 UI에 실시간 반영했습니다.',
		},
		{
			title:
				'AI 설문 생성 MVP를 배포 가능한 환경까지 완성하고, SSE 처리, 스트리밍 UI, AI 응답 상태 관리, 자동 스크롤 패턴을 이후 AI Talker 채팅 UI의 구현 기반으로 재사용했습니다.',
		},
	],
	'서비스 웹 + 관리자 CMS 프론트엔드 단독 개발': [
		{
			title:
				'Swing은 스타트업 업무 지원 기능과 Unity 기반 WebGL 가상 오피스를 함께 제공하는 서비스였습니다. 백엔드 개발자 1명과 2인 팀으로 서비스 웹·관리자 CMS와 WebGL 가상공간 진입·연결 프론트엔드를 담당했습니다.',
		},
		{
			title:
				'서비스 웹은 Webpack v5, 관리자 CMS는 Vite로 분리해 인증, 대시보드, 사업지원 관리, WebGL 가상공간 진입 화면과 연결 로직을 구현했습니다. 서비스 웹·CMS의 초기 로딩 부담은 Lazy Loading, 코드 스플리팅, bundle-analyzer 기반 의존성 정리로 줄였습니다.',
		},
		{
			title:
				'프론트엔드 영역을 단독으로 설계·개발해 웹 서비스와 CMS 운영 기능을 실제 운영 가능한 상태로 완성했습니다. 프로젝트 성격에 따라 빌드 환경을 분리하고 번들 구조를 관리한 경험은 이후 보일러플레이트와 CMS UI Kit 구축으로 이어졌습니다.',
		},
	],
	'아바타 스튜디오 성능 개선': [
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
				'3초 이상 지연되던 첫 화면 표시를 400~600ms 수준으로 단축하고, 거대 컴포넌트를 공통 컴포넌트와 커스텀 훅으로 분리해 레거시에 큰 영향 없이 기능을 수정할 수 있는 구조를 만들었습니다.',
		},
	],
	'CMS 전용 UI Kit & 보일러플레이트': [
		{
			title:
				'프로젝트마다 React 초기 세팅과 CMS UI 커스터마이징을 반복하면서, 화면 개발보다 환경 구성과 공통 컴포넌트 조정에 시간이 많이 쓰이고 있었습니다.',
		},
		{
			title:
				'서비스 웹용 Webpack v5 보일러플레이트와 CMS용 Vite 보일러플레이트를 분리하고, Rollup.js 기반 CMS UI 라이브러리를 CJS/ESM 빌드 산출물로 배포할 수 있게 구성했습니다. Storybook과 Chromatic을 붙여 컴포넌트 단위 개발과 시각적 회귀 확인 체계도 만들었습니다.',
		},
		{
			title:
				'Yarn Berry 모노레포와 Lerna 버전 관리 구조로 UI 라이브러리, 설정, 유틸 공통 패키지를 함께 관리했습니다. 이후 CMS 프로젝트에서 초기 세팅 시간을 줄이고, 버튼·폼·테이블·레이아웃 등 반복 UI를 일관된 기준으로 재사용할 수 있는 기반을 마련했습니다.',
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

const EDUCATION: Education[] = [];

const ACTIVITIES: Activity[] = [
	{
		title: '항해플러스 프론트엔드 6기',
		organization: '',
		period: '2025.07 ~ 2025.09',
		items: [
			'TDD 기반 단위·통합 테스트(Vitest + RTL)와 성능 프로파일링을 반복하며 기능 검증과 렌더링 최적화 흐름을 훈련했습니다.',
			'바닐라 JS → React → TypeScript 전환, 클린 코드 리팩토링, SRP/FSD 설계를 적용하며 유지보수 가능한 구조를 연습했습니다.',
		],
	},
	{
		title: '오픈소스 컨트리뷰션 아카데미',
		organization: '과학기술정보통신부',
		period: '2023.07 ~ 2024.01',
		items: [
			'CNCF 졸업 프로젝트 Argo Workflows 컨트리뷰터 멘티로 참여해 이슈를 분석하고 개선했습니다.',
			{
				text: '드롭다운 컴포넌트 함수형 전환, 워크플로우 목록 toolbar UI 개선, Cron Workflow 실행 이력 노출 등 3개 PR을 머지했습니다.',
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
			'멘티 활동 결과로 과학기술정보통신부 장관상 대상을 수상했습니다.',
		],
	},
	{
		title: '멋쟁이사자처럼 프론트엔드 스쿨 3기',
		organization: '멋쟁이사자처럼',
		period: '2022.08 ~ 2023.01',
		items: [
			'HTML/CSS, JavaScript, React 중심의 프론트엔드 기본기를 학습하고 프로젝트 단위 화면 구현 경험을 쌓았습니다.',
			'팀 프로젝트에서 팀장으로 역할 분담과 일정 조율을 맡고, 코드 리뷰와 회고를 반복하며 프로젝트 리드 경험을 쌓았습니다.',
		],
	},
	{
		title: 'UI/UX 기반 웹퍼블리싱&프론트엔드 양성과정',
		organization: '방송정보국제교육원',
		period: '2021.10 ~ 2022.03',
		items: [
			'화면 설계서와 디자인 시안을 작성하며 UI 구조를 정리하고, 이를 반응형 웹 화면으로 구현하는 흐름을 익혔습니다.',
			'HTML/CSS와 JavaScript로 정적 화면을 동작 가능한 웹 페이지로 구현하며 프론트엔드 기초를 만들었습니다.',
		],
	},
];

const RESUME: Resume = {
	careers: CAREERS,
	education: EDUCATION,
	activities: ACTIVITIES,
};

export default RESUME;
