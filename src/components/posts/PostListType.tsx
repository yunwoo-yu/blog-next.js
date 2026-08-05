import Image from 'next/image';
import Link from 'next/link';
import { ViewTransition } from 'react';

import TagLink from '@/components/common/TagLink';
import type { CompileMdxTypes } from '@/types/common.types';

interface PostListTypeProps {
	data: CompileMdxTypes;
	category: string;
	slug: string;
	priority?: boolean;
}

/**
 * 행 전체를 글 링크로 쓰되 태그는 따로 눌러야 한다.
 * 앵커를 중첩할 수 없으므로 제목 링크의 ::after를 행 전체에 덮고,
 * 태그 줄만 z-index로 그 위에 올려 각자 클릭되게 한다.
 */
const PostListType = ({ data, category, slug, priority }: PostListTypeProps) => {
	return (
		<li className="group relative flex flex-col border-b border-border first:border-t">
			<div className="flex justify-between gap-4 rounded-md px-2 py-5 transition-colors group-hover:bg-muted/50">
				<div className="min-w-0">
					<ViewTransition name={`post-title-${category}-${slug}`}>
						<h3 className="text-lg font-medium transition-colors group-hover:text-destructive">
							<Link
								href={`/blog/posts/${category}/${slug}`}
								className="after:absolute after:inset-0 after:content-['']">
								{data.title}
							</Link>
						</h3>
					</ViewTransition>
					<p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{data.description}</p>
					<div className="relative z-10 mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
						<time dateTime={data.createdAt} className="text-muted-foreground">
							{data.createdAt}
						</time>
						<div className="flex flex-wrap gap-1">
							{data.tags.map(tag => (
								<TagLink key={slug + tag} tag={tag} />
							))}
						</div>
					</div>
				</div>
				<div className="relative hidden aspect-video w-36 shrink-0 overflow-hidden rounded-md sm:block">
					<Image
						src={data.thumbnail}
						alt=""
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						sizes="144px"
						priority={priority}
					/>
				</div>
			</div>
		</li>
	);
};

export default PostListType;
