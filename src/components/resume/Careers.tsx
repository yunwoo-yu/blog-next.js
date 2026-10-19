import RESUME, { getCareerPeriod } from '@/constant/resume';

import ResumeContainer from './ResumeContainer';

export default function Careers() {
	return (
		<ResumeContainer title="경력" titleClassName="mt-5 print:mb-3 print:mt-2">
			<div className="flex flex-col gap-10 print:gap-5">
				{RESUME.careers.map(career => {
					const { text, duration, isOngoing } = getCareerPeriod(career);

					return (
						<article key={career.organization} className="print:break-inside-avoid">
							<header>
								<div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
									<div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
										<h4 className="text-xl font-bold text-gray-950 dark:text-gray-50 print:text-lg print:!text-gray-950">
											{career.organization}
										</h4>
										<span className="text-xs font-medium text-gray-500 dark:text-gray-400 print:!text-gray-500">
											{career.position}
										</span>
									</div>
									<p className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 print:!text-gray-500 sm:text-right">
										{text} {duration && <span className={isOngoing ? 'print:hidden' : ''}>({duration})</span>}
										{career.exitReason && <span className="text-xs font-normal"> · {career.exitReason}</span>}
									</p>
								</div>

								<p className="mt-5 text-sm leading-7 text-gray-700 dark:text-gray-200 print:mt-3 print:leading-6 print:!text-gray-800">
									{career.description}
								</p>

								<ul
									aria-label={`${career.organization} 기술 스택`}
									className="mt-3 flex flex-wrap gap-x-3 gap-y-1 print:mt-2">
									{career.techStack.map(tech => (
										<li key={tech} className="text-xs text-gray-500 dark:text-gray-400 print:!text-gray-600">
											{tech}
										</li>
									))}
								</ul>
							</header>
						</article>
					);
				})}
			</div>
		</ResumeContainer>
	);
}
