interface ResumeContainerProps {
	title: string;
	children: React.ReactNode;
}

export default function ResumeContainer({ title, children }: ResumeContainerProps) {
	return (
		<section className="[&_strong]:font-medium [&_strong]:text-destructive">
			<h3 className="my-5 text-2xl font-semibold">{title}</h3>
			{children}
		</section>
	);
}
