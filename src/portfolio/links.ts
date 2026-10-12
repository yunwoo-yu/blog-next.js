import { GITHUB_URL, LINKEDIN_URL } from '@/constant';

/**
 * 클라이언트 컴포넌트가 가져오는 포트폴리오 상수. 이력서 원문(@/constant/resume)을 import 하면
 * 퇴사 사유 같은 비공개 필드까지 브라우저 번들에 실리므로 이 파일은 이력서를 가져오지 않는다(테스트로 보장).
 */

export const PORTFOLIO_PATH = '/portfolio';

export interface PortfolioSection {
	id: string;
	label: string;
}

export interface PortfolioLink {
	label: string;
	href: string;
	/** 새 탭으로 여는 외부 주소인지 */
	external: boolean;
}

export const PORTFOLIO_LINKS = {
	resume: { label: '이력서', href: '/resume', external: false },
	posts: { label: '블로그', href: '/blog/posts', external: false },
	github: { label: 'GitHub', href: GITHUB_URL, external: true },
	linkedin: { label: 'LinkedIn', href: LINKEDIN_URL, external: true },
} satisfies Record<string, PortfolioLink>;

export const buildCasePath = (slug: string) => `${PORTFOLIO_PATH}/${slug}`;
