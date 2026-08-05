import { AlignLeft, Grid2x2 } from 'lucide-react';

import { cn } from '@/utils/utils';
import type { ViewType } from '@/utils/view-type';

interface ViewToggleProps {
	viewType: ViewType;
	onChangeViewType: () => void;
}

const ViewToggle = ({ viewType, onChangeViewType }: ViewToggleProps) => {
	return (
		<article className="flex justify-end">
			<button
				type="button"
				role="switch"
				aria-checked={viewType === 'card'}
				aria-label={viewType === 'list' ? '카드 보기로 전환' : '목록 보기로 전환'}
				className="flex h-8 w-16 rounded bg-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				onClick={onChangeViewType}>
				<div className="relative flex w-full p-1">
					<div
						className={cn(
							'absolute h-6 w-7 rounded bg-background transition',
							viewType === 'list' ? 'translate-x-0' : 'translate-x-[28px]',
						)}
					/>
					<span className="relative z-10 flex flex-1 items-center justify-center">
						<AlignLeft
							aria-hidden
							className={cn(
								'size-5',
								viewType === 'list'
									? 'stroke-foreground dark:stroke-foreground'
									: 'stroke-background dark:stroke-background',
							)}
						/>
					</span>
					<span className="relative z-10 flex flex-1 items-center justify-center">
						<Grid2x2
							aria-hidden
							className={cn(
								'size-5',
								viewType === 'card'
									? 'stroke-foreground dark:stroke-foreground'
									: 'stroke-background dark:stroke-background',
							)}
						/>
					</span>
				</div>
			</button>
		</article>
	);
};

export default ViewToggle;
