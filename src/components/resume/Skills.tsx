import RESUME, { getSkills } from '@/constant/resume';

import ResumeContainer from './ResumeContainer';

/** 기술 스택: 경력마다 반복해 적지 않고, 쓰는 기술만 한 번씩 배지로 모아 보여 준다. */
export default function Skills() {
	const skills = getSkills(RESUME.careers);

	return (
		<ResumeContainer title="기술 스택" titleClassName="print:mb-2 print:mt-2">
			<ul className="flex flex-wrap gap-2 print:gap-1.5">
				{skills.map(skill => (
					<li
						key={skill}
						className="rounded-md bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-800 dark:bg-slate-700/80 dark:text-slate-100 print:!bg-slate-200 print:!text-slate-800">
						{skill}
					</li>
				))}
			</ul>
		</ResumeContainer>
	);
}
