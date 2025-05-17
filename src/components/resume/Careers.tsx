import ResumeContainer from './ResumeContainer';

import RESUME from '@/constant/resume';
import { ResumeLink } from './ResumeLink';
import { ResumeItem } from './ResumeItem';

export default function Careers() {
	return (
		<ResumeContainer title="경력">
			<ul className="flex flex-col gap-10">
				{RESUME.careers.map(career => (
					<li key={career.organization} className="flex gap-10 border-l-2 border-destructive py-2 pl-5">
						<div className="w-52">
							<h4 className="text-xl font-medium">{career.organization}</h4>
							<p className="text-sm font-light leading-6 text-gray-500 dark:text-gray-400">{career.period}</p>
							<p className="mt-1 text-sm">{career.position}</p>
						</div>
						<div className="flex-1">
							{career.projects.map(project => (
								<div className="mb-6" key={project.title}>
									<div className="mb-2 flex items-center">
										<h5 className="text-lg font-medium">{project.title}</h5>
										{project.links &&
											project.links.map(link => <ResumeLink key={link.url} title={link.title} url={link.url} />)}
									</div>

									<p className="mb-2 text-sm">{project.description}</p>

									<div className="mb-3 flex flex-wrap gap-1">
										{project.skills.map((skill, index) => (
											<span key={index} className="rounded-md bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700">
												{skill}
											</span>
										))}
									</div>

									<ul className="ml-5 list-disc">
										{project.achievements.map((achievement, index) => (
											<ResumeItem key={index} item={achievement} />
										))}
									</ul>
								</div>
							))}
						</div>
					</li>
				))}
			</ul>
		</ResumeContainer>
	);
}
