import type { ResumeLinkProps } from '@/components/resume/ResumeLink';
import { ORGANIZATIONS } from '@/constant/organizations';
import { SWING_PROJECT_TITLE } from '@/constant/resume';
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
		title: '웰마켙 결제·배송·리뷰와 입점업체 어드민 구축',
		summary:
			'쿠폰·포인트를 반영한 최종 금액은 서버에서 결제 직전에 확인한 값 하나로 정해 결제사에 보내고, 배송조회·리뷰 작성 화면과 판매 업체용 관리 화면은 서버의 주문 상태를 기준으로 만들었습니다.',
		keywords: ['PG', '쿠폰·포인트', '주문 상태', '결제 금액'],
		resumeRef: {
			organization: ORGANIZATIONS.WELLO,
			service: 'Wello',
			project: '웰마켙 결제·배송·리뷰와 입점업체 어드민 구축',
		},
	},
	{
		slug: 'wello-responsive-search',
		title: 'Wello PC 반응형 전환 및 통합검색 구축',
		summary:
			'PC에서도 600px 고정폭으로 보이던 화면을 넓히고, 흩어진 콘텐츠를 한 화면에서 찾는 통합검색을 만들었습니다. 검색 조건을 주소에 기록해 링크를 공유하거나 새로고침해도 다시 불러올 수 있게 했습니다.',
		keywords: ['PC 반응형', '통합검색', 'URL', 'GA4'],
		resumeRef: {
			organization: ORGANIZATIONS.WELLO,
			service: 'Wello',
			project: 'Wello PC 반응형 전환 및 통합검색 구축',
		},
	},
	{
		slug: 'donation-duplicate-guard',
		title: '외부 납부 환경의 중복 기부 재확인',
		summary:
			'외부 납부 화면을 다녀온 뒤 서버에서 최신 납부 내역을 다시 확인하고, 완료 이력이 있으면 사용자가 계속 기부할지 고르게 했습니다. 중복 기부 관련 CS(고객 상담) 재문의가 약 70% 감소했다고 CS 담당자가 전했습니다.',
		keywords: ['정산', '납부 식별값', '웹뷰', 'CS 재문의'],
		resumeRef: { organization: ORGANIZATIONS.WELLO, service: 'Wello', project: '외부 납부 환경의 중복 기부 재확인' },
	},
	{
		slug: 'mydata-integration',
		title: '의료·통신·신용 마이데이터 연동 및 연결 관리 구축',
		summary:
			'기관마다 달랐던 개인정보 전송 절차를 본인인증부터 동의·전송·철회·이력 확인까지 이어지는 화면으로 만들었습니다. 외부 인증을 다녀와도 진행 단계를 이어갈 수 있도록 단계와 입력값을 저장했습니다.',
		keywords: ['본인인증 SDK', '세션 스토리지', '일괄 철회', '전송 이력'],
		resumeRef: {
			organization: ORGANIZATIONS.WELLO,
			service: 'Wello',
			project: '의료·통신·신용 마이데이터 연동 및 연결 관리 구축',
		},
	},
	{
		slug: 'wellobiz-chakra-zod',
		title: 'Wello-biz 레거시 UI 스택 정리 (Chakra UI·yup 제거)',
		summary:
			'앱마다 달랐던 화면 구성·입력값 검증 도구를 공통 기준으로 바꿨습니다. 빠르게 끌면 놓치던 패널 크기 조절과 입력 칸의 오류 표시, 제출할 때 값이 빠지는 문제도 고쳤습니다.',
		keywords: ['Chakra UI', 'yup', 'Embla Carousel', 'Zod'],
		resumeRef: {
			organization: ORGANIZATIONS.WELLO,
			service: 'Wello-biz',
			project: 'Wello-biz 레거시 UI 스택 정리 (Chakra UI·yup 제거)',
		},
	},
	{
		slug: 'admin-session-refresh',
		title: 'Next.js·Vue 통합 어드민 토큰 자동 갱신',
		summary:
			'로그인 증명값이 만료되면 자동으로 갱신해 요청을 다시 보내도록 관리 화면을 고쳤습니다. 웰로·웰로비즈의 로그인 저장값도 접속 주소별로 나눠 서로 덮어쓰지 않게 했습니다.',
		keywords: ['401', '갱신', '쿠키', '도메인별로 분리'],
		resumeRef: {
			organization: ORGANIZATIONS.WELLO,
			service: 'Wello 통합 어드민',
			project: 'Next.js·Vue 통합 어드민 토큰 자동 갱신',
		},
	},
	{
		slug: 'ai-chatbot-cms',
		title: 'AI 챗봇 사용자 서비스·운영 CMS 구축',
		summary:
			'답변을 순서대로 보여 주고 이전 대화를 불러와도 읽던 위치를 유지했습니다. 고객사 코드로 설정을 조회해 서버에서 메타데이터(페이지 제목·설명 등의 정보)·Open Graph(OG, 링크 공유 미리보기 정보)를 만들고, CMS(콘텐츠 관리 화면)에서 운영자가 값을 바꾸면 프론트엔드 재배포 없이 반영되게 했습니다.',
		keywords: ['OpenAI Assistants', '스크롤 위치', 'CMS', '벡터 스토어'],
		resumeRef: {
			organization: ORGANIZATIONS.SALIN,
			service: 'AI Talker',
			project: 'AI 챗봇 사용자 서비스·운영 CMS 구축',
		},
	},
	{
		slug: 'swing-frontend',
		title: `Swing ${SWING_PROJECT_TITLE}`,
		summary:
			'사용자 웹 프론트엔드를 단독 개발하고 관리자 CMS(콘텐츠 관리 화면) 프론트엔드도 개발했습니다. 계약 수정 때 첨부파일이 사라지던 문제를 고치고, 웹 로그인을 3D 가상 오피스 진입에 연결했습니다. Unity 개발은 담당하지 않았습니다.',
		keywords: ['Webpack 5', 'Vite', 'S3'],
		resumeRef: {
			organization: ORGANIZATIONS.SALIN,
			service: 'Swing',
			project: SWING_PROJECT_TITLE,
		},
	},
	{
		slug: 'avatar-studio-performance',
		title: '아바타 스튜디오 성능 개선',
		summary:
			'3D 아바타 서비스의 3D 뷰에 Suspense 경계를 두고 편집 기능과 3D 표시를 분리했습니다. CDN 자산 경로는 환경 변수 상수로 정리했습니다. 첫 콘텐츠 표시(FCP)는 3초 이상에서 400~600ms로 줄었습니다(Lighthouse 측정).',
		keywords: ['WebGL', 'Suspense', 'CDN', 'Lighthouse', 'FCP'],
		resumeRef: { organization: ORGANIZATIONS.SALIN, service: 'Localo', project: '아바타 스튜디오 성능 개선' },
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
