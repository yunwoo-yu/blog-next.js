export interface ResumeLinkProps {
	title: string;
	url: string;
}

export const ResumeLink = ({ title, url }: ResumeLinkProps) => {
	return (
		<a href={url} target="_blank" rel="noopener noreferrer" className="ml-1 text-sm text-blue-500 hover:underline">
			[{title}]
		</a>
	);
};
