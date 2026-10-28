import RESUME, { getCareerPeriod, getOrganizationSummary } from '@/constant/resume';

import ResumeContainer from './ResumeContainer';

const muted = 'text-gray-500 dark:text-gray-400 print:!text-gray-500';
const body = 'text-gray-800 dark:text-gray-100 print:!text-gray-900';

/**
 * 경력: 회사마다 직무·기간·소개·프로젝트 개수(서비스별)·기술 키워드를 보여 준다.
 * 한 일은 프로젝트 섹션에서 서비스별로 모아 적는다.
 */
export default function Careers() {
	return (
		<ResumeContainer title="경력" titleClassName="print:mb-1 print:mt-2">
			<div className="flex flex-col gap-8 border-l border-gray-300 pl-6 dark:border-gray-600 print:gap-4 print:border-gray-300">
				{RESUME.careers.map(career => {
					const { text, duration, isOngoing } = getCareerPeriod(career);
					const { projects, services } = getOrganizationSummary(RESUME.projects, career.organization);

					return (
						<article key={career.organization} className="relative print:break-inside-avoid">
							<span
								aria-hidden="true"
								className="absolute -left-[30px] top-2 h-2.5 w-2.5 rounded-full bg-violet-600 dark:bg-violet-400 print:!bg-violet-600"
							/>
							<h4 className="text-xl font-bold text-gray-950 dark:text-gray-50 print:text-lg print:!text-gray-950">
								{career.organization}
							</h4>
							<div className="print:flex print:flex-wrap print:items-baseline print:gap-x-3">
								<p className={`mt-1 text-sm ${body}`}>{career.position}</p>
								<p className={`mt-1 text-sm ${muted}`}>
									{text} {duration && <span className={isOngoing ? 'print:hidden' : ''}>({duration})</span>}
									{career.exitReason && <span data-testid="exit-reason"> · {career.exitReason}</span>}
								</p>
							</div>
							<p className={`mt-3 break-keep text-sm leading-7 print:mt-2 print:leading-6 ${body}`}>
								{career.description}
							</p>
							{/* 같은 서비스 목록이 바로 아래 프로젝트 섹션에 있으므로 인쇄에서는 줄여 2쪽에 맞춘다. */}
							<p data-testid="project-summary" className={`mt-2 text-sm font-medium print:hidden ${body}`}>
								프로젝트 {projects}개
								<span className={`font-normal ${muted}`}>
									{' — '}
									{services.map(({ service }) => service).join(' / ')}
								</span>
							</p>
						</article>
					);
				})}
			</div>
		</ResumeContainer>
	);
}
