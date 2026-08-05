import { CalendarDays, ChevronLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import { ViewTransition } from 'react';

import TagLink from '@/components/common/TagLink';
import type { CompileMdxTypes } from '@/types/common.types';

interface PostDetailHeaderProps {
	frontmatter: CompileMdxTypes;
	category: string;
	slug: string;
	readingTime: number;
}

const PostDetailHeader = ({ frontmatter, category, slug, readingTime }: PostDetailHeaderProps) => {
	return (
		<section className="mx-auto max-w-3xl border-b border-border px-5 pb-8 pt-10">
			<Link
				href={`/blog/posts/${category}`}
				className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-destructive">
				<ChevronLeft aria-hidden className="size-4" />
				{category}
			</Link>
			<ViewTransition name={`post-title-${category}-${slug}`}>
				<h2 className="mt-3 text-2xl font-bold leading-snug text-primary sm:text-3xl">{frontmatter.title}</h2>
			</ViewTransition>
			<p className="mt-2 text-sm text-muted-foreground sm:text-base">{frontmatter.description}</p>
			<div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
				<span className="flex items-center gap-1">
					<CalendarDays aria-hidden className="size-3.5" />
					<time dateTime={frontmatter.createdAt}>{frontmatter.createdAt}</time>
				</span>
				<span className="flex items-center gap-1">
					<Clock aria-hidden className="size-3.5" />약 {readingTime}분
				</span>
				<div className="flex flex-wrap gap-1">
					{frontmatter.tags.map(tag => (
						<TagLink key={tag} tag={tag} />
					))}
				</div>
			</div>
		</section>
	);
};

export default PostDetailHeader;
