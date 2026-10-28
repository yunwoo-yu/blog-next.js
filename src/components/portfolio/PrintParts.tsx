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
	/** 화면에서 쪽 구분선과 종이 높이를 보이고, 인쇄에서는 이 쪽을 새 쪽에서 시작한다(표지는 false). */
	breakBefore?: boolean;
}

/** 인쇄 한 쪽. 화면에서는 점선으로 쪽을 나눠 미리 보여 주고, 인쇄에서는 여백 없이 새 쪽에서 시작한다. */
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
	/** 11pt 소제목(선택 이유·한계). 기본은 13pt. */
	subhead?: boolean;
	className?: string;
	children: ReactNode;
}

/** 제목 + 본문 구역. 본문 문단은 160mm 폭으로 줄여 읽기 좋은 줄 길이를 지키고, 문단 사이는 2.5mm 띄운다. */
export const PrintBlock = ({ id, title, subhead, className, children }: PrintBlockProps) => (
	<section aria-labelledby={id} className={cn('mt-[11mm] [&>p+p]:mt-[2.5mm] [&>p]:max-w-[160mm]', className)}>
		<h3 id={id} className={cn('text-print-ink font-bold', subhead ? 'mb-[2mm] text-[11pt]' : 'mb-[2.5mm] text-[13pt]')}>
			{title}
		</h3>
		{children}
	</section>
);
