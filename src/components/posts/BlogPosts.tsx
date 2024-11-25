'use client';

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
			<ul className={cn('pt-5', viewType === 'list' ? 'flex flex-col' : 'grid gap-5 sm:grid-cols-1 md:grid-cols-2')}>
				{posts.map(post => (
					<>
						{viewType === 'list' ? (
							<PostListType
								data={post.frontmatter}
								category={post.category}
								slug={post.slug}
								key={post.frontmatter.title}
							/>
						) : (
							<PostCardType
								data={post.frontmatter}
								category={post.category}
								slug={post.slug}
								key={post.frontmatter.title}
							/>
						)}
					</>
				))}
			</ul>
		</section>
	);
};

export default BlogPosts;
