import RESUME from '@/constant/resume';

import ResumeContainer from './ResumeContainer';

export default function Education() {
	if (RESUME.education.length === 0) return null;

	return (
		<ResumeContainer title="교육">
			<ul className="ml-5 list-disc">
				{RESUME.education.map(edu => (
					<li key={edu.title} className="my-1 text-sm leading-6 text-gray-700 dark:text-gray-200 print:!text-gray-800">
						<span>{edu.title}</span>
						<span className="ml-2 text-gray-500 dark:text-gray-400 print:!text-gray-500">| {edu.period}</span>
					</li>
				))}
			</ul>
		</ResumeContainer>
	);
}
