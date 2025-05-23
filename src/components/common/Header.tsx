'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { GITHUB_URL, LINKEDIN_URL, WEB_PATH } from '@/constant';
import useScrollDirection from '@/hooks/useScrollDirection';
import { cn } from '@/utils/utils';

import { GitHubIcon, LinkedInIcon } from './Icons';
import { ModeToggle } from './ModeToggle';

const Header = () => {
	const pathname = usePathname();
	const showHeader = useScrollDirection();

	return (
		<header
			className={cn(
				showHeader ? 'translate-y-[0px]' : 'translate-y-[-97px]',
				'fixed left-0 top-0 z-50 w-full border-b border-gray-300 bg-[rgba(255,255,255,0.5)] px-5 py-2 backdrop-blur-sm transition-transform duration-300 ease-in-out dark:bg-[rgba(0,0,0,0.5)] print:hidden',
			)}>
			<NavigationMenu className="mx-auto max-w-7xl justify-between">
				<NavigationMenuList className="gap-5">
					<NavigationMenuItem className="mr-5">
						<Link href={WEB_PATH.POSTS.path()} className="relative flex h-20 w-20">
							<h1 className="sr-only">Ycow Blog</h1>
							<Image
								src="/images/logo.png"
								alt="blog logo"
								className="object-cover"
								fill
								sizes="(max-width: 1900px) 160px"
								priority
							/>
						</Link>
					</NavigationMenuItem>
					{Object.values(WEB_PATH).map(item => (
						<NavigationMenuItem
							key={item.label}
							className={cn(navigationMenuTriggerStyle(), pathname === item.path() && 'bg-muted')}>
							<Link href={item.path()}>{item.label}</Link>
						</NavigationMenuItem>
					))}
				</NavigationMenuList>
				<ul className="flex gap-3">
					<li>
						<ModeToggle />
					</li>
					<li>
						<Link
							href={GITHUB_URL}
							target="_blank"
							aria-label="github link button"
							className="flex size-9 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
							<GitHubIcon width={16} height={16} />
						</Link>
					</li>
					<li>
						<Link
							href={LINKEDIN_URL}
							target="_blank"
							aria-label="linkedin link button"
							className="flex size-9 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
							<LinkedInIcon width={16} height={16} />
						</Link>
					</li>
				</ul>
			</NavigationMenu>
		</header>
	);
};

export default Header;
