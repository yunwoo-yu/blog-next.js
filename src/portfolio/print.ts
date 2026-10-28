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
import { type DecisionOption, getStory, getVisibleStory, type SequenceDiagram } from './stories';

/** PDF 문서 제목(브라우저가 PDF 저장 시 파일명으로 쓴다). */
export const PRINT_TITLE = `${META_AUTHOR_NAME}_프론트엔드_포트폴리오`;
/** 꼬리말에 찍는 문서 이름. */
export const PRINT_FOOTER_LABEL = `${META_AUTHOR_NAME} · 프론트엔드 포트폴리오`;
export const PRINT_ROLE = '프론트엔드 개발자';
/** 표지 소개글의 둘째 문장. */
export const PRINT_IDENTITY_CLAIM = '결제·검색·인증에서 상태 불일치를 줄이는 프론트엔드 흐름을 구현했습니다.';

/** 수치의 출처 구분. 측정: 도구로 잰 값, 관측: 운영 중 직접 본 값, 전언: 다른 사람이 전한 값, 기재: 이력서에 적힌 값. */
export const EVIDENCE_TAGS = ['측정', '관측', '전언', '기재'] as const;
export type EvidenceTag = (typeof EVIDENCE_TAGS)[number];

export interface PrintFeatured {
	slug: string;
	/** 사례 첫 쪽의 한 줄 성과 */
	oneLine: string;
	/** 수치가 있을 때만. 출처 구분과 수치·근거 */
	evidence?: { tag: EvidenceTag; text: string };
	/** 사례 둘째 쪽 끝의 한계 */
	limit: string;
	/** 표지 목차의 한 구절 */
	tocPhrase: string;
}

interface PrintOther {
	slug: string;
	line: string;
}

/** 대표 사례. 이 순서대로 나오고, 사례마다 정확히 2쪽을 쓴다. */
export const PRINT_FEATURED: readonly PrintFeatured[] = [
	{
		slug: 'wellomarket-checkout',
		oneLine:
			'결제사에 보내는 금액은 서버 확정값 하나로 정하고, 구매 후 화면과 판매 업체용 관리 화면도 서버 주문 상태를 기준으로 만들었습니다.',
		evidence: { tag: '관측', text: '오픈 후 1개월 · 결제 금액 관련 CS 문의·API 에러 로그 0건' },
		limit:
			'0건은 오픈 후 1개월 동안 결제 금액 관련 항목만 관측한 값입니다. PG 승인 이후의 서버 검증은 이 사례의 범위가 아닙니다.',
		tocPhrase: '결제 금액의 기준을 서버로',
	},
	{
		slug: 'wello-responsive-search',
		oneLine:
			'흩어진 콘텐츠를 통합검색으로 모으고, 주소에 검색 조건을 담아 공유·새로고침·뒤로가기 뒤에도 같은 조건으로 볼 수 있게 했습니다.',
		evidence: { tag: '측정', text: '데스크톱 평균 참여 시간 약 20% 증가 · GA4 개편 전후 2주 단순 비교' },
		limit: '참여 시간 증가는 GA4 단순 전후 비교이며 A/B 테스트가 아니라서 이 작업만의 효과로 단정할 수 없습니다.',
		tocPhrase: '검색 조건을 URL로',
	},
	{
		slug: 'admin-session-refresh',
		oneLine:
			'인증 거절 시 갱신·재요청을 구현하고, 같은 탭 안의 동시 요청은 갱신 결과를 함께 기다리며 다른 탭의 갱신 여부는 저장값을 비교하게 했습니다.',
		limit:
			'갱신 토큰이 일회용인지는 코드로 확인하지 못했습니다. 탭 간 동시 갱신은 쿠키 비교로 줄였지만 완전한 보장은 아닙니다.',
		tocPhrase: '같은 탭의 동시 요청은 갱신 공유',
	},
	{
		slug: 'donation-duplicate-guard',
		oneLine:
			'이전 납부 결과가 서비스 내역에 반영된 뒤 최신 이력을 다시 조회하고, 완료 이력이 있으면 사용자가 기부를 계속할지 고르게 했습니다.',
		evidence: { tag: '전언', text: '중복 기부 관련 CS(고객 상담) 재문의 약 70% 감소 · CS 담당자 전언' },
		limit:
			'약 70%는 CS 담당자 전언이며 별도 집계 데이터는 없습니다. 이 기능은 중복 기부를 막는 것이 아니라 재확인한 뒤 사용자가 선택하게 합니다.',
		tocPhrase: '웹뷰 이탈·복귀 판별',
	},
	{
		slug: 'avatar-studio-performance',
		oneLine:
			'3D 화면의 로딩 경계를 나누고, 편집 상태와 3D 표시의 역할을 분리했습니다. 파일 경로도 별도로 한 곳에 모아 관리했습니다.',
		evidence: { tag: '기재', text: 'FCP 3초 이상 → 400~600ms · 이력서 기재' },
		limit: 'FCP는 첫 콘텐츠가 그려진 시점이며, 3D 편집 화면이 조작 가능해지는 시점과는 구분됩니다.',
		tocPhrase: '첫 콘텐츠 표시(FCP) 개선',
	},
];

