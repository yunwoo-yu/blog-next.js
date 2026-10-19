import type { ResumeLinkProps } from '@/components/resume/ResumeLink';

export type Careers = {
	organization: string;
	position: string;
	startDate?: string;
	endDate?: string;
	exitReason?: string;
	period?: string;
	description: string;
	techStack: string[];
};

/** 이력서의 프로젝트 한 건. 1~2줄 요약만 싣고, 문제·판단·결과 상세는 포트폴리오(career-detail.ts)에 있다. */
export type ProjectItem = {
	/** 포트폴리오 상세 원문의 프로젝트 제목과 같아야 한다(테스트가 검사). */
	title: string;
	/** 같은 프로젝트의 포트폴리오 사례 slug. 이력서에서 상세로 연결한다(테스트가 존재와 제목 일치를 검사). */
	caseSlug: string;
	/** 'YYYY.MM ~ YYYY.MM' 또는 'YYYY.MM'. */
	date: string;
	/** 한 일(작업 내용). 결과 수치는 넣지 않는다. */
	summary: string;
	highlights: string[];
	links?: ResumeLinkProps[];
	/** 성과: 결과로 얻은 변화. value 는 한 단어 수준으로 압축하고, 기준·조건은 note 에 둔다. 개수·줄 수 같은 작업량은 이력서에 싣지 않는다(포트폴리오 상세에 둔다). */
	outcome?: ProjectOutcome;
};

export type ProjectOutcome = {
	value: string;
	note?: string;
};

/** 서비스(제품) 단위 프로젝트. 항목은 최신순. */
export type ServiceProject = {
	organization: string;
	service: string;
	serviceUrl?: string;
	serviceDescription?: string;
	/** 이 서비스에서 맡은 역할. 1~2줄. */
	role: string[];
	techStack: string[];
	items: ProjectItem[];
};

/** 'YYYY.MM ~ YYYY.MM' 또는 'YYYY.MM' 에서 [시작, 종료]를 뽑는다. 날짜가 없으면 빈 문자열. */
export const getProjectRange = (date?: string): [start: string, end: string] => {
	const [start = '', end = start] = (date ?? '').split(' ~ ');
	return [start, end];
};

/** 종료일 → 시작일 순으로 최신이 앞에 오는 비교 함수. 날짜가 없으면 맨 뒤. */
export const compareRecent = (a: [start: string, end: string], b: [start: string, end: string]) => {
	if (!a[1] !== !b[1]) return a[1] ? -1 : 1;
	return b[1].localeCompare(a[1]) || b[0].localeCompare(a[0]);
};

/** 서비스 프로젝트의 전체 기간. 항목 중 가장 이른 시작 ~ 가장 늦은 종료. */
export const getServicePeriod = (project: Pick<ServiceProject, 'items'>) => {
	const ranges = project.items.map(item => getProjectRange(item.date));
	const start = ranges.map(([from]) => from).sort()[0] ?? '';
	const end =
		ranges
			.map(([, to]) => to)
			.sort()
			.at(-1) ?? '';

	return start === end ? start : `${start} ~ ${end}`;
};

type CareerPeriodTarget = Pick<Careers, 'startDate' | 'endDate' | 'period'>;

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
	projects: ServiceProject[];
	education: Education[];
	activities: Activity[];
};

const CAREERS: Careers[] = [
	{
		organization: '웰로',
		position: '프론트엔드 개발자 | 제품실 개발팀',
		startDate: '2025.11',
		endDate: '2026.06',
		exitReason: '경영 악화로 인한 권고사직',
		description:
			'누적 이용자 500만 규모의 Wello와 B2B SaaS Wello-biz의 사용자 서비스, 커머스, 마이데이터, 통합 어드민 프론트엔드 개발을 pnpm·Turborepo 기반 모노레포 환경에서 담당했습니다.',
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
	},
	{
		organization: '살린',
		position: '프론트엔드 개발자 | ILab',
		startDate: '2023.08',
		endDate: '2025.08',
		exitReason: '경영 악화로 인한 권고사직',
		description:
			'AI 챗봇 플랫폼, WebGL 아바타 서비스, 스타트업 업무 지원 서비스의 사용자 화면과 관리자 CMS 프론트엔드 개발을 담당했습니다.',
		techStack: [
			'React',
			'TypeScript',
			'Next.js 15',
			'NestJS',
			'TanStack Query',
			'Emotion',
			'Zustand',
			'Webpack',
			'Vite',
		],
	},
];

