import type { ResumeLinkProps } from '@/components/resume/ResumeLink';
import { CAREER_DETAIL, getCareerProjects, type Project } from './career-detail';
import { buildCasePath } from './links';

/** 이력서 프로젝트 문단 순서(문제·기여·결과)와 같은 라벨. */
export const CASE_STAGE_LABELS = ['문제', '기여', '결과'] as const;

export type CaseStageLabel = (typeof CASE_STAGE_LABELS)[number];

export interface CaseStage {
	id: 'problem' | 'contribution' | 'result';
	label: CaseStageLabel;
	text: string;
	highlights: string[];
	links: ResumeLinkProps[];
}

/** 이력서 프로젝트를 가리키는 키. 사실(기간·문제·기여·결과)은 이 키로 이력서에서 가져온다. */
interface ResumeRef {
	organization: string;
	service: string;
	project: string;
}

/** 손으로 작성하는 부분. 큐레이션 문구만 두고 사실 자료는 resume.ts 에서 파생한다. */
interface PortfolioCaseSource {
	slug: string;
	title: string;
	/** 목록 카드와 메타 설명에 쓰는 한두 문장. 이력서 본문에 있는 사실만 요약한다. */
	summary: string;
	/** 각 키워드는 해당 프로젝트 이력서 본문에 그대로 들어 있어야 한다(테스트로 보장). */
	keywords: string[];
	resumeRef: ResumeRef;
}

export interface PortfolioCase extends PortfolioCaseSource {
	organization: string;
	position: string;
	service: string;
	serviceDescription?: string;
	period?: string;
	stages: CaseStage[];
}

const STAGE_IDS: CaseStage['id'][] = ['problem', 'contribution', 'result'];

const CASE_SOURCES: PortfolioCaseSource[] = [
	{
		slug: 'wellomarket-checkout',
		title: '웰마켙 주문·결제 전 과정 구축',
		summary:
			'쿠폰·웰포인트를 조합한 최종 결제 금액의 기준을 서버로 고정하고, 주문서부터 결제·배송·취소·반품·환불·운영 어드민까지 같은 서버 주문 상태 코드를 기준으로 동작하도록 맞췄습니다.',
		keywords: ['NICEPAY', '쿠폰·포인트', '주문 상태', '결제 금액'],
		resumeRef: { organization: '웰로', service: 'Wello', project: '웰마켙 주문·결제 전 과정 구축' },
	},
	{
		slug: 'wello-responsive-search',
		title: 'Wello PC 반응형 전환 및 통합검색 구축',
		summary:
			'PC에서도 600px 고정폭으로 보이던 화면을 PC 레이아웃으로 확장하고, 흩어진 콘텐츠를 카테고리별로 찾는 통합검색을 만들었습니다. 검색 조건은 URL과 동기화해 공유와 재진입이 가능합니다.',
		keywords: ['PC 반응형', '통합검색', 'URL', 'GA4'],
		resumeRef: { organization: '웰로', service: 'Wello', project: 'Wello PC 반응형 전환 및 통합검색 구축' },
	},
	{
		slug: 'donation-duplicate-guard',
		title: '외부 납부 환경의 중복 기부 재확인',
		summary:
			'외부 지로 화면에서 납부를 마치는 고향사랑기부에서, 진입 시 정산하고 결제 시점에 최신 완료 이력을 다시 조회해 사용자가 확인한 뒤 진행하게 했고, 중복 기부 관련 CS 재문의가 70% 감소했습니다.',
		keywords: ['정산', '납부 식별값', '웹뷰', 'CS 재문의'],
		resumeRef: { organization: '웰로', service: 'Wello', project: '외부 납부 환경의 중복 기부 재확인' },
	},
	{
		slug: 'mydata-integration',
		title: '의료·통신·신용 마이데이터 연동 및 연결 관리 구축',
		summary:
			'KHIS·KOSCOM·NICE의 서로 다른 절차를 본인인증부터 전송요구, 재동의, 철회, 전송 이력까지 27개 API 연동으로 구축했습니다.',
		keywords: ['본인인증 SDK', '세션 스토리지', '일괄 철회', '전송 이력'],
		resumeRef: {
			organization: '웰로',
			service: 'Wello',
			project: '의료·통신·신용 마이데이터 연동 및 연결 관리 구축',
		},
	},
	{
		slug: 'wellobiz-chakra-zod',
		title: 'Wello-biz 레거시 UI 스택 정리 (Chakra UI·yup 제거)',
		summary:
			'Wello-biz의 Chakra UI·yup과 서드파티 UI 라이브러리를 걷어내고, UI는 공통 디자인 시스템으로 검증은 Zod 하나로 통일했습니다. Zod가 선언하지 않은 필드를 지우는 문제는 느슨한 객체 스키마로 풀었습니다.',
		keywords: ['Chakra UI', 'yup', 'Embla Carousel', 'Zod'],
		resumeRef: {
			organization: '웰로',
			service: 'Wello-biz',
			project: 'Wello-biz 레거시 UI 스택 정리 (Chakra UI·yup 제거)',
		},
	},
	{
		slug: 'admin-session-refresh',
		title: 'Next.js·Vue 통합 어드민 토큰 자동 갱신',
		summary:
			'토큰이 만료돼도 갱신되지 않던 Next.js·Vue 어드민에 401 → 갱신 → 재시도를 구현하고, 웰로·웰로비즈 어드민의 쿠키를 접속 도메인별로 분리해 서로의 로그인 정보를 덮어쓰지 않게 했습니다.',
		keywords: ['401', '갱신', '쿠키', '도메인별로 분리'],
		resumeRef: {
			organization: '웰로',
			service: 'Wello·Wello-biz Admin',
			project: 'Next.js·Vue 통합 어드민 토큰 자동 갱신',
		},
	},
	{
		slug: 'ai-chatbot-cms',
		title: 'AI 챗봇 사용자 서비스·운영 CMS 구축',
		summary:
			'OpenAI Assistants의 답변을 스트림으로 순차 반영하고 이전 대화를 불러올 때 읽던 위치를 유지했으며, 고객사가 지식 파일과 응답 설정을 직접 관리하는 CMS를 함께 만들었습니다.',
		keywords: ['OpenAI Assistants', '스크롤 위치', 'CMS', '벡터 스토어'],
		resumeRef: { organization: '살린', service: 'AI Talker', project: 'AI 챗봇 사용자 서비스·운영 CMS 구축' },
	},
	{
		slug: 'ai-chatbot-ssr',
		title: 'React CSR 서비스의 Next.js 15 SSR 전환',
		summary:
			'고객사별 설정을 서버에서 메타데이터·Open Graph와 사이트맵에 반영해, 프론트엔드 배포 없이 검색 노출 정보를 바꾸고 신규 고객사를 추가할 수 있게 했습니다.',
		keywords: ['Next.js 15', 'Open Graph', '사이트맵', 'App Router'],
		resumeRef: { organization: '살린', service: 'AI Talker', project: 'React CSR 서비스의 Next.js 15 SSR 전환' },
	},
	{
		slug: 'swing-frontend',
		title: 'Swing 서비스 웹 + 관리자 CMS 프론트엔드 단독 개발',
		summary:
			'백엔드 개발자 1명과 2인 팀에서 Webpack 사용자 웹, Vite 관리자 CMS, Unity WebGL 가상 오피스 진입·인증 연결까지 프론트엔드 전 영역을 단독 개발했습니다.',
		keywords: ['Webpack 5', 'Vite', 'Unity', 'S3'],
		resumeRef: { organization: '살린', service: 'Swing', project: '서비스 웹 + 관리자 CMS 프론트엔드 단독 개발' },
	},
	{
		slug: 'avatar-studio-performance',
		title: '아바타 스튜디오 성능 개선',
		summary:
			'3초 이상 빈 화면이 노출되던 WebGL 아바타 서비스의 진입점을 lazy loading과 Suspense 경계로 나누고 정적 자산을 S3·CDN으로 이전해, Lighthouse FCP 기준 400~600ms로 단축했습니다.',
		keywords: ['WebGL', 'lazy loading', 'Suspense', 'S3·CDN', 'Lighthouse FCP'],
		resumeRef: { organization: '살린', service: 'Localo', project: '아바타 스튜디오 성능 개선' },
	},
];

