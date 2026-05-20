import { ResumeLink } from '@/components/resume/ResumeLink';
import { CAREER_DETAILS, getCareerPeriod } from '@/constant/resume';

export default function CareerDetail() {
	return (
		<div className="flex flex-col gap-12 print:block">
			{CAREER_DETAILS.map(career => (
				<section key={career.organization} className="print:mb-4">
					<div className="mb-6 flex items-baseline gap-3 print:mb-3">
						<h2 className="text-2xl font-semibold print:text-lg">{career.organization}</h2>
						<span className="text-sm text-gray-500 print:text-[13px] dark:text-gray-400">
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
							className={`mb-8 flex flex-col print:mb-3 print:block ${group.printBreakBefore ? 'print:break-before-page' : ''}`}>
							<div className="mt-2 mb-2 flex items-baseline gap-2 print:mt-2 print:break-after-avoid">
								<h3 className="text-xl font-semibold text-destructive print:text-base">
									{group.serviceUrl ? (
										<a href={group.serviceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
											{group.service}
										</a>
									) : (
										group.service
									)}
								</h3>
								{group.serviceDescription && (
									<span className="text-xs text-gray-500 print:text-[11px] dark:text-gray-400">
										{group.serviceDescription}
									</span>
								)}
							</div>

							<div className="flex flex-col gap-8 print:block">
								{group.projects.map(project => (
									<article
										key={project.title}
										className="border-l-2 border-destructive py-2 pl-5 print:border-l print:py-1">
										<div className="mb-3 print:mb-1.5 print:break-after-avoid">
											<h4 className="text-2xl font-medium print:text-base">{project.title}</h4>
											{project.date && (
												<p className="mt-1 text-xs text-gray-500 print:text-[11px] dark:text-gray-400">
													{project.date}
												</p>
											)}
										</div>

										<ul className="flex flex-col gap-3 print:gap-1.5">
											{project.details.map((detail, index) => (
												<li key={index} className="flex gap-3 text-sm leading-7 print:text-[13px] print:leading-[1.45]">
													<span className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-foreground" />
													<span>
														{detail.title}
														{detail.links?.map((link, linkIndex) => (
															<ResumeLink key={linkIndex} title={link.title} url={link.url} />
														))}
													</span>
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
