import type { ResumeLinkProps } from '@/components/resume/ResumeLink';
import { META_AUTHOR_NAME } from '@/constant';
import RESUME, { getCareerPeriod } from '@/constant/resume';

export { PORTFOLIO_LINKS, PORTFOLIO_PATH, type PortfolioLink } from './links';

export const PORTFOLIO_TITLE = `${META_AUTHOR_NAME} 포트폴리오`;
export const PORTFOLIO_DESCRIPTION =
	'프론트엔드 개발자 유윤우의 포트폴리오. 결제·통합검색·마이데이터·폼 검증 전환·어드민 토큰 갱신·AI 챗봇·WebGL 성능 개선 등 웰로와 살린에서 맡은 10개 프로젝트를 문제, 판단, 결과 순서로 정리했습니다.';

export interface PortfolioKeyResult {
	/** 크게 보이는 수치. 해당 사례의 이력서 원문(career-detail.ts)에 그대로 있어야 한다(테스트로 보장). */
	value: string;
	/** 수치 아래 회색 설명. 원문에 있는 사실만 줄여 쓴다. */
	label: string;
	/** 수치가 나온 사례 */
	slug: string;
}

/** 첫 화면의 핵심 숫자 3개. 지어낸 수치를 넣지 않는다. */
export const PORTFOLIO_KEY_RESULTS: PortfolioKeyResult[] = [
	{ value: '0건', label: '오픈 후 1개월, 결제 금액 관련 CS 문의·API 에러', slug: 'wellomarket-checkout' },
	{ value: '70%', label: '중복 기부 관련 CS 재문의 감소', slug: 'donation-duplicate-guard' },
	{ value: '400~600ms', label: '아바타 첫 화면 FCP, 기존 3초 이상', slug: 'avatar-studio-performance' },
];

/** 경력 요약. exitReason 은 공개 포트폴리오에 싣지 않으므로 가져오지 않는다. */
export const getPortfolioExperience = () =>
	RESUME.careers.map(career => {
		const { text, duration } = getCareerPeriod(career);

		return {
			organization: career.organization,
			position: career.position,
			period: duration ? `${text} (${duration})` : text,
			description: career.description,
			techStack: career.techStack,
		};
	});

const toActivityItem = (item: string | { text: string; links?: ResumeLinkProps[] }) =>
	typeof item === 'string' ? { text: item, links: [] } : { text: item.text, links: item.links ?? [] };

/** 활동·교육. 이력서에서 파생한다. awards 는 이력서에 싣는 수상·선정 항목이다. */
export const getPortfolioActivities = () =>
	RESUME.activities.map(activity => ({
		title: activity.title,
		organization: activity.organization,
		period: activity.period,
		awards: activity.items.map(toActivityItem),
		items: (activity.detail ?? activity.items).map(item =>
			typeof item === 'string' ? { text: item, links: [] } : { text: item.text, links: item.links ?? [] },
		),
	}));
