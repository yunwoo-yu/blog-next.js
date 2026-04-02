import RESUME from '@/constant/resume';

import ResumeContainer from './ResumeContainer';

export default function Projects() {
	return (
		<ResumeContainer title="프로젝트">
			<div className="flex flex-col gap-12 print:gap-8">
				{RESUME.careers.map(career => (
					<div key={career.organization} className="flex flex-col gap-10 print:gap-6">
						<h4 className="text-xl font-semibold">{career.organization}</h4>

						{career.serviceGroups.map(group => (
							<div key={group.service} className="flex flex-col gap-8 print:gap-5">
								<div className="flex items-baseline gap-2">
									<h5 className="text-base font-medium text-destructive">{group.service}</h5>
									{group.serviceDescription && (
										<span className="text-xs text-gray-500 dark:text-gray-400">{group.serviceDescription}</span>
									)}
								</div>

								{group.projects.map(project => (
									<div
										key={project.title}
										className="print-keep-together border-l-2 border-destructive py-1 pl-5 print:border-l">
										<div className="mb-2">
											<h6 className="text-base font-medium">{project.title}</h6>
											{project.date && (
												<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{project.date}</p>
											)}
										</div>

										<p className="mb-3 text-sm leading-7 text-gray-700 dark:text-gray-300 print:mb-2 print:leading-6">
											{project.description}
										</p>

										<ul className="ml-5 list-disc">
											{project.achievements.map((achievement, index) => (
												<li
													key={index}
													className="my-1.5 text-sm leading-6 text-gray-700 dark:text-gray-300 print:my-1 print:leading-relaxed">
													{achievement.title}
												</li>
											))}
										</ul>
									</div>
								))}
							</div>
						))}
					</div>
				))}
			</div>
		</ResumeContainer>
	);
}
