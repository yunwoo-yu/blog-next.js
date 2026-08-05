import Link from 'next/link';

import type { CategoryDataTypes } from '@/types/common.types';
import { cn } from '@/utils/utils';

interface CategoryVerticalListProps {
	categoryData: CategoryDataTypes;
	category?: string;
}

const itemStyle = 'flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-muted-foreground transition';

const activeItemStyle = 'bg-destructive/10 font-medium text-destructive';

const CategoryVerticalList = ({ categoryData, category }: CategoryVerticalListProps) => {
	const { categoryNameList, allCount } = categoryData;

	// -ml-2는 항목 좌측 패딩을 상쇄해 페이지 제목과 텍스트 시작선을 맞추기 위한 것이다.
	return (
		<aside className="-ml-2 hidden w-full max-w-[178px] shrink-0 self-start md:sticky md:top-28 md:block">
			<nav aria-label="카테고리 목록">
				<p className="border-b border-border px-2 pb-2 text-sm font-bold uppercase tracking-wide text-foreground">
					Categories
				</p>
				<ul className="pt-2 text-sm">
					<li>
						<Link
							href="/blog/posts"
							className={cn(itemStyle, !category ? activeItemStyle : 'hover:bg-muted hover:text-foreground')}>
							<span>전체 보기</span>
							<span className="text-xs tabular-nums">{allCount}</span>
						</Link>
					</li>
					{categoryNameList.map(categoryName => (
						<li key={categoryName.label}>
							<Link
								href={`/blog/posts/${categoryName.label}`}
								className={cn(
									itemStyle,
									category === categoryName.label ? activeItemStyle : 'hover:bg-muted hover:text-foreground',
								)}>
								<span className="truncate">{categoryName.label}</span>
								<span className="text-xs tabular-nums">{categoryName.count}</span>
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
};

export default CategoryVerticalList;
