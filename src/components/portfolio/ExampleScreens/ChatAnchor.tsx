import { ImageIcon, Pin } from 'lucide-react';

import type { ExampleScreen } from '@/portfolio/examples';
import { cn } from '@/utils/utils';

import { Panel } from './parts';
import type { ExampleTheme } from './theme';

type Data = Extract<ExampleScreen, { kind: 'chat-anchor' }>['data'];

/** 챗 화면(위에 붙은 이전 대화 + 같은 자리에 있는 읽던 메시지)과 고객사별 링크 미리보기 카드. */
const ChatAnchor = ({ t, data }: { t: ExampleTheme; data: Data }) => (
	<div className={t.split}>
		<Panel t={t} className="grid content-start gap-[0.35em]">
			<p className={cn('border-b border-dashed pb-[0.2em] text-center', t.rule, t.muted)}>{data.loadedNotice}</p>
			{data.older.map((message, index) => (
				<p
					key={message}
					className={cn(
						'w-fit max-w-[85%] rounded-[0.6em] px-[0.6em] py-[0.2em]',
						t.box,
						t.muted,
						index % 2 === 0 && 'justify-self-end',
					)}>
					{message}
				</p>
			))}
			<div className={cn('rounded-[0.6em] px-[0.6em] py-[0.3em]', t.accentLine, 'bg-white')}>
				<p className={cn('flex items-center gap-[0.25em] font-bold', t.accentText)}>
					<Pin className="size-[1em] shrink-0" />
					{data.anchor.label}
				</p>
				<p className={t.strong}>{data.anchor.text}</p>
			</div>
		</Panel>
		<div className="grid content-start gap-[0.3em]">
			<p className={cn('font-bold', t.muted)}>{data.preview.label}</p>
			<div className={cn('overflow-hidden rounded-[0.6em]', t.box)}>
				<div className={cn('flex h-[4.5em] items-center justify-center gap-[0.3em]', t.skeleton, t.muted)}>
					<ImageIcon className="size-[1.2em]" />
					{data.preview.imageLabel}
				</div>
				<div className="px-[0.7em] py-[0.4em]">
					<p className={cn('font-bold', t.strong)}>{data.preview.title}</p>
					<p className={t.text}>{data.preview.description}</p>
					<p className={t.muted}>{data.preview.host}</p>
				</div>
			</div>
		</div>
	</div>
);

export default ChatAnchor;
