import { CalendarDays } from 'lucide-react';
import { ViewTransition } from 'react';

import type { CompileMdxTypes } from '@/types/common.types';
import { cn } from '@/utils/utils';

interface PostDetailHeaderProps {
	frontmatter: CompileMdxTypes;
	category: string;
	slug: string;
}

const PostDetailHeader = ({ frontmatter, category, slug }: PostDetailHeaderProps) => {
	return (
		<section className="mx-auto max-w-4xl border-b border-border px-5 py-10">
			<ViewTransition name={`post-title-${category}-${slug}`}>
				<h2 className="text-2xl text-primary sm:text-3xl">{frontmatter.title}</h2>
			</ViewTransition>
			<div className="mt-2 flex items-start justify-between gap-2 text-sm text-gray-400">
				<ViewTransition name={`post-desc-${category}-${slug}`}>
					<span>{frontmatter.description}</span>
				</ViewTransition>
				<ViewTransition name={`post-date-${category}-${slug}`}>
					<span className="flex flex-shrink-0 items-center">
						<CalendarDays className="mr-1 size-3 sm:size-4" />
						{frontmatter.createdAt}
					</span>
				</ViewTransition>
			</div>
			<ViewTransition name={`post-tags-${category}-${slug}`}>
				<div className="mt-2">
					{frontmatter.tags.map((tag, idx) => (
						<span className={cn('text-sm text-destructive', idx && 'ml-1')} key={tag}>
							#{tag}
						</span>
					))}
				</div>
			</ViewTransition>
		</section>
	);
};

export default PostDetailHeader;
