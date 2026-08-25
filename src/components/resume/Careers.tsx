import RESUME, { getCareerPeriod } from '@/constant/resume';

import ResumeContainer from './ResumeContainer';
import { ResumeLink } from './ResumeLink';

const PROJECT_DETAIL_LABELS = ['문제', '기여', '결과'];
const PRODUCT_LINK_LABELS: Record<string, string> = {
	Wello: '웰로 홈페이지',
	'Wello-biz': '웰로비즈 홈페이지',
};

export const renderHighlightedText = (text: string, highlights: string[]) => {
	if (highlights.length === 0) return text;

	const escapedHighlights = highlights.map(highlight => highlight.replace(/[.*+?^{}$()|[\]\\]/g, '\\$&'));
	const pattern = new RegExp(`(${escapedHighlights.join('|')})`, 'g');

	return text.split(pattern).map((part, index) =>
		highlights.includes(part) ? (
			<strong key={[part, index].join('-')} className="font-bold text-gray-950 print:!text-gray-950 dark:text-gray-50">
				{part}
			</strong>
		) : (
			part
		),
	);
};

const getProductLinkLabel = (title: string) => PRODUCT_LINK_LABELS[title] ?? `${title} 홈페이지`;

export default function Careers() {
	return (
		<ResumeContainer title="경력">
			<div className="flex flex-col gap-10 print:gap-8">
				{RESUME.careers.map(career => {
					const { text, duration, isOngoing } = getCareerPeriod(career);

					return (
						<article
							key={career.organization}
							className="border-l border-violet-200 pl-5 print:break-inside-auto print:border-violet-200 dark:border-violet-300/40">
							<header className="pb-5 print:pb-3">
								<div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
									<div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
										<h4 className="text-xl font-bold text-gray-950 dark:text-gray-50 print:text-lg print:!text-gray-950">
											{career.organization}
										</h4>
										<span className="text-xs font-medium text-gray-500 dark:text-gray-400 print:!text-gray-500">
											{career.position}
										</span>
									</div>
									<p className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 print:!text-gray-500 sm:text-right">
										{text} {duration && <span className={isOngoing ? 'print:hidden' : ''}>({duration})</span>}
										{career.exitReason && <span className="text-xs font-normal"> · {career.exitReason}</span>}
									</p>
								</div>

								<p className="mt-5 text-sm leading-7 text-gray-700 dark:text-gray-200 print:mt-3 print:leading-6 print:!text-gray-800">
									{career.description}
								</p>

								<div className="mt-4 flex flex-wrap gap-1.5 print:mt-2 print:gap-1">
									{career.techStack.map(tech => (
										<span
											key={tech}
											className="rounded-md bg-slate-200 px-2 py-1 text-xs text-slate-800 print:!bg-slate-200 print:!text-slate-800 dark:bg-slate-700/80 dark:text-slate-100">
											{tech}
										</span>
									))}
								</div>
							</header>

							<div className="mt-7 flex flex-col gap-10 print:mt-4 print:gap-7">
								{career.serviceGroups.map(group => (
									<section
										key={group.service}
										className={[
											'print:break-inside-auto',
											group.printBreakBefore ? 'print:break-before-page' : '',
										].join(' ')}>
										<header className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 print:mb-3 print:break-after-avoid">
											<h5 className="text-sm font-bold text-violet-700 print:!text-violet-700 dark:text-violet-300">
												{group.service}
											</h5>
											{group.serviceDescription && (
												<p className="text-xs text-gray-500 print:!text-gray-500 dark:text-gray-400">
													{group.serviceDescription}
												</p>
											)}
											{group.serviceUrl && (
												<ResumeLink title={getProductLinkLabel(group.service)} url={group.serviceUrl} />
											)}
										</header>

										<div className="divide-y divide-gray-300 dark:divide-slate-700 print:divide-gray-200">
											{group.projects.map(project => (
												<article
													key={project.title}
													className="py-7 first:pt-0 last:pb-0 print:break-inside-auto print:py-3">
													<header className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 gap-y-2 print:mb-2 print:break-after-avoid">
														<h6 className="text-base font-bold leading-7 text-gray-950 dark:text-gray-100 print:text-[15px] print:!text-gray-950">
															{project.title}
														</h6>
														{project.date && (
															<span className="text-xs text-gray-500 print:!text-gray-500 dark:text-gray-400">
																{project.date}
															</span>
														)}
													</header>

													<dl className="space-y-3 print:space-y-2">
														{project.details.map((detail, index) => (
															<div
																key={PROJECT_DETAIL_LABELS[index] ?? index}
																className="grid grid-cols-[48px_1fr] gap-4 print:break-inside-avoid print:grid-cols-[38px_1fr] print:gap-3">
																<dt className="text-xs font-semibold leading-7 text-destructive print:leading-6">
																	{PROJECT_DETAIL_LABELS[index] ?? '상세'}
																</dt>
																<dd className="text-sm leading-7 text-gray-700 dark:text-gray-200 print:leading-6 print:!text-gray-800">
																	{renderHighlightedText(detail.title, detail.highlights)}
																	{detail.links?.map(link => (
																		<ResumeLink key={link.url} title={link.title} url={link.url} />
																	))}
																</dd>
															</div>
														))}
													</dl>
												</article>
											))}
										</div>
									</section>
								))}
							</div>
						</article>
					);
				})}
			</div>
		</ResumeContainer>
	);
}
