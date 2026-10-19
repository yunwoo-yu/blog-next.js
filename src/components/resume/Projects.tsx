import Link from 'next/link';

import RESUME, { getServicePeriod, type ServiceProject } from '@/constant/resume';

import { renderHighlightedText } from './highlight';
import ResumeContainer from './ResumeContainer';
import { ResumeLink } from './ResumeLink';

const PRODUCT_LINK_LABELS: Record<string, string> = {
	Wello: '웰로 홈페이지',
	'Wello-biz': '웰로비즈 홈페이지',
};

const getProductLinkLabel = (title: string) => PRODUCT_LINK_LABELS[title] ?? `${title} 홈페이지`;

const labelStyle = 'text-xs font-semibold text-gray-500 dark:text-gray-400 print:!text-gray-500';
const bodyStyle = 'text-sm leading-7 text-gray-700 dark:text-gray-200 print:leading-6 print:!text-gray-800';

const Label = ({ children }: { children: string }) => <h6 className={labelStyle}>{children}</h6>;

/**
 * 서비스 한 건. 왼쪽 레일(서비스명·기간)은 데스크톱에서 스크롤을 따라오고, 오른쪽에 설명·역할·업무·사용 기술을 둔다.
 * 업무는 한 줄 요약이고 상세는 포트폴리오 사례로 연결한다(인쇄에서는 링크를 숨긴다).
 */
export function ProjectBlock({ project }: { project: ServiceProject }) {
	return (
		<section className="grid gap-4 md:grid-cols-[176px_minmax(0,1fr)] md:gap-10 print:grid-cols-[110px_minmax(0,1fr)] print:gap-4">
			<header className="md:sticky md:top-6 md:self-start print:static">
				<h5 className="text-lg font-bold leading-snug text-gray-950 dark:text-gray-50 print:text-base print:!text-gray-950">
					{project.service}
				</h5>
				<p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400 print:!text-gray-500">
					{project.organization}
				</p>
				<p className="text-xs text-gray-500 dark:text-gray-400 print:!text-gray-500">{getServicePeriod(project)}</p>
				{project.serviceUrl && (
					<p className="mt-1">
						<ResumeLink title={getProductLinkLabel(project.service)} url={project.serviceUrl} />
					</p>
				)}
			</header>

			<div className="flex flex-col gap-6 print:gap-3">
				{project.serviceDescription && (
					<div>
						<Label>설명</Label>
						<p className={`mt-1 ${bodyStyle}`}>{project.serviceDescription}</p>
					</div>
				)}

				<div>
					<Label>역할</Label>
					<ul className={`mt-1 list-disc pl-5 marker:text-gray-400 ${bodyStyle}`}>
						{project.role.map(role => (
							<li key={role}>{role}</li>
						))}
					</ul>
				</div>

				<div>
					<Label>업무</Label>
					<ul aria-label={`${project.service} 업무`} className="mt-3 flex flex-col gap-6 print:gap-3">
						{project.items.map(item => (
							<li key={item.title} className="print:break-inside-avoid">
								{item.outcome && (
									<p data-field="outcome" className="mb-1 flex flex-wrap items-baseline gap-x-2">
										<span className="sr-only">성과</span>
										<span className="text-base font-bold text-violet-700 dark:text-violet-300 print:!text-violet-700">
											{item.outcome.value}
										</span>
										{item.outcome.note && (
											<span className="text-xs text-gray-500 dark:text-gray-400 print:!text-gray-500">
												{item.outcome.note}
											</span>
										)}
									</p>
								)}
								<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
									<p className="text-sm font-bold leading-6 text-gray-950 dark:text-gray-100 print:!text-gray-950">
										{item.title}
									</p>
									<span className="text-xs text-gray-500 dark:text-gray-400 print:!text-gray-500">{item.date}</span>
								</div>
								<p className={`mt-0.5 ${bodyStyle}`}>
									{renderHighlightedText(item.summary, item.highlights)}
									{item.links?.map(link => (
										<ResumeLink key={link.url} title={link.title} url={link.url} />
									))}
								</p>
								<Link
									href={`/portfolio/${item.caseSlug}`}
									aria-label={`${item.title} 포트폴리오 상세 보기`}
									className="mt-1 inline-block text-xs font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300 print:hidden">
									포트폴리오에서 자세히 →
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div>
					<Label>사용 기술</Label>
					<ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1" aria-label={`${project.service} 사용 기술`}>
						{project.techStack.map(tech => (
							<li key={tech} className="text-xs text-gray-500 dark:text-gray-400 print:!text-gray-600">
								{tech}
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}

export default function Projects() {
	return (
		<ResumeContainer title="프로젝트" titleClassName="print:break-after-avoid">
			<div className="flex flex-col gap-14 print:gap-6">
				{RESUME.projects.map(project => (
					<ProjectBlock key={project.service} project={project} />
				))}
			</div>
		</ResumeContainer>
	);
}
