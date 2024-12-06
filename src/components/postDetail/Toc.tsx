'use client';

import Link from 'next/link';

import useObserverToc from '@/hooks/useObserverToc';
import { cn } from '@/utils/utils';

interface TitleIndexProps {
	headerNavigationList?: { text: string; href: string }[];
}

const Toc = ({ headerNavigationList }: TitleIndexProps) => {
	const { activeIds } = useObserverToc();

	return (
		<ul className="mx-auto mt-10 flex max-w-3xl flex-col gap-2 rounded-lg bg-secondary p-5 text-gray-500 dark:text-gray-300">
			<li className="text-lg font-semibold text-foreground">목차</li>
			{headerNavigationList &&
				headerNavigationList.map(({ text, href }, index) => (
					<li key={text} className="list-none text-sm hover:text-destructive">
						<Link
							href={href}
							className={cn('scroll-mt-28 scroll-smooth transition', activeIds.includes(href) && 'text-destructive')}>
							{index + 1}. {text}
						</Link>
					</li>
				))}
		</ul>
	);
};

export default Toc;
