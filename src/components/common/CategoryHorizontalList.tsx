import Link from 'next/link';

import type { CategoryDataTypes } from '@/types/common.types';
import { cn } from '@/utils/utils';

interface CategoryHorizontalListProps {
	categoryData: CategoryDataTypes;
	category?: string;
}

const chipStyle =
	'inline-flex whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition hover:border-destructive hover:text-destructive';

const activeChipStyle = 'border-destructive bg-destructive/10 font-medium text-destructive';

/** 모바일 전용 카테고리 필터. 데스크톱은 CategoryVerticalList가 담당한다. */
const CategoryHorizontalList = ({ categoryData, category }: CategoryHorizontalListProps) => {
	const { categoryNameList, allCount } = categoryData;

	return (
		<nav aria-label="카테고리 필터" className="-mx-5 md:hidden">
			<ul className="flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-hide">
				<li>
					<Link href="/blog/posts" className={cn(chipStyle, !category && activeChipStyle)}>
						전체 {allCount}
					</Link>
				</li>
				{categoryNameList.map(categoryName => (
					<li key={categoryName.label}>
						<Link
							href={`/blog/posts/${categoryName.label}`}
							className={cn(chipStyle, category === categoryName.label && activeChipStyle)}>
							{categoryName.label} {categoryName.count}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default CategoryHorizontalList;
