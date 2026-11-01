import { History } from 'lucide-react';

import type { ExampleScreen } from '@/portfolio/examples';
import { cn } from '@/utils/utils';

import { FakeButton } from './parts';
import type { ExampleTheme } from './theme';

type Data = Extract<ExampleScreen, { kind: 'confirm-modal' }>['data'];

/** 회색으로 가려진 기부 화면 위의 확인 창. 이력(기관·금액·일시)과 두 가지 선택지. */
const ConfirmModal = ({ t, data }: { t: ExampleTheme; data: Data }) => (
	<div className={cn('flex justify-center rounded-[0.6em] px-[0.75em] py-[0.6em]', t.skeleton)}>
		<div className={cn('w-full max-w-[32em] rounded-[0.7em] p-[0.7em]', t.box)}>
			<p className={cn('flex items-center gap-[0.35em] font-bold', t.strong)}>
				<History className={cn('size-[1.1em] shrink-0', t.accentText)} />
				{data.heading}
			</p>
			<dl className={cn('mt-[0.4em] grid grid-cols-3 gap-[0.5em] rounded-[0.5em] px-[0.6em] py-[0.35em]', t.surface)}>
				{data.rows.map(row => (
					<div key={row.label}>
						<dt className={t.muted}>{row.label}</dt>
						<dd className={cn('font-bold tabular-nums', t.strong)}>{row.value}</dd>
					</div>
				))}
			</dl>
			<div className="mt-[0.45em] flex flex-wrap items-center justify-between gap-[0.4em]">
				<p className={t.text}>{data.question}</p>
				<span className="flex gap-[0.4em]">
					<FakeButton t={t}>{data.cancel}</FakeButton>
					<FakeButton t={t} primary>
						{data.confirm}
					</FakeButton>
				</span>
			</div>
		</div>
	</div>
);

export default ConfirmModal;
