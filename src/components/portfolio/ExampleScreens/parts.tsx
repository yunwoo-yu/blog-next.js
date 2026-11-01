import { CircleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

import type { ExampleField } from '@/portfolio/examples';
import { cn } from '@/utils/utils';

import type { ExampleTheme } from './theme';

/**
 * 예시 화면 본문의 반복 조각. 모두 서버 컴포넌트이고 보이는 모양만 흉내 낸다.
 * 버튼·입력은 실제 요소(button·input)가 아니라 span·div 라 초점이 가지 않고 누를 수도 없다.
 */

interface ThemeProps {
	t: ExampleTheme;
	className?: string;
	children?: ReactNode;
}

/** 화면 맨 위의 앱 이름 줄. 제목 요소가 아니라 문서 제목 순서에 끼지 않는다. */
export const ScreenTitle = ({ t, children }: ThemeProps) => (
	<p className={cn('mb-[0.6em] font-bold', t.strong)}>{children}</p>
);

export const Panel = ({ t, className, children }: ThemeProps) => (
	<div className={cn('rounded-[0.6em] p-[0.7em]', t.surface, className)}>{children}</div>
);

export const FakeButton = ({ t, primary, className, children }: ThemeProps & { primary?: boolean }) => (
	<span
		className={cn(
			'inline-flex items-center justify-center rounded-[0.5em] px-[0.9em] py-[0.35em] font-bold',
			primary ? t.accentSolid : cn(t.box, t.strong),
			className,
		)}>
		{children}
	</span>
);

/** 오류 문구. 색에 기대지 않도록 아이콘과 "오류" 라벨을 붙인다. */
export const ErrorText = ({ t, children }: ThemeProps) => (
	<p className={cn('mt-[0.3em] flex items-start gap-[0.3em] font-bold', t.strong)}>
		<CircleAlert className="mt-[0.2em] size-[1em] shrink-0" strokeWidth={2.5} />
		<span>
			<span className="mr-[0.3em] underline decoration-dashed underline-offset-2">오류</span>
			{children}
		</span>
	</p>
);

/** 라벨 + 입력 칸 + (있으면) 바로 아래 오류 문구. */
export const FieldBlock = ({ t, field, className }: { t: ExampleTheme; field: ExampleField; className?: string }) => (
	<div className={className}>
		<p className={cn('mb-[0.2em]', t.muted)}>{field.label}</p>
		<div className={cn('rounded-[0.4em] px-[0.6em] py-[0.3em]', field.error ? t.errorBox : t.box, t.strong)}>
			{field.value || <span className={t.muted}>비어 있음</span>}
		</div>
		{field.error && <ErrorText t={t}>{field.error}</ErrorText>}
	</div>
);

/** 라벨과 값이 양 끝에 놓인 한 줄. */
export const ValueRow = ({
	t,
	label,
	value,
	className,
}: {
	t: ExampleTheme;
	label: string;
	value: string;
	className?: string;
}) => (
	<p className={cn('flex justify-between gap-[0.75em]', className)}>
		<span className={t.muted}>{label}</span>
		<span className={cn('font-bold tabular-nums', t.strong)}>{value}</span>
	</p>
);

/** 강조 테두리로 감싼 작은 표시. 주소 줄의 같은 값과 짝을 이룬다. */
export const Marked = ({ t, className, children }: ThemeProps) => (
	<span className={cn('rounded-[0.35em] px-[0.25em]', t.accentLine, t.accentText, className)}>{children}</span>
);
