import RESUME from '@/constant/resume';

import ResumeContainer from './ResumeContainer';
import { ResumeLink } from './ResumeLink';

export default function Activities() {
	return (
		<ResumeContainer title="대외활동">
			<div className="flex flex-col gap-7 print:gap-5">
				{RESUME.activities.map(activity => (
					<article
						key={activity.title}
						className="border-l border-violet-200 pl-5 print:border-violet-200 dark:border-violet-300/40">
						<header className="mb-3 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
							<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
								<h4 className="text-base font-semibold leading-7 text-gray-950 dark:text-gray-100 print:!text-gray-950">
									{activity.title}
								</h4>
								{activity.organization && (
									<span className="text-xs font-medium text-gray-500 dark:text-gray-400 print:!text-gray-500">
										{activity.organization}
									</span>
								)}
							</div>
							<p className="text-sm font-medium text-gray-500 dark:text-gray-400 print:!text-gray-500">
								{activity.period}
							</p>
						</header>
						<ul className="ml-5 list-disc">
							{activity.items.map((item, index) => {
								const text = typeof item === 'string' ? item : item.text;
								const links = typeof item === 'string' ? undefined : item.links;
								return (
									<li
										key={index}
										className="my-1 text-sm leading-6 text-gray-700 dark:text-gray-200 print:!text-gray-800">
										{text}
										{links?.map((link, linkIndex) => (
											<ResumeLink key={linkIndex} title={link.title} url={link.url} />
										))}
									</li>
								);
							})}
						</ul>
					</article>
				))}
			</div>
		</ResumeContainer>
	);
}
