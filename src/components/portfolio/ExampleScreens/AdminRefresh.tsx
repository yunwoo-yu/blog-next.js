import { RefreshCw } from 'lucide-react';

import type { ExampleScreen } from '@/portfolio/examples';
import { cn } from '@/utils/utils';

import type { ExampleTheme } from './theme';

type Data = Extract<ExampleScreen, { kind: 'admin-refresh' }>['data'];

/** 관리 화면 목록 + 위쪽 "로그인 정보 갱신 중" 상태 줄. 표는 장식이라 table 대신 격자로 그린다. */
const AdminRefresh = ({ t, data }: { t: ExampleTheme; data: Data }) => (
	<div className="grid gap-[0.5em]">
		<div
			className={cn('flex items-start gap-[0.4em] rounded-[0.5em] px-[0.7em] py-[0.4em]', t.accentLine, t.accentFill)}>
			<RefreshCw className={cn('mt-[0.15em] size-[1.1em] shrink-0', t.accentText)} />
			<p>
				<span className={cn('font-bold', t.accentText)}>{data.status}</span>{' '}
				<span className={t.text}>{data.statusNote}</span>
			</p>
		</div>
		<div className={cn('rounded-[0.5em] px-[0.7em]', t.box)}>
			{[data.columns, ...data.rows].map((row, index) => (
				<p
					key={row.join('-')}
					className={cn(
						'grid grid-cols-[3em_1fr_4em] gap-[0.5em] py-[0.25em]',
						index > 0 ? cn('border-t', t.rule, t.strong) : cn('font-bold', t.muted),
					)}>
					{row.map(cell => (
						<span key={cell}>{cell}</span>
					))}
				</p>
			))}
		</div>
	</div>
);

export default AdminRefresh;
