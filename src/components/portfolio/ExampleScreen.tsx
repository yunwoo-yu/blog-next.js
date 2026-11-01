import { EXAMPLE_DISCLAIMER, EXAMPLE_LABEL, type ExampleScreen as ExampleScreenData } from '@/portfolio/examples';
import { cn } from '@/utils/utils';

import AdminRefresh from './ExampleScreens/AdminRefresh';
import AttachmentForm from './ExampleScreens/AttachmentForm';
import ChatAnchor from './ExampleScreens/ChatAnchor';
import ConfirmModal from './ExampleScreens/ConfirmModal';
import EditorLoading from './ExampleScreens/EditorLoading';
import FormErrors from './ExampleScreens/FormErrors';
import OrderSummary from './ExampleScreens/OrderSummary';
import { ScreenTitle } from './ExampleScreens/parts';
import SearchUrl from './ExampleScreens/SearchUrl';
import StepperResults from './ExampleScreens/StepperResults';
import { EXAMPLE_THEMES, type ExampleTheme, type ExampleVariant } from './ExampleScreens/theme';

interface ExampleScreenProps {
	example: ExampleScreenData;
	/** web: 사례 상세(pf-* 토큰·px), print: PDF(print-* 토큰·pt) */
	variant?: ExampleVariant;
	className?: string;
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** 주소를 강조할 부분과 나머지로 자른다. */
const splitMarks = (text: string, marks: string[] = []) =>
	marks.length === 0 ? [text] : text.split(new RegExp(`(${marks.map(escapeRegExp).join('|')})`)).filter(Boolean);

const Body = ({ t, example }: { t: ExampleTheme; example: ExampleScreenData }) => {
	switch (example.kind) {
		case 'order-summary':
			return <OrderSummary t={t} data={example.data} />;
		case 'search-url':
			return <SearchUrl t={t} data={example.data} />;
		case 'admin-refresh':
			return <AdminRefresh t={t} data={example.data} />;
		case 'confirm-modal':
			return <ConfirmModal t={t} data={example.data} />;
		case 'editor-loading':
			return <EditorLoading t={t} data={example.data} />;
		case 'form-errors':
			return <FormErrors t={t} data={example.data} />;
		case 'stepper-results':
			return <StepperResults t={t} data={example.data} />;
		case 'chat-anchor':
			return <ChatAnchor t={t} data={example.data} />;
		case 'attachment-form':
			return <AttachmentForm t={t} data={example.data} />;
	}
};

/** 브라우저 틀의 윗줄: 점 3개와 가짜 주소. 주소의 강조 부분은 화면 안 같은 값과 같은 테두리로 묶는다. */
const BrowserBar = ({ t, address, marks }: { t: ExampleTheme; address: string; marks?: string[] }) => (
	<div className={cn('flex items-center gap-[0.6em] px-[0.75em] py-[0.45em]', t.bar)}>
		<span className="flex shrink-0 gap-[0.3em]">
			{[0, 1, 2].map(dot => (
				<span key={dot} className={cn('size-[0.6em] rounded-full', t.dot)} />
			))}
		</span>
		<span className={cn('min-w-0 flex-1 break-all rounded-full px-[0.75em] py-[0.1em]', t.address)}>
			{splitMarks(address, marks).map((part, index) =>
				marks?.includes(part) ? (
					<span
						key={`${part}-${index}`}
						className={cn('rounded-[0.3em] px-[0.15em] font-bold', t.accentLine, t.accentText)}>
						{part}
					</span>
				) : (
					<span key={`${part}-${index}`}>{part}</span>
				),
			)}
		</span>
		<span className={cn('shrink-0 rounded-[0.3em] px-[0.4em] font-bold', t.badge)}>예시</span>
	</div>
);

/**
 * 사례의 동작을 가상의 화면으로 그린 예시. 실제 서비스 화면 캡처가 아니며, 아래 설명줄에 항상 그 사실을 적는다.
 * 그림 부분은 role="img" 와 alt 문장 하나로 읽히고 안쪽 장식은 숨긴다. 설명줄(figcaption)은 그대로 읽힌다.
 * 서버 컴포넌트이고 마우스 상호작용·애니메이션이 없다.
 */
const ExampleScreen = ({ example, variant = 'web', className }: ExampleScreenProps) => {
	const t = EXAMPLE_THEMES[variant];

	return (
		<figure data-example-screen={example.slug} className={cn(t.figure, className)}>
			<div role="img" aria-label={example.alt} className={cn('overflow-hidden', t.frame, t.root)}>
				<div aria-hidden="true">
					<BrowserBar t={t} address={example.data.address} marks={example.data.marks} />
					<div className="p-[0.9em]">
						<ScreenTitle t={t}>{example.title}</ScreenTitle>
						<Body t={t} example={example} />
					</div>
				</div>
			</div>
			<figcaption className={t.figcaption}>
				<span className="block">
					<span className={cn('mr-[0.4em] inline-block rounded-[0.3em] px-[0.4em] font-bold', t.badge)}>
						{EXAMPLE_LABEL}
					</span>
					<span className="sr-only"> · </span>
					{EXAMPLE_DISCLAIMER}
				</span>
				<span className="block">{example.caption}</span>
			</figcaption>
		</figure>
	);
};

export default ExampleScreen;
