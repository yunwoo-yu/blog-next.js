import RESUME, { getCareerPeriod } from '@/constant/resume';

import ResumeContainer from './ResumeContainer';

export default function Careers() {
	return (
		<ResumeContainer title="경력">
			<ul className="flex flex-col gap-10 print:gap-4">
				{RESUME.careers.map(career => (
					<li
						key={career.organization}
						className="flex gap-10 border-l-2 border-destructive py-2 pl-5 print:gap-4 print:border-l print:py-1">
						<div className="w-48 shrink-0 print:w-40">
							<h4 className="text-xl font-medium print:text-lg">{career.organization}</h4>
							<p className="text-sm font-light leading-6 text-gray-500 dark:text-gray-400">
								{(() => {
									const { text, duration, isOngoing } = getCareerPeriod(career);
									return (
										<>
											{text}{' '}
											{duration && (
												<span className={isOngoing ? 'print:hidden' : ''}>({duration})</span>
											)}
										</>
									);
								})()}
							</p>
							<p className="mt-1 text-sm">{career.position}</p>
						</div>
						<div className="flex-1">
							<p className="mb-4 text-sm leading-6 print:mb-2">{career.description}</p>

							<ul className="ml-5 list-disc">
								{career.highlights.map((highlight, index) => (
									<li key={index} className="my-1 text-sm print:my-0.5">
										<span>{highlight.text}</span>
										{highlight.subItems && (
											<ul className="ml-5 mt-1 list-disc">
												{highlight.subItems.map((sub, subIndex) => (
													<li key={subIndex} className="my-0.5 text-sm text-gray-600 dark:text-gray-400">
														{sub}
													</li>
												))}
											</ul>
										)}
									</li>
								))}
							</ul>

							<div className="mt-4 flex flex-wrap gap-1 print:mt-2">
								{career.techStack.map((tech, index) => (
									<span key={index} className="rounded-md bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700">
										{tech}
									</span>
								))}
							</div>
						</div>
					</li>
				))}
			</ul>
		</ResumeContainer>
	);
}
