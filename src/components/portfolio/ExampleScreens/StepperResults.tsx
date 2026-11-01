import { CircleCheck, CircleX } from 'lucide-react';

import type { ExampleScreen } from '@/portfolio/examples';
import { cn } from '@/utils/utils';

import { ErrorText, Panel } from './parts';
import type { ExampleTheme } from './theme';

type Data = Extract<ExampleScreen, { kind: 'stepper-results' }>['data'];

/** 4단계 진행 표시(현재 단계 강조)와 일괄 철회 결과(성공·실패를 아이콘·글자·선 모양으로 구분). */
const StepperResults = ({ t, data }: { t: ExampleTheme; data: Data }) => (
	<div className="grid gap-[0.6em]">
		<ol className="grid grid-cols-4 gap-[0.3em]">
			{data.steps.map((step, index) => {
				const current = index === data.current;

				return (
					<li
						key={step}
						className={cn(
							'rounded-[0.4em] px-[0.3em] py-[0.25em] text-center',
							current ? cn('font-bold', t.accentLine, t.accentText) : cn(t.box, t.muted),
						)}>
						<span className="block tabular-nums">{index + 1}단계</span>
						<span className="block break-keep">{step}</span>
					</li>
				);
			})}
		</ol>
		<Panel t={t}>
			<p className={cn('mb-[0.3em] font-bold', t.strong)}>{data.resultsTitle}</p>
			<ul className="grid gap-[0.25em]">
				{data.results.map(result => (
					<li
						key={result.label}
						className={cn(
							'flex items-center justify-between gap-[0.5em] rounded-[0.4em] px-[0.6em] py-[0.2em]',
							result.ok ? t.box : t.errorBox,
						)}>
						<span className={t.strong}>{result.label}</span>
						<span className={cn('flex items-center gap-[0.25em] font-bold', result.ok ? t.muted : t.strong)}>
							{result.ok ? <CircleCheck className="size-[1em]" /> : <CircleX className="size-[1em]" />}
							{result.ok ? '성공' : '실패'}
						</span>
					</li>
				))}
			</ul>
			<ErrorText t={t}>{data.failNotice}</ErrorText>
		</Panel>
	</div>
);

export default StepperResults;
