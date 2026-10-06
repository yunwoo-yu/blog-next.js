interface ResumeSheetProps {
	children: React.ReactNode;
	className?: string;
}

export default function ResumeSheet({ children, className = '' }: ResumeSheetProps) {
	return (
		<section
			className={`rounded-lg bg-slate-100 px-4 py-8 sm:px-8 sm:py-12 md:px-14 md:py-14 print:rounded-none print:bg-white print:px-0 print:py-0 dark:bg-[#26272d] ${className}`}>
			{children}
		</section>
	);
}
