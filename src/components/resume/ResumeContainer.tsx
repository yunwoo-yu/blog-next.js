interface ResumeContainerProps {
	title?: string;
	titleClassName?: string;
	children: React.ReactNode;
}

export default function ResumeContainer({ title, titleClassName = '', children }: ResumeContainerProps) {
	return (
		<section className="[&_strong]:font-bold">
			{title && (
				<h3
					className={`mb-6 mt-12 flex items-center gap-3 text-2xl font-bold text-gray-950 after:h-px after:flex-1 after:bg-violet-200 dark:text-gray-50 dark:after:bg-violet-300/35 print:mb-4 print:mt-7 print:text-xl print:!text-gray-950 print:after:!bg-violet-200 ${titleClassName}`}>
					<span>{title}</span>
				</h3>
			)}
			{children}
		</section>
	);
}
