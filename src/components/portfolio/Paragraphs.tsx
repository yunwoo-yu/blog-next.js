import type { ReactNode } from 'react';

import { cn } from '@/utils/utils';

/** 빈 줄(\n\n)로 나눈 본문을 문단 여러 개로 그린다. 빈 줄이 없으면 문단 하나다. */
export const splitParagraphs = (text: string) =>
	text
		.split(/\n{2,}/)
		.map(part => part.trim())
		.filter(Boolean);

interface ParagraphsProps {
	text: string;
	className?: string;
	/** 문단 하나를 그리는 방식. 강조·링크를 문단마다 적용할 때 쓴다. */
	render?: (paragraph: string) => ReactNode;
}

const Paragraphs = ({ text, className, render }: ParagraphsProps) => (
	<>
		{splitParagraphs(text).map((paragraph, index) => (
			<p key={index} className={cn('break-keep', index > 0 && 'mt-4', className)}>
				{render ? render(paragraph) : paragraph}
			</p>
		))}
	</>
);

export default Paragraphs;
