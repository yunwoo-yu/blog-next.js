import RESUME, { getOrganizationSummary } from '@/constant/resume';

import { renderRichText } from './highlight';
import ResumeContainer from './ResumeContainer';

const muted = 'text-gray-500 dark:text-gray-400 print:!text-gray-500';
const body = 'text-gray-800 dark:text-gray-100 print:!text-gray-900';

/** 프로젝트: 회사별로 묶고, 그 안에서 서비스 이름을 제목으로 그 서비스에서 한 일을 한 줄 불릿(결과는 문장 안에)으로 모아 적는다. */
export default function Projects() {
	return (
		<ResumeContainer title="프로젝트" titleClassName="print:mb-2 print:mt-2">
			<div className="flex flex-col gap-12 print:gap-3">
				{RESUME.careers.map(career => {
					const { projects } = getOrganizationSummary(RESUME.projects, career.organization);

					return (
						<div key={career.organization} data-org={career.organization}>
							<h4 className="border-b border-gray-300 pb-2 text-lg font-bold text-gray-950 dark:border-gray-600 dark:text-gray-50 print:pb-1 print:text-base print:!text-gray-950">
								{career.organization} <span className={`text-sm font-medium ${muted}`}>프로젝트 {projects}개</span>
							</h4>

							<div className="mt-5 flex flex-col gap-7 print:mt-2 print:gap-2">
								{RESUME.projects
									.filter(project => project.organization === career.organization)
									.map(project => (
										<section key={project.service}>
											<div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
												<h5 className="text-base font-bold text-gray-950 dark:text-gray-50 print:!text-gray-950">
													{project.service}
												</h5>
												{project.serviceDescription && (
													<p className={`text-sm leading-6 ${muted}`}>{project.serviceDescription}</p>
												)}
											</div>

											<ul className="mt-2 list-disc space-y-2 pl-5 marker:text-gray-400 print:space-y-1">
												{project.items.map(item => (
													<li
														key={item.title}
														data-testid="work-item"
														className={`break-keep text-sm leading-7 print:break-inside-avoid print:leading-6 ${body}`}>
														{renderRichText(item.summary, item.highlights, item.links)}
													</li>
												))}
											</ul>
										</section>
									))}
							</div>
						</div>
					);
				})}
			</div>
		</ResumeContainer>
	);
}
