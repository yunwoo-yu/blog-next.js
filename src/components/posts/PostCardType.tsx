import { CalendarDays } from 'lucide-react';
import Link from 'next/link';

import { CompileMdxTypes } from '@/types/common.types';

interface PostCardTypeProps {
	data: CompileMdxTypes;
	category: string;
	slug: string;
}

const PostCardType = ({ data, category, slug }: PostCardTypeProps) => {
	return (
		<li className="border border-border transition dark:hover:border-destructive">
			<Link href={`/blog/posts/${category}/${slug}`}>
				<div
					className="relative aspect-video h-full max-h-60 w-full bg-cover bg-center bg-no-repeat"
					style={{
						backgroundImage: `url(${data.thumbnail})`,
					}}
				/>
				<div className="p-4">
					<p className="text-xl">
						{data.title}
						<span></span>
					</p>
					<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{data.description}</p>
					<p className="mt-2 flex items-center text-xs text-gray-400">
						<CalendarDays className="mr-1 size-4" />
						{data.createdAt}
					</p>
				</div>
			</Link>
		</li>
	);
};

export default PostCardType;
