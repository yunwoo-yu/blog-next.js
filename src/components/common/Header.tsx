'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import useScrollDirection from '@/hooks/useScrollDirection';
import { cn } from '@/utils/utils';

import logoSrc from '../../lib/images/logo.png';
import { GitHubIcon, LinkedInIcon } from '../icons/Icons';
import { ModeToggle } from './ModeToggle';

const NAVIGATION_LIST = [
	{
		href: '/blog/posts',
		label: 'Posting',
	},
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
				'fixed left-0 top-0 w-full border-b border-gray-300 bg-[rgba(255,255,255,0.5)] px-5 py-2 backdrop-blur-sm transition-transform duration-300 ease-in-out dark:bg-[rgba(0,0,0,0.5)]',
			)}>
			<NavigationMenu className="mx-auto max-w-7xl justify-between">
				<NavigationMenuList>
					<NavigationMenuItem>
						<Link href="/blog/posts" className="mr-10 flex max-w-20">
							<Image src={logoSrc} alt="blog logo" />
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
							<Link href={'https://github.com/yunwoo-yu'} target="_blank">
								<GitHubIcon />
							</Link>
						</Button>
					</li>
					<li>
						<Button variant="outline" size="icon">
							<Link href={'https://www.linkedin.com/in/yunwoo-yu-65095b263'} target="_blank">
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
