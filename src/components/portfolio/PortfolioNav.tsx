'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { GitHubIcon, LinkedInIcon } from '@/components/common/Icons';
import useActiveSection from '@/hooks/useActiveSection';
import useScrollDirection from '@/hooks/useScrollDirection';
import { PORTFOLIO_LINKS, PORTFOLIO_PATH, type PortfolioSection } from '@/portfolio/links';
import { cn } from '@/utils/utils';

interface PortfolioNavProps {
	sections: PortfolioSection[];
	/** 케이스 상세처럼 목록으로 돌아가는 링크가 필요할 때 */
	showBackLink?: boolean;
}

const linkStyle =
	'inline-flex h-8 shrink-0 items-center whitespace-nowrap rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none';

const iconLinkStyle =
	'inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none';

/**
 * 포트폴리오 전용 내비. 링크는 모두 서버에서 렌더되는 일반 앵커라 JS 없이도 동작하고,
 * JS 가 켜지면 현재 섹션(aria-current)과 헤더 숨김에 맞춘 고정 위치가 더해진다.
 */
const PortfolioNav = ({ sections, showBackLink = false }: PortfolioNavProps) => {
	const showHeader = useScrollDirection();
	const activeId = useActiveSection(sections.map(section => section.id));

	return (
		<nav
			aria-label="포트폴리오 내비게이션"
			className={cn(
				'sticky z-40 border-b border-border bg-background/80 backdrop-blur-md transition-[top] duration-300 motion-reduce:transition-none print:hidden',
				showHeader ? 'top-[var(--header-height)]' : 'top-0',
			)}>
			{/* 좁은 화면에서는 줄바꿈한다. 가로 스크롤은 포커스 링을 잘라 마지막 링크를 화면 밖에 두므로 쓰지 않는다. */}
			<div className="mx-auto flex min-h-11 max-w-5xl flex-wrap items-center gap-x-1 gap-y-0.5 px-3 py-1.5 sm:px-5">
				{showBackLink && (
					<Link href={PORTFOLIO_PATH} className={cn(linkStyle, 'gap-1 pl-1.5 font-medium text-foreground')}>
						<ArrowLeft size={14} aria-hidden="true" />
						포트폴리오
					</Link>
				)}
				<ul className="flex shrink-0 items-center gap-1">
					{sections.map(section => (
						<li key={section.id} className="shrink-0">
							<a
								href={`#${section.id}`}
								aria-current={activeId === section.id ? 'location' : undefined}
								className={cn(linkStyle, activeId === section.id && 'bg-muted font-semibold text-foreground')}>
								{section.label}
							</a>
						</li>
					))}
				</ul>
				<ul className="ml-auto flex shrink-0 items-center gap-1 pl-3">
					<li className="shrink-0">
						<Link href={PORTFOLIO_LINKS.resume.href} className={linkStyle}>
							{PORTFOLIO_LINKS.resume.label}
						</Link>
					</li>
					<li className="shrink-0">
						<Link href={PORTFOLIO_LINKS.posts.href} className={linkStyle}>
							{PORTFOLIO_LINKS.posts.label}
						</Link>
					</li>
					<li className="shrink-0">
						<a
							href={PORTFOLIO_LINKS.github.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="GitHub (새 탭)"
							className={iconLinkStyle}>
							<GitHubIcon width={16} height={16} aria-hidden="true" />
						</a>
					</li>
					<li className="shrink-0">
						<a
							href={PORTFOLIO_LINKS.linkedin.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="LinkedIn (새 탭)"
							className={iconLinkStyle}>
							<LinkedInIcon width={16} height={16} aria-hidden="true" />
						</a>
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default PortfolioNav;
