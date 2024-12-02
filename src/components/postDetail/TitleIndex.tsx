import Link from 'next/link';

interface TitleIndexProps {
	headerNavigationList?: { text: string; href: string }[];
}

const TitleIndex = ({ headerNavigationList }: TitleIndexProps) => {
	return (
		<ul className="mx-auto mt-10 flex max-w-4xl flex-col gap-2 rounded-lg bg-secondary p-5 text-gray-500 dark:text-gray-300">
			<li className="text-lg font-semibold text-foreground">목차</li>
			{headerNavigationList &&
				headerNavigationList.map(({ text, href }, index) => (
					<li key={text} className="list-none text-sm hover:text-destructive">
						<Link href={href} className="scroll-smooth">
							{index + 1}. {text}
						</Link>
					</li>
				))}
		</ul>
	);
};

export default TitleIndex;