/** 포트폴리오 상세 원문(career-detail.ts)에서 참조한 프로젝트를 찾는다. 이름이 바뀌어 못 찾으면 조용히 비우지 않고 던진다. */
export const findResumeProject = ({ organization, service, project }: ResumeRef) => {
	const career = CAREER_DETAIL.find(item => item.organization === organization);
	const group = career?.serviceGroups.find(item => item.service === service);
	const found: Project | undefined = group?.projects.find(item => item.title === project);

	if (!career || !group || !found) {
		throw new Error(
			`포트폴리오가 참조한 이력서 프로젝트를 찾을 수 없습니다: ${organization} / ${service} / ${project}`,
		);
	}

	return { career, group, project: found };
};

const resolveCase = (source: PortfolioCaseSource): PortfolioCase => {
	const { career, group, project } = findResumeProject(source.resumeRef);

	return {
		...source,
		// exitReason 같은 민감 항목은 의도적으로 가져오지 않는다.
		organization: career.organization,
		position: career.position,
		service: group.service,
		serviceDescription: group.serviceDescription,
		period: project.date,
		stages: project.details.map((detail, index) => ({
			id: STAGE_IDS[index] ?? 'result',
			label: CASE_STAGE_LABELS[index] ?? '결과',
			text: detail.title,
			highlights: detail.highlights,
			links: detail.links ?? [],
		})),
	};
};

/** 경력 순서(CAREER_DETAIL) → 경력 안에서는 프로젝트 최신순. 사례 배열의 순서가 곧 목록·이전/다음 순서다. */
const getCaseOrder = ({ resumeRef: { organization, service, project } }: PortfolioCaseSource) => {
	const careerIndex = CAREER_DETAIL.findIndex(career => career.organization === organization);
	const projectIndex = getCareerProjects(CAREER_DETAIL[careerIndex]).findIndex(
		item => item.service === service && item.project.title === project,
	);

	return careerIndex * 1000 + projectIndex;
};

export const PORTFOLIO_CASES: PortfolioCase[] = [...CASE_SOURCES]
	.sort((a, b) => getCaseOrder(a) - getCaseOrder(b))
	.map(resolveCase);

export const getPortfolioCase = (slug: string) => PORTFOLIO_CASES.find(item => item.slug === slug);

export { buildCasePath };

export const getAdjacentCases = (slug: string) => {
	const index = PORTFOLIO_CASES.findIndex(item => item.slug === slug);

	if (index === -1) return { prev: undefined, next: undefined };

	return { prev: PORTFOLIO_CASES[index - 1], next: PORTFOLIO_CASES[index + 1] };
};
