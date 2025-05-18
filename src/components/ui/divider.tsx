import { cn } from '@/utils/utils';
import React, { HTMLAttributes } from 'react';

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
	strokeWidth?: number;
}

export default function Divider({ strokeWidth = 1, ...props }: DividerProps) {
	return (
		<div
			className={cn('divider-print my-5 w-full bg-destructive print:bg-destructive', props.className)}
			style={{ height: `${strokeWidth}px` }}
		/>
	);
}
