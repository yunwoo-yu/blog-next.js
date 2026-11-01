import {
	ARGO_WORKFLOWS_PR_URL,
	CONTACT_EMAIL,
	GITHUB_URL,
	META_AUTHOR_NAME,
	PORTFOLIO_PATH,
	RESUME_PATH,
	REVERSE_INFINITE_SCROLL_POST_URL,
	WWW_BASE_URL,
} from '@/constant';
import RESUME, { formatMonths, getCareerMonths, getSkills } from '@/constant/resume';
import { PORTFOLIO_CASES, type PortfolioCase } from './cases';
import { getPortfolioExperience } from './overview';
import { getStory, getVisibleStory, type SequenceDiagram } from './stories';

/** PDF 문서 제목(브라우저가 PDF 저장 시 파일명으로 쓴다). */
export const PRINT_TITLE = `${META_AUTHOR_NAME}_프론트엔드_포트폴리오`;
/** 꼬리말에 찍는 문서 이름. */
export const PRINT_FOOTER_LABEL = `${META_AUTHOR_NAME} · 프론트엔드 포트폴리오`;
export const PRINT_ROLE = '프론트엔드 개발자';
/** 표지 소개글의 둘째 문장. */
export const PRINT_IDENTITY_CLAIM =
	'결제 금액, 검색 조건, 로그인 토큰처럼 화면과 서버의 값이 어긋나기 쉬운 부분을 주로 맡았습니다.';

export interface PrintFeatured {
	slug: string;
	/** 사례 머리의 한 줄 요약. 수치와 그 출처는 결과 문단(이력서 원문)에 괄호로 붙어 있다. */
	oneLine: string;
}

interface PrintOther {
	slug: string;
	line: string;
}

/** 대표 사례. 이 순서대로 나오고, 사례마다 새 쪽에서 시작해 내용만큼 이어진다. */
export const PRINT_FEATURED: readonly PrintFeatured[] = [
	{
		slug: 'wellomarket-checkout',
		oneLine: '결제사로 보내는 금액은 서버 확정값 하나로 정하고, 구매 후 버튼도 서버 주문 상태로 정했습니다.',
	},
	{
		slug: 'wello-responsive-search',
		oneLine:
			'흩어진 콘텐츠를 통합검색으로 모으고, 주소에 검색 조건을 담아 공유·새로고침·뒤로가기 뒤에도 같은 조건으로 볼 수 있게 했습니다.',
	},
	{
		slug: 'admin-session-refresh',
		oneLine:
			'401을 받으면 토큰을 갱신해 다시 요청하고, 다른 탭이 먼저 갱신했는지는 쿠키의 토큰과 비교해 판단하게 했습니다.',
	},
	{
		slug: 'donation-duplicate-guard',
		oneLine:
			'이전 납부 결과가 서비스 내역에 반영된 뒤 최신 이력을 다시 조회하고, 완료 이력이 있으면 사용자가 기부를 계속할지 고르게 했습니다.',
	},
	{
		slug: 'avatar-studio-performance',
		oneLine:
			'3D 뷰에 Suspense 경계를 두고 편집 상태와 3D 표시를 분리했습니다. CDN 자산 경로는 환경 변수 상수로 정리했습니다.',
	},
];

/** 그 밖의 작업. 한 줄씩 이 순서로 나온다. */
export const PRINT_OTHERS: readonly PrintOther[] = [
	{
		slug: 'ai-chatbot-cms',
		line: '스트림 답변·스크롤 보정과 지식 파일 관리 화면을 만들고, 고객사별 메타데이터를 서버에서 생성해 CMS의 OG 편집값을 재배포 없이 반영했습니다.',
	},
	{
		slug: 'wellobiz-chakra-zod',
		line: '화면 구성·검증 도구를 공통 기준으로 바꾸고, 배열·객체 안의 입력 칸에도 오류가 표시되게 검증 결과를 연결했습니다.',
	},
	{
		slug: 'swing-frontend',
		line: '사용자 웹을 단독 개발하고 관리자 화면도 개발했으며, 계약 첨부파일 유지와 웹 로그인의 3D 가상 오피스 진입 연결을 구현했습니다.',
	},
	{
		slug: 'mydata-integration',
		line: '인증·전자서명부터 재동의·철회·이력 화면을 구현하고, 외부 인증 후 단계 복원과 일부 실패 시 실패한 기관만 안내하도록 만들었습니다.',
	},
];

/** 문구 길이 상한(글자 수). 테스트가 검사한다. */
export const PRINT_LIMITS = { oneLine: 80, otherLine: 90, otherTitle: 45 } as const;

