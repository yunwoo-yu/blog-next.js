import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { renderRichText } from '@/components/resume/highlight';
import { META_AUTHOR_NAME } from '@/constant';
import RESUME from '@/constant/resume';
import { buildCasePath, PORTFOLIO_CASES, type PortfolioCase } from '@/portfolio/cases';
import { getCaseCover } from '@/portfolio/covers';
import {
	getPortfolioActivities,
	getPortfolioExperience,
	PORTFOLIO_KEY_RESULTS,
	PORTFOLIO_LINKS,
} from '@/portfolio/overview';
import { cn } from '@/utils/utils';

import CaseRow from './CaseRow';
import CountUp from './CountUp';
import { Column, FOCUS_RING, ListHeader, ListRow, PRIMARY_BUTTON_CLASS, SectionTitle, TEXT_LINK_CLASS } from './ui';

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
					<p className="text-[17px] font-bold text-pf-blue-700">프론트엔드 개발자</p>
					<h2
						id="hero-title"
						className="mt-2 break-keep text-[52px] font-bold leading-[1.15] tracking-[-0.03em] text-pf-gray-900 md:text-[80px]">
						{META_AUTHOR_NAME}
					</h2>
					<p className="mt-5 break-keep text-[17px] leading-[1.6] text-pf-gray-700">
						{organizations}에서 {RESUME.projects.length}개 서비스를 맡아 풀어 온 {PORTFOLIO_CASES.length}가지
						문제입니다.
					</p>
					<div className="mt-8 flex gap-2">
						<a href="#projects" className={cn(buttonBase, PRIMARY_BUTTON_CLASS)}>
							프로젝트 보기
						</a>
						<Link
							href={PORTFOLIO_LINKS.resume.href}
							className={cn(buttonBase, 'bg-pf-gray-100 text-pf-gray-800 hover:bg-pf-gray-200')}>
							이력서 보기
						</Link>
					</div>
				</section>

				<section aria-label="주요 결과" className="mt-14">
					<ul className="grid grid-cols-2 gap-3">
						{PORTFOLIO_KEY_RESULTS.map((result, index) => {
							const featured = index === 0;
							const { icon: Icon, tone } = getCaseCover(result.slug);

							return (
								<li key={result.value} className={cn(featured && PORTFOLIO_KEY_RESULTS.length > 2 && 'col-span-2')}>
									<Link
										href={buildCasePath(result.slug)}
										className={cn(
											'group flex h-full flex-col rounded-[28px] p-5 transition-[transform,background-color] duration-200 ease-in-out hover:-translate-y-0.5 active:scale-[0.99] md:p-8',
											featured ? 'bg-pf-gray-900 text-white' : 'bg-pf-gray-100 text-pf-gray-800 hover:bg-pf-gray-200',
											FOCUS_RING,
										)}>
										<span className="flex items-center gap-2.5">
											<span
												aria-hidden="true"
												className={cn('flex size-9 items-center justify-center rounded-xl', tone)}>
												<Icon size={18} strokeWidth={2.25} />
											</span>
											<span className={cn('text-[14px] font-bold', featured ? 'text-pf-blue-100' : 'text-pf-blue-700')}>
												{result.tag}
											</span>
										</span>
										<span
											className={cn(
												'mt-3 font-bold leading-[1.1] tracking-[-0.03em]',
												featured
													? 'text-[56px] md:text-[88px]'
													: 'text-[26px] text-pf-blue sm:text-[36px] md:text-[40px]',
											)}>
											<CountUp value={result.value} />
										</span>
										<span
											className={cn(
												'mt-3 break-keep text-[14px] leading-[1.5] sm:mt-4 sm:text-[15px]',
												featured ? 'text-pf-gray-400' : 'text-pf-gray-700',
											)}>
											{result.label}
										</span>
										<span
											aria-hidden="true"
											className={cn(
												'mt-4 inline-flex items-center gap-1 text-[14px] font-bold sm:mt-6',
												featured ? 'text-white' : 'text-pf-gray-900',
											)}>
											사례 보기
											<ArrowUpRight
												size={18}
												className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
											/>
										</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</section>

				<section id="projects" aria-labelledby="projects-title" className="mt-16 scroll-mt-6">
					<SectionTitle id="projects-title">프로젝트</SectionTitle>
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
					<SectionTitle id="experience-title">경력</SectionTitle>
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
					<SectionTitle id="activities-title">활동</SectionTitle>
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
