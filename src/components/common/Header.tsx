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

const iconLinkStyle =
	'flex size-9 items-center justify-center rounded-md border border-input bg-background shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground';

const Header = () => {
	const pathname = usePathname();
	const showHeader = useScrollDirection();

	return (
		<header
			className={cn(
				showHeader ? 'translate-y-0' : 'translate-y-[calc(-1*var(--header-height))]',
				'fixed left-0 top-0 z-50 h-[var(--header-height)] w-full border-b border-border bg-background/70 px-4 backdrop-blur-md transition-transform duration-300 ease-in-out sm:px-5 print:hidden',
			)}>
			<NavigationMenu className="mx-auto h-full max-w-7xl justify-between">
				<NavigationMenuList className="gap-0 sm:gap-3">
					<NavigationMenuItem className="mr-1 sm:mr-4">
						<Link href={WEB_PATH.POSTS.path()} className="relative flex size-10 sm:size-12 md:size-20">
							<h1 className="sr-only">Ycow Blog</h1>
							<Image
								src="/images/logo.png"
								alt="blog logo"
								className="object-cover"
								fill
								sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 80px"
								priority
							/>
						</Link>
					</NavigationMenuItem>
					{Object.values(WEB_PATH).map(item => (
						<NavigationMenuItem key={item.label}>
							<Link
								href={item.path()}
								aria-current={pathname.startsWith(item.path()) ? 'page' : undefined}
								className={cn(
									navigationMenuTriggerStyle(),
									// 메뉴가 3개가 되어 좁은 화면에서 오른쪽 아이콘이 잘리지 않게 안쪽 여백을 줄인다.
									'bg-transparent px-2 sm:px-4',
									pathname.startsWith(item.path()) && 'bg-muted font-semibold',
								)}>
								{item.label}
							</Link>
						</NavigationMenuItem>
					))}
				</NavigationMenuList>
				<ul className="flex gap-2 sm:gap-3">
					<li>
						<ModeToggle />
					</li>
					<li>
						<Link href={GITHUB_URL} target="_blank" aria-label="GitHub 프로필 열기" className={iconLinkStyle}>
							<GitHubIcon width={16} height={16} />
						</Link>
					</li>
					{/* 좁은 화면에서는 메뉴 3개와 겹치지 않게 LinkedIn 아이콘을 숨긴다(푸터에 링크가 있다). */}
					<li className="hidden sm:block">
						<Link href={LINKEDIN_URL} target="_blank" aria-label="LinkedIn 프로필 열기" className={iconLinkStyle}>
							<LinkedInIcon width={16} height={16} />
						</Link>
					</li>
				</ul>
			</NavigationMenu>
		</header>
	);
};

export default Header;