/** 사례 한 건에서 싣는 구현 포인트·도식의 최대 수. */
export const PRINT_MAX_TROUBLES = 2;
export const PRINT_MAX_DIAGRAM_STEPS = 5;
/** 표지에 싣는 기술 스택 수. */
export const PRINT_SKILL_COUNT = 10;

/** 웹 포트폴리오 전체 주소. */
export const PRINT_PORTFOLIO_URL = `${WWW_BASE_URL}${PORTFOLIO_PATH}`;

const findCase = (slug: string): PortfolioCase => {
	const found = PORTFOLIO_CASES.find(item => item.slug === slug);

	if (!found) throw new Error(`인쇄 문서가 참조한 포트폴리오 사례를 찾을 수 없습니다: ${slug}`);

	return found;
};

export const PRINT_FEATURED_SLUGS = PRINT_FEATURED.map(entry => entry.slug);

export const getPrintFeatured = () => PRINT_FEATURED.map(entry => ({ ...entry, item: findCase(entry.slug) }));

export const getPrintOthers = () => PRINT_OTHERS.map(entry => ({ ...entry, item: findCase(entry.slug) }));

/** 전체 경력 기간. 예: "2년 7개월". */
export const getTotalCareerDuration = () =>
	formatMonths(RESUME.careers.reduce((sum, career) => sum + getCareerMonths(career), 0));

/** 문장 단위로 나눈다. 마침표 뒤 공백에서 끊으므로 "2026.03" 같은 숫자 속 점은 끊지 않는다. */
export const splitSentences = (text: string) =>
	text
		.split(/(?<=[.!?])\s+/)
		.map(part => part.trim())
		.filter(Boolean);

/**
 * 인쇄용으로 구현 포인트를 줄인다. 앞에서 PRINT_MAX_TROUBLES 개를 고르고, 도식은 단계가 PRINT_MAX_DIAGRAM_STEPS 이하인
 * 것 하나만 남긴다(앞쪽에 없으면 뒤쪽의 그런 도식을 둘째 자리에 올린다). 원래 순서는 유지한다.
 */
export const pickPrintTroubles = <T extends { diagram?: Pick<SequenceDiagram, 'steps'> }>(troubles: T[]): T[] => {
	const fits = (trouble: T) => Boolean(trouble.diagram && trouble.diagram.steps.length <= PRINT_MAX_DIAGRAM_STEPS);
	const picked = troubles.slice(0, PRINT_MAX_TROUBLES);
	let withDiagram = picked.find(fits);

	if (!withDiagram) {
		withDiagram = troubles.find(fits);
		if (withDiagram) picked[picked.length - 1] = withDiagram;
	}
	const kept = new Set(picked);

	return troubles
		.filter(trouble => kept.has(trouble))
		.map(trouble => (trouble === withDiagram || !trouble.diagram ? trouble : { ...trouble, diagram: undefined }));
};

export const getPrintTroubles = (slug: string) => pickPrintTroubles(getVisibleStory(getStory(slug)).troubles);

/** 표지·마지막 쪽에 싣는 연락처 4줄. */
export const getPrintContacts = () => [
	{ label: '이메일', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
	{ label: 'GitHub', value: GITHUB_URL, href: GITHUB_URL },
	{ label: '블로그', value: WWW_BASE_URL, href: WWW_BASE_URL },
	{ label: '이력서', value: `${WWW_BASE_URL}${RESUME_PATH}`, href: `${WWW_BASE_URL}${RESUME_PATH}` },
];

/** 표지의 경력 줄(회사·기간). */
export const getPrintCareers = () =>
	getPortfolioExperience().map(({ organization, period }) => ({ organization, period }));

export const getPrintSkills = () => getSkills(RESUME.careers).slice(0, PRINT_SKILL_COUNT);

/** 마지막 쪽 "글·오픈소스": 블로그 글과 오픈소스 PR. PR 문구는 이력서 원문에서 가져온다. */
export const getPrintReferences = () => {
	const prText = RESUME.activities
		.flatMap(activity => activity.items)
		.find(item => typeof item !== 'string' && item.links?.some(link => link.url === ARGO_WORKFLOWS_PR_URL));

	return [
		{
			label: '블로그',
			url: REVERSE_INFINITE_SCROLL_POST_URL,
			point: '역방향 무한스크롤 구현 2가지 비교',
		},
		{
			label: '오픈소스',
			url: ARGO_WORKFLOWS_PR_URL,
			point: typeof prText === 'string' || !prText ? 'Argo Workflows UI 기여 PR 머지' : prText.text,
		},
	];
};
