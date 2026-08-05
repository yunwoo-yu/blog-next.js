import { ChevronLeft, ChevronRight } from 'lucide-react';

import { getPageRange } from '@/utils/pagination';
import { cn } from '@/utils/utils';

interface PaginationProps {
	page: number;
	totalPages: number;
	onChangePage: (page: number) => void;
}

const controlStyle =
	'flex size-9 items-center justify-center rounded-md border border-border text-sm transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40';

const Pagination = ({ page, totalPages, onChangePage }: PaginationProps) => {
	if (totalPages <= 1) return null;

	return (
		<nav aria-label="페이지 목록" className="mt-10 flex items-center justify-center gap-1">
			<button
				type="button"
				aria-label="이전 페이지"
				disabled={page === 1}
				onClick={() => onChangePage(page - 1)}
				className={controlStyle}>
				<ChevronLeft aria-hidden className="size-4" />
			</button>
			{getPageRange(page, totalPages).map((item, index) =>
				item === 'ellipsis' ? (
					<span
						key={`ellipsis-${index}`}
						aria-hidden
						className="flex size-9 items-center justify-center text-sm text-muted-foreground">
						…
					</span>
				) : (
					<button
						key={item}
						type="button"
						aria-label={`${item}페이지`}
						aria-current={item === page ? 'page' : undefined}
						onClick={() => onChangePage(item)}
						className={cn(
							controlStyle,
							item === page && 'border-destructive bg-destructive/10 font-medium text-destructive',
						)}>
						{item}
					</button>
				),
			)}
			<button
				type="button"
				aria-label="다음 페이지"
				disabled={page === totalPages}
				onClick={() => onChangePage(page + 1)}
				className={controlStyle}>
				<ChevronRight aria-hidden className="size-4" />
			</button>
		</nav>
	);
};

export default Pagination;
