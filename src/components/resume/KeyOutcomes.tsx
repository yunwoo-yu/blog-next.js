import RESUME from '@/constant/resume';

import ResumeContainer from './ResumeContainer';

/** 프로젝트 항목의 outcome 을 그대로 모아 보여 주는 요약. 새 문구·수치를 만들지 않는다. */
export const getKeyOutcomes = () =>
	RESUME.projects.flatMap(project =>
		project.items.flatMap(item =>
			item.outcome ? [{ key: `${project.service}-${item.title}`, title: item.title, value: item.outcome.value }] : [],
		),
	);

export default function KeyOutcomes() {
	const outcomes = getKeyOutcomes();

	if (outcomes.length === 0) return null;

	return (
		<ResumeContainer title="핵심 성과" titleClassName="print:break-after-avoid">
			<ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2 print:grid-cols-2 print:gap-y-3">
				{outcomes.map(({ key, title, value }) => (
					<li key={key} className="print:break-inside-avoid">
						<p className="text-lg font-bold leading-snug text-violet-700 dark:text-violet-300 print:text-base print:!text-violet-700">
							{value}
						</p>
						<p className="mt-0.5 text-sm leading-6 text-gray-600 dark:text-gray-300 print:!text-gray-600">{title}</p>
					</li>
				))}
			</ul>
		</ResumeContainer>
	);
}
