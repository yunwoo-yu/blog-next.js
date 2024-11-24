import { CalendarDays } from 'lucide-react';

import CustomMDXRemote from '@/components/common/CustomMDXRemote';
import { getPostDetail } from '@/utils/post-utils';
import { cn } from '@/utils/utils';

interface Params {
	params: Promise<{ category: string; slug: string }>;
}

const PostDetailPage = async ({ params }: Params) => {
	const { category, slug } = await params;
	const { source, frontmatter } = await getPostDetail(category, slug);

	return (
		<>
			<section className="mx-auto max-w-5xl border-b border-border px-5 py-10">
				<h1 className="text-3xl text-primary">{frontmatter.title}</h1>
				<div className="mt-2 flex justify-between text-sm text-gray-400">
					<span>{frontmatter.description}</span>
					<span className="flex items-center">
						<CalendarDays className="mr-1 size-4" />
						{frontmatter.createdAt}
					</span>
				</div>
				<div className="mt-2">
					{frontmatter.tags.map((tag, idx) => (
						<span className={cn('text-sm text-gray-500', idx && 'ml-1')} key={slug + tag}>
							#{tag}
						</span>
					))}
				</div>
			</section>
			<section className="prose mx-auto max-w-4xl px-5 py-10 dark:prose-invert">
				<CustomMDXRemote source={source} />
			</section>
		</>
	);
};

export default PostDetailPage;
