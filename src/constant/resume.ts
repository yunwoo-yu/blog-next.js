import type { ResumeLinkProps } from '@/components/resume/ResumeLink';

export type Careers = {
	organization: string;
	position: string;
	startDate?: string;
	endDate?: string;
	period?: string;
	description: string;
	techStack: string[];
};

/** 이력서의 프로젝트 한 건. 한 줄~한 줄 반 요약만 싣고, 문제·판단·결과 상세는 포트폴리오(career-detail.ts)에 있다. */
export type ProjectItem = {
	/** 포트폴리오 상세 원문의 프로젝트 제목과 같아야 한다(테스트가 검사). */
	title: string;
	/** 같은 프로젝트의 포트폴리오 사례 slug. 이력서에서 상세로 연결한다(테스트가 존재와 제목 일치를 검사). */
	caseSlug: string;
	/** 'YYYY.MM ~ YYYY.MM' 또는 'YYYY.MM'. */
	date: string;
	/** 한 일과 그로 인한 결과를 이어 쓴 한 문장(예: ~전환해 ~개선). 개수·줄 수 같은 작업량 수치는 넣지 않는다. */
	summary: string;
	highlights: string[];
	links?: ResumeLinkProps[];
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

export type OrganizationItem = { service: string; item: ProjectItem };

/** 한 회사의 프로젝트 항목을 서비스 구분 없이 종료일 → 시작일 순으로 최신부터 펼친다. 같으면 작성 순서. */
export const getOrganizationItems = (projects: ServiceProject[], organization: string): OrganizationItem[] =>
	projects
		.filter(project => project.organization === organization)
		.flatMap(project => project.items.map(item => ({ service: project.service, item })))
		.map((entry, index) => ({ entry, index, range: getProjectRange(entry.item.date) }))
		.sort((a, b) => compareRecent(a.range, b.range) || a.index - b.index)
		.map(({ entry }) => entry);

type CareerPeriodTarget = Pick<Careers, 'startDate' | 'endDate' | 'period'>;

const toCareerDate = (date: string) => {
	const [year, month, day = '01'] = date.split('.');
	return new Date(Number(year), Number(month) - 1, Number(day));
};

const formatMonths = (months: number) => {
	const years = Math.floor(months / 12);
	const remainingMonths = months % 12;

	if (years > 0 && remainingMonths > 0) return `${years}년 ${remainingMonths}개월`;
	if (years > 0) return `${years}년`;

	return `${months}개월`;
};

/** 시작~종료(없으면 오늘)의 개월 수. 기간 정보가 없으면 0. */
export const getCareerMonths = (career: CareerPeriodTarget) => {
	if (career.period || !career.startDate) return 0;

	const start = toCareerDate(career.startDate);
	const end = career.endDate ? toCareerDate(career.endDate) : new Date();

	return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
};

/** 한 회사의 프로젝트(서비스) 수, 업무(프로젝트 안의 항목) 수, 서비스별 업무 수. 서비스는 projects 배열 순서(최신순)를 따른다. */
export const getOrganizationSummary = (projects: ServiceProject[], organization: string) => {
	const services = projects
		.filter(project => project.organization === organization)
		.map(project => ({ service: project.service, count: project.items.length }));

	return {
		projects: services.length,
		total: services.reduce((sum, { count }) => sum + count, 0),
		services,
	};
};

export function getCareerPeriod(career: CareerPeriodTarget) {
	if (career.period) return { text: career.period, duration: '', isOngoing: false };
	if (!career.startDate) return { text: '', duration: '', isOngoing: false };

	const isOngoing = !career.endDate;
	const duration = formatMonths(getCareerMonths(career));

	const startStr = career.startDate;
	const endStr = isOngoing ? '재직 중' : career.endDate!;

	return { text: `${startStr} ~ ${endStr}`, duration, isOngoing };
}

/** 기술 이름에서 버전(숫자·v숫자)을 떼어 같은 기술을 하나로 센다. 예: "React 19" → "React". */
const stripVersion = (tech: string) => tech.replace(/\s+v?\d+(\.\d+)*$/i, '').trim();

/** 모든 경력의 기술 스택을 버전 없이 중복 없이 모은다. 먼저 나온 순서(최근 경력 우선)를 따른다. */
export const getSkills = (careers: Pick<Careers, 'techStack'>[]) => {
	const seen = new Set<string>();

	return careers
		.flatMap(career => career.techStack)
		.map(stripVersion)
		.filter(tech => {
			const key = tech.toLowerCase();

			if (seen.has(key)) return false;
			seen.add(key);

			return true;
		});
};

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
	/** 이력서에 싣는 항목. 수상·선정만 간결하게 적는다. */
	items: (string | ActivityItem)[];
	/** 포트폴리오에서만 싣는 활동 내용. 링크는 문장 안 문구나 "(제목)" 꼴로 건다. */
	detail?: (string | ActivityItem)[];
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
		description:
			'누적 이용자 500만 규모의 정책 추천·기부 플랫폼 Wello와 B2B SaaS Wello-biz의 커머스·마이데이터·통합 어드민 프론트엔드 개발을 담당했습니다.',
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
					'웰마켙 결제(NICEPAY)부터 배송조회·배송완료·리뷰 작성까지 사용자 화면과 입점업체 어드민 개발, 오픈 후 1개월간 결제 금액 관련 CS·API 에러 0건',
				highlights: ['CS·API 에러 0건'],
			},
			{
				title: 'Wello PC 반응형 전환 및 통합검색 구축',
				caseSlug: 'wello-responsive-search',
				date: '2026.04',
				summary:
					'Wello PC 반응형 전환과 카테고리별 통합검색 구축, 검색 조건을 URL에 담아 공유·새로고침 후에도 복원, GA4 전후 비교 기준 데스크톱 평균 참여 시간 약 20% 증가',
				highlights: ['참여 시간 약 20% 증가'],
			},
			{
				title: '외부 납부 환경의 중복 기부 재확인',
				caseSlug: 'donation-duplicate-guard',
				date: '2025.12 ~ 2026.01',
				summary:
					'외부 지로 납부 구조의 고향사랑기부에서 결제 직전 최신 완료 이력을 재조회해 중복 기부를 확인하도록 개선(앱·웹뷰·웹 공통), 관련 CS 재문의 70% 감소',
				highlights: ['CS 재문의 70% 감소'],
			},
			{
				title: '의료·통신·신용 마이데이터 연동 및 연결 관리 구축',
				caseSlug: 'mydata-integration',
				date: '2025.12 ~ 2026.01',
				summary:
					'의료·통신·신용 마이데이터(KHIS·KOSCOM·NICE) 본인인증부터 전송요구·전자서명까지 연동 플로우와 재동의·철회·전송 이력 연결 관리 개발, 일괄 철회는 일부 실패해도 실패한 항목만 안내',
				highlights: ['마이데이터(KHIS·KOSCOM·NICE)'],
			},
		],
	},
	{
		organization: '웰로',
		service: 'Wello 통합 어드민',
		serviceDescription: 'Wello·Wello-biz 통합 운영 어드민',
		role: ['Next.js·Vue 통합 운영 어드민의 인증·세션 개선'],
		techStack: ['Next.js', 'Vue'],
		items: [
			{
				title: 'Next.js·Vue 통합 어드민 토큰 자동 갱신',
				caseSlug: 'admin-session-refresh',
				date: '2026.03',
				summary:
					'Next.js·Vue 통합 어드민에서 401 응답 시 토큰을 갱신해 재요청하고 동시 갱신은 한 번으로 묶었으며, 쿠키를 접속 도메인별로 분리해 탭 2개 작업 시 로그아웃되던 문제 해소',
				highlights: ['로그아웃되던 문제 해소'],
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
				summary:
					'Wello-biz의 Chakra UI·yup·Swiper 등 레거시 스택을 공통 디자인 시스템·Tailwind·Zod·Embla로 전환해 모노레포 다른 앱과 UI·검증 방식을 통일하고 의존성 5종 제거, 번들 감소',
				highlights: ['의존성 5종 제거'],
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
					'OpenAI Assistants 기반 AI 챗봇의 스트림 응답과 이전 대화 로딩 시 읽던 위치 유지, 프롬프트·모델·지식 베이스·통계 운영 CMS 개발로 고객사가 지식 파일·응답 설정을 직접 관리',
				highlights: ['고객사가 지식 파일·응답 설정을 직접 관리'],
				links: [
					{
						title: '역방향 무한스크롤을 구현하는 2가지 방법',
						url: 'https://www.ycow-dev.com/blog/posts/next/reverse_infinite_scroll',
					},
				],
			},
			{
				title: 'React CSR 서비스의 Next.js 15 SSR 전환',
				caseSlug: 'ai-chatbot-ssr',
				date: '2025.01 ~ 2025.08',
				summary:
					'React CSR 챗봇을 Next.js 15 App Router로 전환해 고객사별 메타데이터·Open Graph·사이트맵을 서버에서 생성, 신규 고객사를 프론트엔드 배포 없이 추가',
				highlights: ['프론트엔드 배포 없이 추가'],
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
					'백엔드 1명과 2인 팀에서 Swing 서비스 웹(Webpack 5)·관리자 CMS(Vite) 프론트엔드를 단독 개발하고, 로그인 토큰을 쿠키로 공유해 Unity WebGL 가상 오피스 진입 연동',
				highlights: ['프론트엔드를 단독 개발'],
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
					'외주사에서 인수받은 WebGL 아바타 서비스의 3D 렌더링·대용량 정적 자산 문제를 진입점 lazy loading·Suspense 분리와 S3·CDN 이전으로 개선해 첫 화면 표시(FCP) 3초 이상에서 400~600ms로 단축',
				highlights: ['400~600ms로 단축'],
			},
		],
	},
];