/** 서비스는 최신 작업 순, 항목도 최신순. 순서는 resume.test.ts 가 지킨다. */
const PROJECTS: ServiceProject[] = [
	{
		organization: '웰로',
		service: 'Wello',
		serviceUrl: 'https://www.welfarehello.com/',
		serviceDescription: 'AI 기반 개인 맞춤형 정책 추천 플랫폼',
		role: [
			'웰마켙·통합검색·마이데이터·기부 흐름 프론트엔드 개발',
			'결제·외부 납부처럼 서버 상태가 기준인 사용자 흐름 설계',
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
		],
		items: [
			{
				title: '웰마켙 주문·결제 전 과정 구축',
				caseSlug: 'wellomarket-checkout',
				date: '2026.02 ~ 2026.05',
				summary:
					'NICEPAY PG 기반 주문·결제부터 취소·반품·환불까지 개발·배포·운영하며 결제 금액 기준을 서버로 고정했습니다.',
				highlights: ['NICEPAY PG 기반 주문·결제', '서버로 고정'],
				outcome: { value: 'CS·에러 0건', note: '오픈 후 1개월, 결제 금액 관련' },
			},
			{
				title: 'Wello PC 반응형 전환 및 통합검색 구축',
				caseSlug: 'wello-responsive-search',
				date: '2026.04',
				summary: 'PC 반응형 전환과 카테고리별 통합검색을 구축하고 검색 조건을 URL에 동기화했습니다.',
				highlights: ['카테고리별 통합검색', 'URL에 동기화'],
				outcome: { value: '참여시간 +20%', note: '데스크톱, 개편 전후 2주 GA4 단순 비교' },
			},
			{
				title: '외부 납부 환경의 중복 기부 재확인',
				caseSlug: 'donation-duplicate-guard',
				date: '2025.12 ~ 2026.01',
				summary:
					'외부 지로 화면에서 납부를 마치는 고향사랑기부에서 결제 직전 최신 완료 이력을 다시 조회해 중복 기부를 확인하게 했습니다.',
				highlights: ['결제 직전 최신 완료 이력을 다시 조회', '중복 기부를 확인'],
				outcome: { value: '재문의 −70%', note: '중복 기부 관련 CS' },
			},
			{
				title: '의료·통신·신용 마이데이터 연동 및 연결 관리 구축',
				caseSlug: 'mydata-integration',
				date: '2025.12 ~ 2026.01',
				summary:
					'KHIS·KOSCOM·NICE 마이데이터 연동 플로우와 연결 관리(재동의·철회·전송 이력)를 구축하고, 일괄 철회는 일부가 실패해도 실패한 항목만 안내하게 했습니다.',
				highlights: ['연결 관리', '실패한 항목만 안내'],
			},
		],
	},
	{
		organization: '웰로',
		service: 'Wello·Wello-biz Admin',
		serviceDescription: '통합 운영 어드민',
		role: ['Next.js·Vue 통합 운영 어드민의 인증·세션 개선'],
		techStack: ['Next.js', 'Vue'],
		items: [
			{
				title: 'Next.js·Vue 통합 어드민 토큰 자동 갱신',
				caseSlug: 'admin-session-refresh',
				date: '2026.03',
				summary:
					'401 응답 시 토큰을 갱신해 재요청하도록 Next.js·Vue 어드민에 구현하고 동시 갱신을 한 번으로 묶었으며, 쿠키를 접속 도메인별로 분리했습니다.',
				highlights: ['토큰을 갱신해 재요청', '접속 도메인별로 분리'],
				outcome: { value: '탭 로그아웃 해소', note: '웰로·웰로비즈 어드민, 이후 같은 요청 없음' },
			},
		],
	},
	{
		organization: '웰로',
		service: 'Wello-biz',
		serviceUrl: 'https://www.wellobiz.com/',
		serviceDescription: 'B2B SaaS 비즈니스 플랫폼',
		role: ['레거시 UI 스택 정리와 공통 디자인 시스템 전환'],
		techStack: ['Tailwind CSS', 'Zod', 'Embla Carousel', 'Pointer Events'],
		items: [
			{
				title: 'Wello-biz 레거시 UI 스택 정리 (Chakra UI·yup 제거)',
				caseSlug: 'wellobiz-chakra-zod',
				date: '2026.01',
				summary: 'Chakra UI·yup·Swiper 등 레거시 스택을 공통 디자인 시스템·Tailwind·Zod·Embla로 전환했습니다.',
				highlights: ['레거시 스택', 'Zod·Embla로 전환'],
				outcome: { value: '번들 감소', note: '의존성 5종 제거' },
			},
		],
	},
	{
		organization: '살린',
		service: 'AI Talker',
		serviceDescription: 'AI 챗봇 플랫폼',
		role: ['사용자 서비스와 운영 CMS 프론트엔드 개발', 'React CSR에서 Next.js 15 SSR로 전환'],
		techStack: ['React', 'Next.js 15', 'TypeScript', 'TanStack Query', 'Zustand', 'Emotion', 'OpenAI Assistants'],
		items: [
			{
				title: 'AI 챗봇 사용자 서비스·운영 CMS 구축',
				caseSlug: 'ai-chatbot-cms',
				date: '2025.01 ~ 2025.08',
				summary:
					'OpenAI Assistants 답변을 스트림으로 순차 반영하고 이전 대화 로딩 시 읽던 위치를 유지했으며, 프롬프트·지식 베이스·통계를 관리하는 운영 CMS를 구축했습니다.',
				highlights: ['스트림으로 순차 반영', '운영 CMS'],
				links: [{ title: '관련글', url: 'https://www.ycow-dev.com/blog/posts/next/reverse_infinite_scroll' }],
				outcome: { value: '고객사 직접 관리', note: '지식 파일·응답 설정' },
			},
			{
				title: 'React CSR 서비스의 Next.js 15 SSR 전환',
				caseSlug: 'ai-chatbot-ssr',
				date: '2025.01 ~ 2025.08',
				summary:
					'React CSR 챗봇을 Next.js 15 App Router로 전환해 고객사별 메타데이터·Open Graph·사이트맵을 서버에서 생성했습니다.',
				highlights: ['Next.js 15 App Router', '서버에서 생성'],
				outcome: { value: '배포 없이 고객사 추가', note: '검색 노출 정보 변경 포함' },
			},
		],
	},
	{
		organization: '살린',
		service: 'Swing',
		serviceDescription: 'WebGL 가상 오피스 기반 스타트업 업무 지원 플랫폼',
		role: ['프론트엔드 전 영역 단독 개발(백엔드 1명과 2인 팀)', '공통 보일러플레이트와 CMS UI 패키지 구축'],
		techStack: ['React', 'TypeScript', 'Webpack 5', 'Vite', 'Unity WebGL', 'AWS S3'],
		items: [
			{
				title: '서비스 웹 + 관리자 CMS 프론트엔드 단독 개발',
				caseSlug: 'swing-frontend',
				date: '2024.01 ~ 2024.07',
				summary:
					'백엔드 1명과 2인 팀에서 서비스 웹·관리자 CMS와 Unity WebGL 가상 오피스 진입(쿠키 인증 공유)까지 프론트엔드를 단독 개발했습니다.',
				highlights: ['프론트엔드를 단독 개발', '쿠키 인증 공유'],
			},
		],
	},
	{
		organization: '살린',
		service: 'Localo',
		serviceDescription: 'WebGL 아바타 서비스',
		role: ['인수한 WebGL 서비스의 초기 로딩 성능 개선', '3D 뷰와 편집 상태를 역할별 컴포넌트·훅으로 분리'],
		techStack: ['React', 'WebGL', 'Suspense', 'S3·CDN', 'Lighthouse'],
		items: [
			{
				title: '아바타 스튜디오 성능 개선',
				caseSlug: 'avatar-studio-performance',
				date: '2023.10 ~ 2023.12',
				summary:
					'인수한 WebGL 아바타 서비스의 진입점을 lazy loading·Suspense로 분리하고 3D 자산을 S3·CDN으로 옮겼습니다.',
				highlights: ['lazy loading·Suspense', 'S3·CDN으로 옮겼'],
				outcome: { value: 'FCP 0.4~0.6초', note: '기존 3초 이상, Lighthouse' },
			},
		],
	},
];

