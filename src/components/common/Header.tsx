'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { GITHUB_URL, LINKEDIN_URL } from '@/constant';
import useScrollDirection from '@/hooks/useScrollDirection';
import { cn } from '@/utils/utils';

import { GitHubIcon, LinkedInIcon } from './Icons';
import { ModeToggle } from './ModeToggle';

const NAVIGATION_LIST = [
	{
		href: '/about',
		label: 'About',
	},
];

const Header = () => {
	const pathname = usePathname();
	const showHeader = useScrollDirection();

	return (
		<header
			className={cn(
				showHeader ? 'translate-y-[0px]' : 'translate-y-[-97px]',
				'fixed left-0 top-0 z-50 w-full border-b border-gray-300 bg-[rgba(255,255,255,0.5)] px-5 py-2 backdrop-blur-sm transition-transform duration-300 ease-in-out dark:bg-[rgba(0,0,0,0.5)]',
			)}>
			<NavigationMenu className="mx-auto max-w-7xl justify-between">
				<NavigationMenuList>
					<NavigationMenuItem>
						<Link href="/blog/posts" className="relative mr-10 flex w-full min-w-10 max-w-20">
							<img src="/images/logo.png" alt="blog logo" className="w-full object-cover" />
						</Link>
					</NavigationMenuItem>
					{NAVIGATION_LIST.map(item => (
						<NavigationMenuItem
							key={item.label}
							className={cn(navigationMenuTriggerStyle(), pathname === item.href && 'bg-muted')}>
							<Link href={item.href}>{item.label}</Link>
						</NavigationMenuItem>
					))}
				</NavigationMenuList>
				<ul className="flex gap-4">
					<li>
						<ModeToggle />
					</li>
					<li>
						<Button variant="outline" size="icon">
							<Link href={GITHUB_URL} target="_blank">
								<GitHubIcon />
							</Link>
						</Button>
					</li>
					<li>
						<Button variant="outline" size="icon">
							<Link href={LINKEDIN_URL} target="_blank">
								<LinkedInIcon />
							</Link>
						</Button>
					</li>
				</ul>
			</NavigationMenu>
		</header>
	);
};

export default Header;
