interface ResumeSheetProps {
	children: React.ReactNode;
	className?: string;
}

export default function ResumeSheet({ children, className = '' }: ResumeSheetProps) {
	return (
		<section
			className={`rounded-lg bg-slate-100 px-8 py-12 sm:px-14 sm:py-14 print:rounded-none print:bg-white print:px-0 print:py-0 dark:bg-[#26272d] ${className}`}>
			{children}
		</section>
	);
}
