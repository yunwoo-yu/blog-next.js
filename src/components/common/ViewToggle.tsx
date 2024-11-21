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
			<article className="flex h-10 w-20 cursor-pointer rounded bg-foreground" onClick={onChangeViewType}>
				<div className="relative flex w-full p-1">
					<div
						className={cn(
							'absolute h-8 w-9 rounded bg-background transition',
							viewType === 'list' ? 'translate-x-0' : 'translate-x-[36px]',
						)}
					/>
					<span className="relative z-10 flex flex-1 items-center justify-center">
						<AlignLeft
							className={
								viewType === 'list'
									? 'stroke-background dark:stroke-foreground'
									: 'stroke-foreground dark:stroke-background'
							}
						/>
					</span>
					<span className="relative z-10 flex flex-1 items-center justify-center">
						<Grid2x2
							className={
								viewType === 'card'
									? 'stroke-background dark:stroke-foreground'
									: 'stroke-foreground dark:stroke-background'
							}
						/>
					</span>
				</div>
			</article>
		</section>
	);
};

export default ViewToggle;