/** 마지막 쪽 아래의 용어 풀이. 한 줄씩 짧게 써서 별도 쪽이 생기지 않도록 한다. */
export const PRINT_GLOSSARY = [
	{ term: 'PG', description: '결제 대행사' },
	{ term: 'FCP', description: '화면에 첫 콘텐츠가 그려지는 시점' },
	{ term: '웹뷰', description: '앱 안에 띄운 웹 화면' },
	{ term: '401·토큰·쿠키', description: '인증 거절 응답·로그인 증명값·브라우저 저장값' },
	{ term: 'CS', description: '고객 상담' },
	{ term: 'Suspense', description: '화면 일부의 로딩을 나눠 다루는 React 기능' },
] as const;

/** 그 밖의 작업. 표 한 줄씩 이 순서로 나온다. */
export const PRINT_OTHERS: readonly PrintOther[] = [
	{
		slug: 'ai-chatbot-ssr',
		line: '고객사별 페이지·링크 미리보기 정보를 서버에서 만들고 관리 화면에서 고치게 해, 재배포 없이 변경·신규 고객사 반영이 가능하게 했습니다.',
	},
	{
		slug: 'ai-chatbot-cms',
		line: '답변을 조각으로 받아 보여 주고 이전 대화를 불러와도 읽던 위치를 유지했으며, 지식 파일·링크 미리보기·통계 관리 화면을 개발했습니다.',
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
		line: '인증·전자서명부터 재동의·철회·이력 화면까지 구현했습니다. 기관 심사 반려로 운영 성과는 없습니다.',
	},
];

/** 문구 길이 상한(글자 수). 테스트가 검사한다. */
export const PRINT_LIMITS = { oneLine: 80, limit: 120, otherLine: 90, otherTitle: 45 } as const;

/** 사례 한 건이 차지하는 쪽 수(A쪽: 문제·해결, B쪽: 도식·결과·한계). */
export const PRINT_PAGES_PER_CASE = 2;
/** 사례 한 건에서 싣는 풀었던 문제·도식·판단의 최대 수. */
export const PRINT_MAX_TROUBLES = 2;
export const PRINT_MAX_DIAGRAM_STEPS = 5;
export const PRINT_MAX_DECISIONS = 2;
/** 결과 문단의 최대 문장 수. */
export const PRINT_MAX_RESULT_SENTENCES = 2;
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

/** 쪽 번호. 표지가 1쪽이고, 사례는 2쪽씩, 그 밖의 작업이 마지막이다. */
export const getPrintPages = () => {
	const caseStarts = PRINT_FEATURED.map((_, index) => 2 + index * PRINT_PAGES_PER_CASE);
	const others = 2 + PRINT_FEATURED.length * PRINT_PAGES_PER_CASE;

	return { caseStarts, others, total: others };
};

