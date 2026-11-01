import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/utils/utils';

/** 인쇄 문서(/portfolio/print)의 반복 조각. 색은 tailwind.config.ts 의 print-* 토큰, 크기는 pt·mm 임의값을 쓴다. */

/** 연락처·참고 링크 앞의 굵은 라벨. */
export const CONTACT_LABEL_CLASS = 'min-w-[14mm] flex-none font-bold text-print-ink';

/** 표지의 작은 구역 제목(경력·연락처·기술 스택·대표 사례). */
export const PrintLabel = ({ id, children }: { id: string; children: ReactNode }) => (
	<h2 id={id} className="text-[9pt] font-bold tracking-[0.02em] text-print-ink">
		{children}
	</h2>
);

interface PrintSheetProps extends ComponentPropsWithoutRef<'section'> {
	/** 인쇄에서 이 묶음을 새 쪽에서 시작한다(표지는 false). */
	breakBefore?: boolean;
}

/**
 * 인쇄 묶음(표지·사례·마지막 쪽). 화면에서는 점선으로 나눠 미리 보여 주고, 인쇄에서는 여백 없이 새 쪽에서 시작한다.
 * 최소 높이는 표지처럼 한 쪽을 채워야 하는 묶음만 쓰고, 내용만큼 흐르는 묶음은 print:min-h-0 으로 끈다.
 */
export const PrintSheet = ({ breakBefore = true, className, ...props }: PrintSheetProps) => (
	<section
		className={cn(
			'min-h-[250mm] border-b border-dashed border-print-rule py-[6mm] print:border-b-0 print:p-0',
			breakBefore && 'print:break-before-page',
			className,
		)}
		{...props}
	/>
);

interface PrintBlockProps {
	id: string;
	title: string;
	className?: string;
	children: ReactNode;
}

/** 제목 + 본문 구역. 본문 문단은 160mm 폭으로 줄여 읽기 좋은 줄 길이를 지키고, 문단 사이는 1.5mm 띄운다. */
export const PrintBlock = ({ id, title, className, children }: PrintBlockProps) => (
	<section aria-labelledby={id} className={cn('mt-[5mm] [&>p+p]:mt-[1.5mm] [&>p]:max-w-[160mm]', className)}>
		<h3 id={id} className="mb-[1.5mm] text-[11.5pt] font-bold text-print-ink">
			{title}
		</h3>
		{children}
	</section>
);
