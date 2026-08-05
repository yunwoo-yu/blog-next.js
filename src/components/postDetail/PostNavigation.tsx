import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import type { PostListTypes } from '@/types/common.types';

interface PostNavigationProps {
	/** 시간상 더 예전 글 */
	older: PostListTypes | null;
	/** 시간상 더 최신 글 */
	newer: PostListTypes | null;
}

const cardStyle =
	'group flex flex-1 flex-col gap-1 rounded-lg border border-border p-4 transition hover:border-destructive';

const PostNavigation = ({ older, newer }: PostNavigationProps) => {
	if (!older && !newer) return null;

	return (
		<nav aria-label="이전 다음 글" className="mt-12 flex flex-col gap-3 sm:flex-row">
			{older ? (
				<Link href={`/blog/posts/${older.category}/${older.slug}`} className={cardStyle}>
					<span className="flex items-center gap-1 text-xs text-muted-foreground">
						<ArrowLeft aria-hidden className="size-3" />
						이전 글
					</span>
					<span className="line-clamp-2 text-sm font-medium transition group-hover:text-destructive">
						{older.frontmatter.title}
					</span>
				</Link>
			) : (
				<span className="hidden flex-1 sm:block" />
			)}
			{newer ? (
				<Link
					href={`/blog/posts/${newer.category}/${newer.slug}`}
					className={`${cardStyle} sm:items-end sm:text-right`}>
					<span className="flex items-center gap-1 text-xs text-muted-foreground">
						다음 글
						<ArrowRight aria-hidden className="size-3" />
					</span>
					<span className="line-clamp-2 text-sm font-medium transition group-hover:text-destructive">
						{newer.frontmatter.title}
					</span>
				</Link>
			) : (
				<span className="hidden flex-1 sm:block" />
			)}
		</nav>
	);
};

export default PostNavigation;
