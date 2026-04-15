'use client';

import { ViewTransition } from 'react';

import AdSlot from '@/components/common/AdSlot';
import useViewTypesTab from '@/hooks/useViewTypesTab';
import type { PostListTypes } from '@/types/common.types';
import { cn } from '@/utils/utils';

import PostCardType from './PostCardType';
import PostListType from './PostListType';
import ViewToggle from './ViewToggle';

interface BlogPostsProps {
	posts: PostListTypes[];
}

const BlogPosts = ({ posts }: BlogPostsProps) => {
	const { viewType, onChangeViewType } = useViewTypesTab();

	return (
		<section className="flex-1">
			<ViewToggle viewType={viewType} onChangeViewType={onChangeViewType} />
			<ViewTransition>
				<ul
					className={cn(
						'w-full pt-5',
						viewType === 'list' ? 'flex flex-col' : 'grid gap-5 sm:grid-cols-1 md:grid-cols-2',
					)}>
					{posts.map(post => (
						<ViewTransition key={post.frontmatter.title} name={`post-item-${post.category}-${post.slug}`}>
							{viewType === 'list' ? (
								<PostListType data={post.frontmatter} category={post.category} slug={post.slug} />
							) : (
								<PostCardType data={post.frontmatter} category={post.category} slug={post.slug} />
							)}
						</ViewTransition>
					))}
				</ul>
			</ViewTransition>
			<AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_POST_LIST} className="mt-16" />
		</section>
	);
};

export default BlogPosts;
