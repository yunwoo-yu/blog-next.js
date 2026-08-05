import { CalendarDays } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ViewTransition } from 'react';

import type { CompileMdxTypes } from '@/types/common.types';

interface PostCardTypeProps {
	data: CompileMdxTypes;
	category: string;
	slug: string;
	priority?: boolean;
}

const PostCardType = ({ data, category, slug, priority }: PostCardTypeProps) => {
	return (
		<li className="group h-full overflow-hidden rounded-lg border border-border transition hover:border-destructive hover:shadow-sm">
			<Link href={`/blog/posts/${category}/${slug}`} className="relative flex h-full flex-col">
				<div className="relative aspect-video w-full overflow-hidden">
					<Image
						src={data.thumbnail}
						alt=""
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						sizes="(max-width: 768px) 100vw, 380px"
						priority={priority}
					/>
				</div>
				<div className="flex flex-1 flex-col p-4">
					<ViewTransition name={`post-title-${category}-${slug}`}>
						<h3 className="line-clamp-2 text-lg font-medium transition-colors group-hover:text-destructive">
							{data.title}
						</h3>
					</ViewTransition>
					<p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{data.description}</p>
					<p className="mt-3 flex items-center text-xs text-muted-foreground">
						<CalendarDays aria-hidden className="mr-1 size-3.5" />
						<time dateTime={data.createdAt}>{data.createdAt}</time>
					</p>
				</div>
			</Link>
		</li>
	);
};

export default PostCardType;
