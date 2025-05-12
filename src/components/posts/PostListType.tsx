import Image from 'next/image';
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
		<li className="flex cursor-pointer flex-col border-t border-gray-400">
			<Link href={`/blog/posts/${category}/${slug}`} className="flex justify-between px-2 py-5">
				<div>
					<h3 className="text-lg">{data.title}</h3>
					<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{data.description}</p>
					<div className="mt-3 flex text-xs">
						<span className="text-gray-400">{data.createdAt}</span>
						<div>
							{data.tags.map((tag, idx) => (
								<span className={cn('text-destructive', !idx ? 'ml-2' : 'ml-1')} key={slug + tag}>
									#{tag}
								</span>
							))}
						</div>
					</div>
				</div>
				<div className="relative hidden aspect-video w-full max-w-36 sm:block">
					<Image src={data.thumbnail} alt="post thumbnail" fill className="object-cover" sizes="144px" priority />
				</div>
			</Link>
		</li>
	);
};

export default PostListType;
