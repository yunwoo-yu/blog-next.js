import RESUME from '@/constant/resume';

import ResumeContainer from './ResumeContainer';

export default function Education() {
	return (
		<ResumeContainer title="교육">
			<ul className="ml-5 list-disc">
				{RESUME.education.map(edu => (
					<li key={edu.title} className="my-1 text-sm">
						<span>{edu.title}</span>
						<span className="ml-2 text-gray-500 dark:text-gray-400">| {edu.period}</span>
					</li>
				))}
			</ul>
		</ResumeContainer>
	);
}
