import { BLOG_POSTS_PATH, GITHUB_URL, LINKEDIN_URL, PORTFOLIO_PATH, RESUME_PATH } from '@/constant';

/**
 * 클라이언트 컴포넌트가 가져오는 포트폴리오 상수. 이력서 원문(@/constant/resume)을 import 하면
 * 퇴사 사유 같은 비공개 필드까지 브라우저 번들에 실리므로 이 파일은 이력서를 가져오지 않는다(테스트로 보장).
 */

export { PORTFOLIO_PATH };

/** 전체를 한 문서로 인쇄(PDF 저장)하는 페이지. noindex 이며 사이트맵에 넣지 않는다. */
export const PORTFOLIO_PRINT_PATH = `${PORTFOLIO_PATH}/print`;

export interface PortfolioLink {
	label: string;
	href: string;
	/** 새 탭으로 여는 외부 주소인지 */
	external: boolean;
}

export const PORTFOLIO_LINKS = {
	resume: { label: '이력서', href: RESUME_PATH, external: false },
	posts: { label: '블로그', href: BLOG_POSTS_PATH, external: false },
	github: { label: 'GitHub', href: GITHUB_URL, external: true },
	linkedin: { label: 'LinkedIn', href: LINKEDIN_URL, external: true },
} satisfies Record<string, PortfolioLink>;

export const buildCasePath = (slug: string) => `${PORTFOLIO_PATH}/${slug}`;
