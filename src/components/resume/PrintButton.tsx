'use client';

export default function PrintButton() {
	return (
		<button
			type="button"
			onClick={() => window.print()}
			className="hidden rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 print:hidden"
		>
			PDF 출력
		</button>
	);
}
