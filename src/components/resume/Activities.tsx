import RESUME from '@/constant/resume';

import ResumeContainer from './ResumeContainer';

export default function Activities() {
	return (
		<ResumeContainer title="대외활동">
			<ul className="flex flex-col gap-6 print:gap-3">
				{RESUME.activities.map(activity => (
					<li
						key={activity.title}
						className="flex gap-10 border-l-2 border-destructive py-2 pl-5 print:gap-4 print:border-l print:py-1">
						<div className="w-48 shrink-0 print:w-40">
							<h4 className="text-lg font-medium">{activity.title}</h4>
							<p className="text-sm font-light text-gray-500 dark:text-gray-400">
								{activity.organization ? `${activity.organization} — ` : ''}
								{activity.period}
							</p>
						</div>
						<ul className="ml-5 flex-1 list-disc">
							{activity.items.map((item, index) => (
								<li key={index} className="my-1 text-sm">
									{item}
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		</ResumeContainer>
	);
}
