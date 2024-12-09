import Link from 'next/link';

import { CategoryDataTypes } from '@/types/common.types';
import { cn } from '@/utils/utils';

interface CategoryVerticalListProps {
	categoryData: CategoryDataTypes;
	category?: string;
}

const CategoryVerticalList = async ({ categoryData, category }: CategoryVerticalListProps) => {
	const { categoryNameList, allCount } = categoryData;

	return (
		<aside className="hidden w-full max-w-[150px] pt-[52px] md:block">
			<p className="border-b border-border pb-1 text-base font-bold text-foreground">카테고리 목록</p>
			<ul className="pt-2 text-sm">
				<li className={'mb-2'}>
					<Link
						href={`/blog/posts`}
						className={cn('text-gray-400 hover:underline', !category && 'text-destructive hover:no-underline')}>
						전체 보기 ({allCount})
					</Link>
				</li>
				{categoryNameList.map(categoryName => (
					<li key={categoryName.label} className="mb-2">
						<Link
							href={`/blog/posts/${categoryName.label}`}
							className={cn(
								'text-gray-400 hover:underline',
								category === categoryName.label && 'text-destructive hover:no-underline',
							)}>
							{categoryName.label} ({categoryName.count})
						</Link>
					</li>
				))}
			</ul>
		</aside>
	);
};

export default CategoryVerticalList;
