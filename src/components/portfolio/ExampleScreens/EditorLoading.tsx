import { Box } from 'lucide-react';

import type { ExampleScreen } from '@/portfolio/examples';
import { cn } from '@/utils/utils';

import { Panel } from './parts';
import type { ExampleTheme } from './theme';

type Data = Extract<ExampleScreen, { kind: 'editor-loading' }>['data'];

/** 편집 화면: 왼쪽 파츠 목록은 그려져 있고, 오른쪽 3D 영역만 로딩 자리(스켈레톤)로 남아 있다. */
const EditorLoading = ({ t, data }: { t: ExampleTheme; data: Data }) => (
	<div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-[0.75em]">
		<Panel t={t} className="grid grid-cols-2 content-start gap-[0.3em]">
			{data.parts.map(part => (
				<span
					key={part.label}
					className={cn(
						'rounded-[0.4em] px-[0.6em] py-[0.2em]',
						part.selected ? cn('font-bold', t.accentLine, t.accentText, 'bg-white') : cn(t.box, t.strong),
					)}>
					{part.label}
				</span>
			))}
		</Panel>
		<div className="grid content-start gap-[0.35em]">
			<div
				className={cn(
					'flex min-h-[5em] flex-col items-center justify-center gap-[0.3em] rounded-[0.6em]',
					t.box,
					'border-dashed',
					t.surface,
				)}>
				<Box className={cn('size-[1.8em]', t.muted)} strokeWidth={1.5} />
				<span className={cn('h-[0.5em] w-1/2 rounded-full', t.skeleton)} />
				<span className={cn('h-[0.5em] w-1/3 rounded-full', t.skeleton)} />
				<span className={t.muted}>{data.loadingLabel}</span>
			</div>
			<p className={cn('font-bold', t.accentText)}>{data.note}</p>
		</div>
	</div>
);

export default EditorLoading;
