import { AlignLeft, Grid2x2 } from 'lucide-react';

import { ViewType } from '@/hooks/useViewTypesTab';
import { cn } from '@/utils/utils';

interface ViewToggleProps {
	viewType: ViewType;
	onChangeViewType: () => void;
}

const ViewToggle = ({ viewType, onChangeViewType }: ViewToggleProps) => {
	return (
		<section className="flex justify-end">
			<article className="flex h-8 w-16 cursor-pointer rounded bg-foreground" onClick={onChangeViewType}>
				<div className="relative flex w-full p-1">
					<div
						className={cn(
							'absolute h-6 w-7 rounded bg-background transition',
							viewType === 'list' ? 'translate-x-0' : 'translate-x-[28px]',
						)}
					/>
					<span className="relative z-10 flex flex-1 items-center justify-center">
						<AlignLeft
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
							className={cn(
								'size-5',
								viewType === 'card'
									? 'stroke-foreground dark:stroke-foreground'
									: 'stroke-background dark:stroke-background',
							)}
						/>
					</span>
				</div>
			</article>
		</section>
	);
};

export default ViewToggle;
