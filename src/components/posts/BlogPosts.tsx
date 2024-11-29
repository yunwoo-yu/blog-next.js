'use client';

import { Fragment } from 'react';

import useViewTypesTab from '@/hooks/useViewTypesTab';
import { PostListTypes } from '@/types/common.types';
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
			<ul
				className={cn(
					'w-full pt-5',
					viewType === 'list' ? 'flex flex-col' : 'grid gap-5 sm:grid-cols-1 md:grid-cols-2',
				)}>
				{posts.map(post => (
					<Fragment key={post.frontmatter.title}>
						{viewType === 'list' ? (
							<PostListType data={post.frontmatter} category={post.category} slug={post.slug} />
						) : (
							<PostCardType data={post.frontmatter} category={post.category} slug={post.slug} />
						)}
					</Fragment>
				))}
			</ul>
		</section>
	);
};

export default BlogPosts;
