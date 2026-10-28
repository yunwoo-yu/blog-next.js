import Link from 'next/link';

import { META_AUTHOR_NAME } from '@/constant';
import { PORTFOLIO_LINKS, PORTFOLIO_PATH, PORTFOLIO_PRINT_PATH } from '@/portfolio/links';
import { cn } from '@/utils/utils';

import { FOCUS_RING } from './ui';

const linkStyle = cn(
	'inline-flex h-11 items-center whitespace-nowrap rounded-lg px-2.5 text-[15px] text-pf-gray-700 transition-colors duration-200 hover:bg-pf-gray-100 hover:text-pf-gray-900',
	FOCUS_RING,
);

/** 포트폴리오 상단 바. 흰 바탕, 하단 얇은 경계, 왼쪽 이름, 오른쪽 텍스트 링크. JS 없이 동작한다. */
const PortfolioTopBar = () => (
	<nav aria-label="포트폴리오 내비게이션" className="border-b border-pf-gray-200 bg-white print:hidden">
		<div className="mx-auto flex min-h-14 w-full max-w-[720px] flex-wrap items-center justify-between gap-x-2 px-3 sm:px-4">
			<Link href={PORTFOLIO_PATH} className={cn(linkStyle, 'text-[17px] font-bold text-pf-gray-900')}>
				{META_AUTHOR_NAME}
			</Link>
			<ul className="flex items-center">
				<li>
					<Link href={PORTFOLIO_LINKS.resume.href} className={linkStyle}>
						{PORTFOLIO_LINKS.resume.label}
					</Link>
				</li>
				<li>
					<Link href={PORTFOLIO_LINKS.posts.href} className={linkStyle}>
						{PORTFOLIO_LINKS.posts.label}
					</Link>
				</li>
				<li>
					<Link href={PORTFOLIO_PRINT_PATH} className={linkStyle}>
						PDF
					</Link>
				</li>
				<li>
					<a href={PORTFOLIO_LINKS.github.href} target="_blank" rel="noopener noreferrer" className={linkStyle}>
						{PORTFOLIO_LINKS.github.label}
						<span className="sr-only"> (새 탭)</span>
					</a>
				</li>
			</ul>
		</div>
	</nav>
);

export default PortfolioTopBar;
