/**
 * 예시 화면의 색·선 클래스. 회색은 웹 pf-gray-*, 인쇄(PDF) print-* 토큰을 쓴다.
 * 강조색은 두 변형 모두 중립적인 print-accent 하나만 쓴다(포트폴리오 UI 의 pf-blue 는 실제 서비스 팔레트와 값이 같아 예시 화면에 쓰지 않는다).
 * 오류·실패는 점선·아이콘·글자 라벨로 구분해
 * 흑백 인쇄에서도 의미가 남게 한다. 크기는 루트 글자 크기(root)에 맞춘 em 값이라 본문 조각은 두 변형이 같다.
 */

export type ExampleVariant = 'web' | 'print';

export interface ExampleTheme {
	/** 루트 글자 크기·줄 간격. 본문 조각의 em 값이 이 크기를 따른다. p 의 줄 간격은 globals.css 의 `article p` 규칙을 덮어쓴다. */
	root: string;
	frame: string;
	bar: string;
	dot: string;
	address: string;
	surface: string;
	box: string;
	rule: string;
	text: string;
	strong: string;
	muted: string;
	accentText: string;
	accentFill: string;
	/** 강조 테두리(선 두께 포함) */
	accentLine: string;
	/** 강조 면 버튼(흰 글자) */
	accentSolid: string;
	/** 오류·실패 칸: 점선 테두리 */
	errorBox: string;
	skeleton: string;
	/** 좌우 두 칸 배치. 웹은 좁은 화면에서 한 칸으로 쌓는다. */
	split: string;
	/** figure 배치. 인쇄는 설명줄을 그림 오른쪽에 두어 높이를 줄인다. */
	figure: string;
	figcaption: string;
	badge: string;
}

export const EXAMPLE_THEMES: Record<ExampleVariant, ExampleTheme> = {
	web: {
		root: 'text-[13px] leading-[1.45] sm:text-[14px] [&_p]:leading-[1.45]',
		frame: 'rounded-2xl border border-pf-line bg-white',
		bar: 'border-b border-pf-line bg-pf-gray-50',
		dot: 'bg-pf-gray-400',
		address: 'border border-pf-line bg-white text-pf-gray-700',
		surface: 'bg-pf-gray-50',
		box: 'border border-pf-gray-200 bg-white',
		rule: 'border-pf-gray-200',
		text: 'text-pf-gray-800',
		strong: 'text-pf-gray-900',
		muted: 'text-pf-gray-700',
		accentText: 'text-print-accent',
		accentFill: 'bg-print-accent/[0.06]',
		accentLine: 'border-2 border-print-accent',
		accentSolid: 'bg-print-accent text-white',
		errorBox: 'border border-dashed border-pf-gray-700 bg-white',
		skeleton: 'bg-pf-gray-200',
		split: 'grid gap-[0.75em] sm:grid-cols-2',
		figure: '',
		figcaption: 'mt-3 break-keep text-[14px] leading-[1.6] text-pf-gray-700',
		badge: 'border border-pf-gray-400 text-pf-gray-900',
	},
	print: {
		root: 'text-[6.5pt] leading-[1.35] [&_p]:leading-[1.35]',
		frame: 'rounded-[1.5mm] border-[0.75pt] border-print-rule bg-white',
		bar: 'border-b-[0.5pt] border-print-rule bg-print-fill',
		dot: 'bg-print-dash',
		address: 'border-[0.5pt] border-print-rule bg-white text-print-ink-2',
		surface: 'bg-print-fill',
		box: 'border-[0.5pt] border-print-rule bg-white',
		rule: 'border-print-rule',
		text: 'text-print-ink-2',
		strong: 'text-print-ink',
		// print-fill(면) 위 6.5pt 글자라 ink-3(4.39:1) 대신 ink-2(9.37:1)를 쓴다.
		muted: 'text-print-ink-2',
		accentText: 'text-print-accent',
		accentFill: 'bg-print-fill',
		accentLine: 'border-[1pt] border-print-accent',
		accentSolid: 'bg-print-accent text-white',
		errorBox: 'border-[0.75pt] border-dashed border-print-ink-2 bg-white',
		skeleton: 'bg-print-rule',
		split: 'grid grid-cols-2 gap-[0.75em]',
		figure: 'grid grid-cols-[minmax(0,1fr)_44mm] items-start gap-[4mm]',
		figcaption: 'text-[7.5pt] leading-[1.45] text-print-ink-3 [&>span+span]:mt-[1.5mm]',
		badge: 'border-[0.75pt] border-print-ink text-print-ink',
	},
};
