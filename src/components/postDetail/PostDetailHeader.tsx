import { CalendarDays } from 'lucide-react';

import { CompileMdxTypes } from '@/types/common.types';
import { cn } from '@/utils/utils';

interface PostDetailHeaderProps {
	frontmatter: CompileMdxTypes;
}

const PostDetailHeader = ({ frontmatter }: PostDetailHeaderProps) => {
	return (
		<section className="mx-auto max-w-4xl border-b border-border px-5 py-10">
			<h2 className="text-2xl text-primary sm:text-3xl">{frontmatter.title}</h2>
			<div className="mt-2 flex items-start justify-between gap-2 text-sm text-gray-400">
				<span>{frontmatter.description}</span>
				<span className="flex flex-shrink-0 items-center">
					<CalendarDays className="mr-1 size-3 sm:size-4" />
					{frontmatter.createdAt}
				</span>
			</div>
			<div className="mt-2">
				{frontmatter.tags.map((tag, idx) => (
					<span className={cn('text-sm text-destructive', idx && 'ml-1')} key={tag}>
						#{tag}
					</span>
				))}
			</div>
		</section>
	);
};

export default PostDetailHeader;
