interface ResumeContainerProps {
	title: string;
	children: React.ReactNode;
}

export default function ResumeContainer({ title, children }: ResumeContainerProps) {
	return (
		<section>
			<h3 className="my-5 text-xl font-medium">{title}</h3>
			{children}
		</section>
	);
}
