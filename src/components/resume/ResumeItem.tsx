import { ResumeLink, ResumeLinkProps } from './ResumeLink';

export interface ResumeItemProps {
	title: string;
	description?: string;
	links?: ResumeLinkProps[];
	children?: ResumeItemProps[];
}

export const ResumeItem = ({ item, depth = 0 }: { item: ResumeItemProps; depth?: number }) => {
	return (
		<li className={`my-1 ${depth > 0 ? '-ml-1' : ''}`}>
			<div className="block">
				<span>{item.title}</span>
				{item.links && item.links.map((link, index) => <ResumeLink key={index} title={link.title} url={link.url} />)}
			</div>

			{item.children && item.children.length > 0 && (
				<ul className="ml-5 mt-1 list-disc">
					{item.children.map((child, index) => (
						<ResumeItem key={index} item={child} depth={depth + 1} />
					))}
				</ul>
			)}
		</li>
	);
};
