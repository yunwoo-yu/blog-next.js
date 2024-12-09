'use client';

import Link from 'next/link';

import useObserverToc from '@/hooks/useObserverToc';
import { HeadingTypes } from '@/types/common.types';
import { cn } from '@/utils/utils';

interface TitleIndexProps {
	headerNavigationList?: HeadingTypes[];
}

const Toc = ({ headerNavigationList }: TitleIndexProps) => {
	const { activeIds } = useObserverToc();

	return (
		<ul className="mx-auto mt-10 flex max-h-[calc(80vh-10rem)] max-w-3xl flex-col gap-1 overflow-y-scroll rounded-lg bg-secondary p-5 text-gray-500 dark:text-gray-300">
			<li className="text-lg font-semibold text-foreground">목차</li>
			{headerNavigationList &&
				headerNavigationList.map(({ text, href, children }, index) => (
					<li key={text}>
						<Link
							href={href}
							className={cn(
								'scroll-mt-28 list-none scroll-smooth text-sm transition hover:text-destructive',
								activeIds.includes(href) && 'text-destructive',
							)}>
							{index + 1}. {text}
						</Link>
						{children?.length ? (
							<ul>
								{children.map(heading => (
									<li key={heading.text} className="indent-2">
										<Link
											href={heading.href}
											className={cn(
												'scroll-mt-28 list-none scroll-smooth text-xs transition hover:text-destructive',
												activeIds.includes(heading.href) && 'text-destructive',
											)}>
											- {heading.text}
										</Link>
									</li>
								))}
							</ul>
						) : null}
					</li>
				))}
		</ul>
	);
};

export default Toc;
