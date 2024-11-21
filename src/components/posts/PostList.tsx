'use client';

import useViewTypesTab from '@/hooks/useViewTypesTab';
import { PostListTypes } from '@/types/common.types';

import ViewToggle from '../common/ViewToggle';
import PostCardType from './PostCardType';
import PostListType from './PostListType';

interface PostListProps {
	posts: PostListTypes[];
}

const PostList = ({ posts }: PostListProps) => {
	const { viewType, onChangeViewType } = useViewTypesTab();

	return (
		<>
			{/* View Type 로컬스토리지 사용 시 깜빡임 이슈 해결 필요 */}
			{viewType && (
				<>
					<ViewToggle viewType={viewType} onChangeViewType={onChangeViewType} />
					<ul className="flex flex-col pt-5">
						{viewType === 'list'
							? posts.map(post => (
									<PostListType
										data={post.frontmatter}
										category={post.category}
										slug={post.slug}
										key={post.frontmatter.title}
									/>
								))
							: posts.map(post => (
									<PostCardType
										data={post.frontmatter}
										category={post.category}
										slug={post.slug}
										key={post.frontmatter.title}
									/>
								))}
					</ul>
				</>
			)}
		</>
	);
};

export default PostList;
