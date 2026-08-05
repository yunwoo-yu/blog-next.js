'use client';

import { ChevronDown } from 'lucide-react';
import { type MouseEvent, useState } from 'react';

import useObserverToc from '@/hooks/useObserverToc';
import type { HeadingTypes } from '@/types/common.types';
import { cn } from '@/utils/utils';

interface TitleIndexProps {
	headerNavigationList?: HeadingTypes[];
}

const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>) => {
	e.preventDefault();
	const id = e.currentTarget.getAttribute('href')?.slice(1);

	if (!id) return;

	document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	window.history.replaceState(null, '', `#${id}`);
};

const Toc = ({ headerNavigationList }: TitleIndexProps) => {
	const { activeIds } = useObserverToc();
	// 좁은 화면에서는 목차가 본문을 밀어내므로 기본 접힘. xl 이상은 사이드에 고정되어 CSS로 항상 펼친다.
	const [isOpen, setIsOpen] = useState(false);

	if (!headerNavigationList?.length) return null;

	return (
		<nav aria-label="목차" className="rounded-lg bg-secondary">
			<button
				type="button"
				aria-expanded={isOpen}
				aria-controls="toc-list"
				onClick={() => setIsOpen(prev => !prev)}
				className="flex w-full items-center justify-between px-5 py-3 text-base font-semibold text-foreground xl:hidden">
				목차
				<ChevronDown aria-hidden className={cn('size-4 transition-transform', isOpen && 'rotate-180')} />
			</button>
			<p className="hidden px-5 pt-5 text-lg font-semibold text-foreground xl:block">목차</p>
			<ul
				id="toc-list"
				className={cn(
					'max-h-[calc(80vh-10rem)] flex-col gap-1 overflow-y-auto px-5 pb-5 pt-1 text-gray-500 scrollbar-hide dark:text-gray-300 xl:flex',
					isOpen ? 'flex' : 'hidden',
				)}>
				{headerNavigationList.map(({ text, href, children }, index) => (
					<li key={text}>
						<a
							href={href}
							onClick={handleAnchorClick}
							aria-current={activeIds.includes(href) ? 'location' : undefined}
							className={cn(
								'list-none text-sm transition hover:text-destructive',
								activeIds.includes(href) && 'font-medium text-destructive',
							)}>
							{index + 1}. {text}
						</a>
						{children?.length ? (
							<ul>
								{children.map(heading => (
									<li key={heading.text} className="indent-2">
										<a
											href={heading.href}
											onClick={handleAnchorClick}
											aria-current={activeIds.includes(heading.href) ? 'location' : undefined}
											className={cn(
												'list-none text-xs transition hover:text-destructive',
												activeIds.includes(heading.href) && 'font-medium text-destructive',
											)}>
											- {heading.text}
										</a>
									</li>
								))}
							</ul>
						) : null}
					</li>
				))}
			</ul>
		</nav>
	);
};

export default Toc;
