import Link from 'next/link';

import { META_AUTHOR_NAME } from '@/constant';
import { PORTFOLIO_CASES } from '@/portfolio/cases';
import { EXHIBITS } from '@/portfolio/exhibits';
import {
	getPortfolioActivities,
	getPortfolioExperience,
	PORTFOLIO_LINKS,
	PORTFOLIO_SECTIONS,
} from '@/portfolio/overview';

import CaseCard from './CaseCard';
import PortfolioNav from './PortfolioNav';
import PortfolioWorld from './PortfolioWorld';

const sectionTitleStyle = 'text-2xl font-bold tracking-tight md:text-3xl';
const sectionStyle = 'scroll-mt-32 py-12 md:py-16';
const buttonStyle =
	'inline-flex h-11 items-center rounded-md px-5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F] motion-reduce:transition-none';

const PortfolioOverview = () => {
	const experience = getPortfolioExperience();
	const activities = getPortfolioActivities();
	const caseGroups = PORTFOLIO_CASES.reduce<{ organization: string; items: typeof PORTFOLIO_CASES }[]>(
		(groups, item) => {
			const last = groups[groups.length - 1];

			if (last?.organization === item.organization) last.items.push(item);
			else groups.push({ organization: item.organization, items: [item] });

			return groups;
		},
		[],
	);
	const summary = `${PORTFOLIO_CASES.length}개 프로젝트 · ${experience.map(career => `${career.organization} ${career.period.replace(/\s*\(.*\)/, '')}`).join(' · ')}`;
	const metas = PORTFOLIO_CASES.map(({ slug, organization, period }) => ({ slug, organization, period }));

	return (
		<div>
			<PortfolioNav sections={PORTFOLIO_SECTIONS} />

			<PortfolioWorld exhibits={EXHIBITS} metas={metas}>
				<header className="mx-auto w-full max-w-6xl px-4 pb-10 pt-12 sm:px-6 md:pb-14 md:pt-20">
					<p className="font-mono text-xs uppercase tracking-[0.18em] text-pf-ink/60">
						Front-End Developer · Portfolio
					</p>
					<h2 className="mt-4 max-w-4xl break-keep text-5xl font-bold leading-[1.1] tracking-tight md:text-8xl">
						{META_AUTHOR_NAME}
					</h2>
					<p className="mt-6 max-w-2xl text-base leading-7 text-pf-ink/75 md:text-lg md:leading-8">{summary}</p>
					<div className="mt-7 flex flex-wrap gap-2">
						<a href="#world-start" className={`${buttonStyle} bg-pf-ink text-pf-paper hover:opacity-90`}>
							사례 보기
						</a>
						<Link
							href={PORTFOLIO_LINKS.resume.href}
							className={`${buttonStyle} border border-pf-ink/40 hover:border-pf-ink`}>
							이력서
						</Link>
					</div>
				</header>
			</PortfolioWorld>

			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<section id="cases" aria-labelledby="cases-title" className={`${sectionStyle} border-t border-pf-ink/20`}>
					<h3 id="cases-title" className={sectionTitleStyle}>
						사례 전체
					</h3>
					{caseGroups.map(group => (
						<div key={group.organization} className="mt-8">
							<h4 className="text-sm font-semibold text-pf-ink/60">{group.organization}</h4>
							<ul className="mt-3 grid gap-5 md:grid-cols-2">
								{group.items.map(item => (
									<CaseCard key={item.slug} item={item} />
								))}
							</ul>
						</div>
					))}
				</section>

				<section
					id="experience"
					aria-labelledby="experience-title"
					className={`${sectionStyle} border-t border-pf-ink/20`}>
					<h3 id="experience-title" className={sectionTitleStyle}>
						경력
					</h3>
					<ol className="mt-6 grid gap-6 md:grid-cols-2">
						{experience.map(career => (
							<li key={career.organization} className="border-l-2 border-pf-signal pl-4">
								<h4 className="text-lg font-bold">{career.organization}</h4>
								<p className="mt-1 text-sm text-pf-ink/70">
									{career.position} · {career.period}
								</p>
								<ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${career.organization} 기술 스택`}>
									{career.techStack.map(tech => (
										<li key={tech} className="rounded-md border border-pf-ink/20 px-2 py-0.5 text-xs">
											{tech}
										</li>
									))}
								</ul>
							</li>
						))}
					</ol>
				</section>

				<section
					id="activities"
					aria-labelledby="activities-title"
					className={`${sectionStyle} border-t border-pf-ink/20`}>
					<h3 id="activities-title" className={sectionTitleStyle}>
						활동
					</h3>
					<ol className="mt-6 grid gap-6 md:grid-cols-3">
						{activities.map(activity => (
							<li key={activity.title} className="border-l-2 border-pf-ink/40 pl-4">
								<h4 className="text-lg font-bold">{activity.title}</h4>
								<p className="mt-1 text-sm text-pf-ink/70">
									{[activity.organization, activity.period].filter(Boolean).join(' · ')}
								</p>
								<ul className="mt-3 grid gap-2 text-sm leading-6">
									{activity.items.map(item => (
										<li key={item.text}>
											{item.text}
											{item.links.map(link => (
												<a
													key={link.url}
													href={link.url}
													target="_blank"
													rel="noopener noreferrer"
													className="ml-1 text-destructive underline-offset-2 hover:underline">
													[{link.title}]
												</a>
											))}
										</li>
									))}
								</ul>
							</li>
						))}
					</ol>
				</section>
			</div>
		</div>
	);
};

export default PortfolioOverview;
