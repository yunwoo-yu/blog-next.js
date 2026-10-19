import Link from 'next/link';

import { renderRichText } from '@/components/resume/highlight';
import { META_AUTHOR_NAME } from '@/constant';
import { buildCasePath, PORTFOLIO_CASES, type PortfolioCase } from '@/portfolio/cases';
import {
	getPortfolioActivities,
	getPortfolioExperience,
	PORTFOLIO_KEY_RESULTS,
	PORTFOLIO_LINKS,
} from '@/portfolio/overview';
import { cn } from '@/utils/utils';

import CaseRow from './CaseRow';
import { Column, FOCUS_RING, ListHeader, ListRow, SectionTitle, TEXT_LINK_CLASS } from './ui';

const buttonBase = cn(
	'inline-flex h-[52px] flex-1 items-center justify-center rounded-2xl px-6 text-[17px] font-bold transition-[background-color,transform] duration-200 ease-in-out active:scale-[0.98] sm:flex-none',
	FOCUS_RING,
);

/** 경력 순서를 지키며 회사별로 묶는다. */
const groupByOrganization = (cases: PortfolioCase[]) =>
	cases.reduce<{ organization: string; items: PortfolioCase[] }[]>((groups, item) => {
		const last = groups[groups.length - 1];

		if (last?.organization === item.organization) last.items.push(item);
		else groups.push({ organization: item.organization, items: [item] });

		return groups;
	}, []);

const PortfolioOverview = () => {
	const experience = getPortfolioExperience();
	const activities = getPortfolioActivities();
	const groups = groupByOrganization(PORTFOLIO_CASES);
	const organizations = experience.map(career => career.organization).join('·');

	return (
		<div className="pb-24">
			<Column className="pt-14 md:pt-20">
				<section aria-labelledby="hero-title">
					<h2
						id="hero-title"
						className="break-keep text-[28px] font-bold leading-[1.4] tracking-[-0.02em] text-pf-gray-900 md:text-[44px]">
						<span className="md:block">결제부터 마이데이터, 어드민까지</span>{' '}
						<span className="md:block">만들어 온 프론트엔드 개발자 {META_AUTHOR_NAME}</span>
					</h2>
					<p className="mt-4 break-keep text-[17px] leading-[1.6] text-pf-gray-700">
						{organizations}에서 맡은 {PORTFOLIO_CASES.length}개 프로젝트를 문제와 결과로 정리했어요.
					</p>
					<div className="mt-8 flex gap-2">
						<a href="#projects" className={cn(buttonBase, 'bg-pf-blue text-white hover:bg-pf-blue-700')}>
							프로젝트 보기
						</a>
						<Link
							href={PORTFOLIO_LINKS.resume.href}
							className={cn(buttonBase, 'bg-pf-gray-100 text-pf-gray-800 hover:bg-pf-gray-200')}>
							이력서 보기
						</Link>
					</div>
				</section>

				<section aria-labelledby="results-title" className="mt-16">
					<SectionTitle id="results-title">이런 결과를 냈어요</SectionTitle>
					<ul className="mt-5 grid gap-3 sm:grid-cols-3">
						{PORTFOLIO_KEY_RESULTS.map(result => (
							<li key={result.value}>
								<Link
									href={buildCasePath(result.slug)}
									className={cn(
										'flex h-full flex-col rounded-[20px] bg-pf-gray-100 p-5 transition-colors duration-200 hover:bg-pf-gray-200',
										FOCUS_RING,
									)}>
									<span className="text-[32px] font-bold leading-[1.3] tracking-[-0.02em] text-pf-blue">
										{result.value}
									</span>
									<span className="mt-1 break-keep text-[15px] leading-[1.5] text-pf-gray-700">{result.label}</span>
								</Link>
							</li>
						))}
					</ul>
				</section>

				<section id="projects" aria-labelledby="projects-title" className="mt-16 scroll-mt-6">
					<SectionTitle id="projects-title">이런 프로젝트를 했어요</SectionTitle>
					{groups.map(group => (
						<div key={group.organization}>
							<ListHeader id={`projects-${group.organization}`} title={group.organization} count={group.items.length} />
							<ul aria-labelledby={`projects-${group.organization}`}>
								{group.items.map(item => (
									<CaseRow key={item.slug} item={item} />
								))}
							</ul>
						</div>
					))}
				</section>

				<section id="experience" aria-labelledby="experience-title" className="mt-16">
					<SectionTitle id="experience-title">이런 곳에서 일했어요</SectionTitle>
					<ul className="mt-2">
						{experience.map(career => (
							<ListRow
								key={career.organization}
								title={career.organization}
								description={`${career.position} · ${career.period}`}
							/>
						))}
					</ul>
				</section>

				<section id="activities" aria-labelledby="activities-title" className="mt-16">
					<SectionTitle id="activities-title">이런 활동도 했어요</SectionTitle>
					<ul className="mt-2">
						{activities.map(activity => (
							<ListRow
								key={activity.title}
								title={activity.title}
								description={[activity.organization, activity.period].filter(Boolean).join(' · ')}
								extra={
									activity.awards.length > 0 && (
										<span className="mt-1 block break-keep text-[15px] leading-[1.6] text-pf-gray-800">
											{activity.awards.map(award => (
												<span key={award.text} className="block">
													{renderRichText(award.text, [], award.links, TEXT_LINK_CLASS)}
												</span>
											))}
										</span>
									)
								}
							/>
						))}
					</ul>
				</section>
			</Column>
		</div>
	);
};

export default PortfolioOverview;
