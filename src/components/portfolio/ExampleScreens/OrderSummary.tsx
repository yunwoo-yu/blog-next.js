import { ServerCog } from 'lucide-react';

import type { ExampleScreen } from '@/portfolio/examples';
import { cn } from '@/utils/utils';

import { FakeButton, Panel, ValueRow } from './parts';
import type { ExampleTheme } from './theme';

type Data = Extract<ExampleScreen, { kind: 'order-summary' }>['data'];

/** 주문 요약: 왼쪽 금액 내역, 오른쪽 화면 합계(표시용)와 서버 확정 결제 금액·결제 버튼. */
const OrderSummary = ({ t, data }: { t: ExampleTheme; data: Data }) => (
	<div className={t.split}>
		<Panel t={t} className="grid content-start gap-[0.25em]">
			{data.lines.map(line => (
				<ValueRow key={line.label} t={t} label={line.label} value={line.value} />
			))}
		</Panel>
		<div className="grid content-start gap-[0.4em]">
			<div className={cn('rounded-[0.5em] px-[0.7em] py-[0.4em]', t.box)}>
				<ValueRow t={t} label={data.displayTotal.label} value={data.displayTotal.value} />
			</div>
			<div className={cn('rounded-[0.5em] px-[0.7em] py-[0.4em]', t.accentLine, t.accentFill)}>
				<ValueRow t={t} label={data.confirmedTotal.label} value={data.confirmedTotal.value} />
			</div>
			<FakeButton t={t} primary className="w-full">
				{data.button}
			</FakeButton>
			<p className={cn('flex items-center gap-[0.3em]', t.accentText)}>
				<ServerCog className="size-[1.1em] shrink-0" />
				{data.note}
			</p>
		</div>
	</div>
);

export default OrderSummary;
