import type { ExampleScreen } from '@/portfolio/examples';
import { cn } from '@/utils/utils';

import { FakeButton, FieldBlock, Panel } from './parts';
import type { ExampleTheme } from './theme';

type Data = Extract<ExampleScreen, { kind: 'form-errors' }>['data'];

/** 입력 폼: 일반 칸과 배열(담당자 목록) 안 항목 모두, 오류 문구가 그 칸 바로 아래에 붙는다. */
const FormErrors = ({ t, data }: { t: ExampleTheme; data: Data }) => (
	<div className="grid gap-[0.6em]">
		<div className={t.split}>
			{data.fields.map(field => (
				<FieldBlock key={field.label} t={t} field={field} />
			))}
		</div>
		<Panel t={t}>
			<p className={cn('mb-[0.3em] font-bold', t.strong)}>{data.group.label}</p>
			<div className={t.split}>
				{data.group.items.map(item => (
					<FieldBlock key={item.label} t={t} field={item} />
				))}
			</div>
		</Panel>
		<div className="flex justify-end">
			<FakeButton t={t} primary>
				{data.submit}
			</FakeButton>
		</div>
	</div>
);

export default FormErrors;
