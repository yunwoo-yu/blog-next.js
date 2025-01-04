'use client';

import { useEffect, useState } from 'react';

import useScrollDirection from '@/hooks/useScrollDirection';
import { cn } from '@/utils/utils';

const PostProgressScroll = () => {
	const [scrollProgress, setScrollProgress] = useState<number>(0);
	const showHeader = useScrollDirection();

	useEffect(() => {
		const onScroll = () => {
			const currentScrollPosition = document.documentElement.scrollTop;
			const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
			const progress = (currentScrollPosition / scrollHeight) * 100;

			setScrollProgress(progress);
		};

		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<div
			className={cn(
				showHeader ? 'translate-y-[97px]' : 'translate-y-[0px]',
				'z-100 fixed left-0 top-0 h-1 rounded-none bg-destructive transition-transform duration-300 ease-in-out',
			)}
			style={{ width: `${scrollProgress}%` }}
		/>
	);
};

export default PostProgressScroll;
