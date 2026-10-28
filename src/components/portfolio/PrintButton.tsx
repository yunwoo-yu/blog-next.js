'use client';

import { cn } from '@/utils/utils';

import { FOCUS_RING, PRIMARY_BUTTON_CLASS } from './ui';

/** 브라우저 인쇄 대화상자를 연다. 거기서 "PDF로 저장"을 고른다. 화면에서만 보인다. */
const PrintButton = () => (
	<button
		type="button"
		onClick={() => window.print()}
		className={cn(
			'inline-flex h-11 items-center rounded-xl px-5 text-[15px] font-bold transition-colors print:hidden',
			PRIMARY_BUTTON_CLASS,
			FOCUS_RING,
		)}>
		PDF로 저장
	</button>
);

export default PrintButton;
