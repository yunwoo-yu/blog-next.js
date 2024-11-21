import Link from 'next/link';

import { CompileMdxTypes } from '@/types/common.types';
import { cn } from '@/utils/utils';

interface PostListTypeProps {
	data: CompileMdxTypes;
	category: string;
	slug: string;
}

const PostListType = ({ data, category, slug }: PostListTypeProps) => {
	return (
		<li className="flex cursor-pointer flex-col border-t border-gray-400 px-2 py-5">
			<Link href={`/blog/posts/${category}/${slug}`}>
				<p className="text-xl">{data.title}</p>
				<div className="my-1 flex text-xs">
					<span className="text-gray-400">{data.createdAt}</span>
					<div>
						{data.tags.map((tag, idx) => (
							<span className={cn('text-gray-500', !idx ? 'ml-2' : 'ml-1')} key={slug + tag}>
								#{tag}
							</span>
						))}
					</div>
				</div>
				<p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{data.description}</p>
			</Link>
		</li>
	);
};

export default PostListType;