const EDUCATION: Education[] = [{ title: '한국방송통신대학교 컴퓨터과학과', period: '재학 중' }];

/** 대외활동: 활동명·기간과 수상, 링크가 필요한 오픈소스 기여만 간결하게 싣는다. 링크는 항목 제목 자체에 건다. */
const ACTIVITIES: Activity[] = [
	{
		title: '항해플러스 프론트엔드 6기',
		organization: '',
		period: '2025.07 ~ 2025.09',
		items: ['최종 주차 성능 최적화 과제 BP(Best Practice) 선정'],
		detail: [
			'바닐라 JS로 Virtual DOM(JSX 파싱·diff)과 React 훅·메모이제이션을 직접 구현하고, Express 기반 SSR/SSG를 구현하며 프레임워크 내부 동작을 학습했습니다.',
			'TDD 기반 단위·통합 테스트(Vitest + RTL + MSW)와 성능 프로파일링을 반복해 훈련했고, 최종 주차 성능 최적화 과제에서 BP(Best Practice)로 선정됐습니다.',
		],
	},
	{
		title: '오픈소스 컨트리뷰션 아카데미',
		organization: '과학기술정보통신부',
		period: '2023.07 ~ 2024.01',
		items: [
			'과학기술정보통신부 장관상 대상 수상',
			{
				text: 'Argo Workflows UI 기여 PR 3건 머지(1건 공동 작성)',
				links: [
					{
						title: 'Argo Workflows UI 기여 PR 3건 머지',
						url: 'https://github.com/argoproj/argo-workflows/pulls?q=is%3Apr+is%3Amerged+involves%3Ayunwoo-yu',
					},
				],
			},
		],
	},
	{
		title: '멋쟁이사자처럼 프론트엔드 스쿨 3기',
		organization: '멋쟁이사자처럼',
		period: '2022.08 ~ 2023.01',
		items: [],
		detail: [
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
