import { META_AUTHOR_NAME } from '@/constant';
import RESUME, { getCareerPeriod } from '@/constant/resume';

import type { PortfolioSection } from './links';

export { PORTFOLIO_LINKS, PORTFOLIO_PATH, type PortfolioLink, type PortfolioSection } from './links';

export const PORTFOLIO_TITLE = `${META_AUTHOR_NAME} 포트폴리오`;
export const PORTFOLIO_DESCRIPTION =
	'프론트엔드 개발자 유윤우의 포트폴리오. 결제·통합검색·마이데이터·지역 데이터 캐시·폼 검증 전환·AI 챗봇·WebGL 성능 개선 등 웰로와 살린에서 맡은 10개 프로젝트를 문제, 판단, 결과 순서로 정리했습니다.';

export const PORTFOLIO_SECTIONS: PortfolioSection[] = [
	{ id: 'exhibit', label: '전시' },
	{ id: 'cases', label: '사례' },
	{ id: 'experience', label: '경력' },
	{ id: 'activities', label: '활동' },
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

/** 활동·교육. 이력서에서 파생한다. */
export const getPortfolioActivities = () =>
	RESUME.activities.map(activity => ({
		title: activity.title,
		organization: activity.organization,
		period: activity.period,
		items: activity.items.map(item =>
			typeof item === 'string' ? { text: item, links: [] } : { text: item.text, links: item.links ?? [] },
		),
	}));
