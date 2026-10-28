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
					className={`mb-5 mt-14 text-xl font-bold tracking-tight text-gray-950 dark:text-gray-50 print:mb-2 print:mt-4 print:text-lg print:!text-gray-950 ${titleClassName}`}>
					<span>{title}</span>
				</h3>
			)}
			{children}
		</section>
	);
}
