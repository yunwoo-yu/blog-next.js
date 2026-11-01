import { FilePlus, Paperclip } from 'lucide-react';

import type { ExampleScreen } from '@/portfolio/examples';
import { cn } from '@/utils/utils';

import { FakeButton, FieldBlock, Panel } from './parts';
import type { ExampleTheme } from './theme';

type Data = Extract<ExampleScreen, { kind: 'attachment-form' }>['data'];

const FILE_STATE_LABEL = { kept: '기존 · 유지', added: '새 파일 · 추가' } as const;

/** 계약 수정 폼: 관리번호 칸 아래 중복 오류, 기존 첨부 1개 유지 + 새 파일 목록. */
const AttachmentForm = ({ t, data }: { t: ExampleTheme; data: Data }) => (
	<div className={t.split}>
		<FieldBlock t={t} field={data.field} />
		<Panel t={t}>
			<p className={cn('mb-[0.3em] font-bold', t.strong)}>{data.filesLabel}</p>
			<ul className="grid gap-[0.25em]">
				{data.files.map(file => {
					const Icon = file.state === 'kept' ? Paperclip : FilePlus;

					return (
						<li
							key={file.name}
							className={cn(
								'flex items-center gap-[0.35em] rounded-[0.4em] px-[0.5em] py-[0.2em]',
								file.state === 'added' ? cn(t.accentLine, 'bg-white') : t.box,
							)}>
							<Icon className={cn('size-[1em] shrink-0', file.state === 'added' ? t.accentText : t.muted)} />
							<span className={cn('min-w-0 flex-1 truncate', t.strong)}>{file.name}</span>
							<span className={cn('shrink-0', file.state === 'added' ? cn('font-bold', t.accentText) : t.muted)}>
								{FILE_STATE_LABEL[file.state]}
							</span>
						</li>
					);
				})}
			</ul>
			<p className={cn('mt-[0.35em]', t.text)}>{data.note}</p>
			<div className="mt-[0.4em] flex justify-end">
				<FakeButton t={t} primary>
					{data.submit}
				</FakeButton>
			</div>
		</Panel>
	</div>
);

export default AttachmentForm;