const EDUCATION: Education[] = [];

const ACTIVITIES: Activity[] = [
	{
		title: '항해플러스 프론트엔드 6기',
		organization: '',
		period: '2025.07 ~ 2025.09',
		items: [
			'바닐라 JS로 Virtual DOM(JSX 파싱·diff)과 React 훅·메모이제이션을 직접 구현하고, Express 기반 SSR/SSG를 구현하며 프레임워크 내부 동작을 학습했습니다.',
			'TDD 기반 단위·통합 테스트(Vitest + RTL + MSW)와 성능 프로파일링을 반복해 훈련했고, 최종 주차 성능 최적화 과제에서 BP(Best Practice)로 선정됐습니다.',
		],
	},
	{
		title: '오픈소스 컨트리뷰션 아카데미',
		organization: '과학기술정보통신부',
		period: '2023.07 ~ 2024.01',
		items: [
			{
				text: '드롭다운 컴포넌트 함수형 전환, 워크플로우 목록 툴바 UI 개선, Cron Workflow 실행 이력 노출 등 3개 PR을 머지했습니다.',
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
			'Dawn With Me 4인 팀을 이끌며 프로젝트 구조를 설계하고 게시판 CRUD·프로필·인증 라우팅을 구현했습니다. 별도 회고조의 조장을 맡아 매주 회고 모임을 운영했습니다.',
		],
	},
];

const RESUME: Resume = {
	careers: CAREERS,
	projects: PROJECTS,
	education: EDUCATION,
	activities: ACTIVITIES,
};

export default RESUME;
