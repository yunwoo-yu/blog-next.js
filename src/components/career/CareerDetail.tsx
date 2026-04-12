import { ResumeLink } from '@/components/resume/ResumeLink';
import RESUME, { getCareerPeriod } from '@/constant/resume';

export default function CareerDetail() {
	return (
		<div className="flex flex-col gap-12 print:gap-6">
			{RESUME.careers.map(career => (
				<section key={career.organization}>
					<div className="mb-6 flex items-baseline gap-3 print:mb-4">
						<h2 className="text-2xl font-semibold print:text-xl">{career.organization}</h2>
						<span className="text-sm text-gray-500 dark:text-gray-400">
							{(() => {
								const { text, duration, isOngoing } = getCareerPeriod(career);
								return (
									<>
										{text} {duration && <span className={isOngoing ? 'print:hidden' : ''}>({duration})</span>}
									</>
								);
							})()}
						</span>
					</div>

					{career.serviceGroups.map(group => (
						<div
							key={group.service}
							className={`mb-8 flex flex-col print:mb-4 ${group.printBreakBefore ? 'print:break-before-page' : ''}`}>
							<div className="mt-2 mb-2 flex items-baseline gap-2 print:mt-3 print:break-after-avoid">
								<h3 className="text-xl font-semibold text-destructive">{group.service}</h3>
								{group.serviceDescription && (
									<span className="text-xs text-gray-500 dark:text-gray-400">{group.serviceDescription}</span>
								)}
							</div>

							<div className="flex flex-col gap-8 print:gap-4">
								{group.projects.map(project => (
									<article
										key={project.title}
										className="border-l-2 border-destructive py-2 pl-5 print:border-l print:py-1 print:break-inside-avoid">
										<div className="mb-3 print:mb-2">
											<h4 className="text-2xl font-medium print:text-xl">{project.title}</h4>
											{project.date && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{project.date}</p>}
										</div>

										<p className="mb-4 text-sm leading-7 print:mb-2 print:leading-relaxed">{project.description}</p>

										<ul className="ml-5 list-disc">
											{project.achievements.map((achievement, index) => (
												<li key={index} className="my-2 text-sm leading-7 print:my-1 print:leading-relaxed">
													{achievement.title}
													{achievement.links?.map((link, linkIndex) => (
														<ResumeLink key={linkIndex} title={link.title} url={link.url} />
													))}
												</li>
											))}
										</ul>
									</article>
								))}
							</div>
						</div>
					))}
				</section>
			))}
		</div>
	);
}