/** 전체 경력 기간. 예: "2년 7개월". */
export const getTotalCareerDuration = () =>
	formatMonths(RESUME.careers.reduce((sum, career) => sum + getCareerMonths(career), 0));

/** 문장 단위로 나눈다. 마침표 뒤 공백에서 끊으므로 "2026.03" 같은 숫자 속 점은 끊지 않는다. */
export const splitSentences = (text: string) =>
	text
		.split(/(?<=[.!?])\s+/)
		.map(part => part.trim())
		.filter(Boolean);

const FIGURE_PATTERN = /\d[\d.,~]*\s?(?:건|%|ms|초)/g;
const DISCLAIMER_PATTERN = /(?:수치|값|데이터|집계|정량)[^.]*(?:없습니다|않았습니다)|아닙니다/;

/**
 * 결과 문단용 문장. 한 줄 성과·출처 태그에 이미 나온 수치 문장과, "수치는 없습니다" 같은 해명 문장은 뺀다
 * (그 역할은 출처 태그와 한계 섹션이 한다). 남은 문장은 범위·적용 대상을 말한다.
 */
export const getPrintResultSentences = (resultText: string, evidence?: PrintFeatured['evidence']) => {
	const figures = evidence?.text.match(FIGURE_PATTERN) ?? [];

	return splitSentences(resultText)
		.filter(sentence => !figures.some(figure => sentence.includes(figure)))
		.filter(sentence => !DISCLAIMER_PATTERN.test(sentence))
		.slice(0, PRINT_MAX_RESULT_SENTENCES);
};

/**
 * 인쇄용으로 풀었던 문제를 줄인다. 앞에서 PRINT_MAX_TROUBLES 개를 고르고, 도식은 단계가 PRINT_MAX_DIAGRAM_STEPS 이하인
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

interface PrintDecisionRow {
	question: string;
	chosen: Pick<DecisionOption, 'label' | 'name' | 'reason'>[];
	/** 실제 데이터에 있는 고르지 않은 방식만 싣는다. */
	alternatives: Pick<DecisionOption, 'label' | 'name'>[];
}

/** 선택 이유 표의 행. 보이는 판단만, 최대 PRINT_MAX_DECISIONS 개. */
export const getPrintDecisionRows = (slug: string): PrintDecisionRow[] =>
	getVisibleStory(getStory(slug))
		.decisions.map(decision => ({
			question: decision.question,
			chosen: decision.options
				.filter(option => option.verdict === 'chosen')
				.map(({ label, name, reason }) => ({ label, name, reason })),
			alternatives: decision.options
				.filter(option => option.verdict === 'rejected')
				.map(({ label, name }) => ({ label, name })),
		}))
		.filter(row => row.chosen.length > 0)
		.slice(0, PRINT_MAX_DECISIONS);

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

/** 마지막 쪽 "더 확인할 수 있는 기술 자료": 블로그 글과 오픈소스 PR. 문구는 이력서 원문에서 가져온다. */
export const getPrintReferences = () => {
	const prText = RESUME.activities
		.flatMap(activity => activity.items)
		.find(item => typeof item !== 'string' && item.links?.some(link => link.url === ARGO_WORKFLOWS_PR_URL));

	return [
		{
			label: '블로그',
			url: REVERSE_INFINITE_SCROLL_POST_URL,
			/** point 앞에 붙는 라벨. 항목 종류마다 다르다. */
			pointLabel: '이 글에서 확인할 판단',
			point: '스크롤 위치 보정 방식 두 가지 비교',
		},
		{
			label: '오픈소스',
			url: ARGO_WORKFLOWS_PR_URL,
			pointLabel: '기여 내용',
			point: typeof prText === 'string' || !prText ? 'Argo Workflows UI 기여 PR 머지' : prText.text,
		},
	];
};
