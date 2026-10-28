import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { renderRichText } from '@/components/resume/highlight';
import { getAdjacentCases, type PortfolioCase } from '@/portfolio/cases';
import { getCaseCover } from '@/portfolio/covers';
import { getExhibit } from '@/portfolio/exhibits';
import { PORTFOLIO_PATH } from '@/portfolio/links';
import { PORTFOLIO_KEY_RESULTS } from '@/portfolio/overview';
import { getStory } from '@/portfolio/stories';
import { cn } from '@/utils/utils';

import CaseCover from './CaseCover';
import CaseGlance from './CaseGlance';
import CaseRow from './CaseRow';
import CaseStory from './CaseStory';
import Paragraphs from './Paragraphs';
import { Column, FOCUS_RING, SectionTitle, TEXT_LINK_CLASS } from './ui';

interface CaseStudyProps {
	item: PortfolioCase;
	/** 본문 뒤, 다른 사례 앞에 들어가는 보조 영역. */
	children?: ReactNode;
}

/** 이력서 원문의 문제·기여·결과를 그대로 싣는 섹션 제목. id 는 예전에 공개한 앵커(#problem 등)를 유지한다. */
const STAGE_TITLES = {
	problem: '문제',
	contribution: '해결',
	result: '결과',
} as const;

const CaseStudy = ({ item, children }: CaseStudyProps) => {
	const { prev, next } = getAdjacentCases(item.slug);
	const exhibit = getExhibit(item.slug);
	const story = getStory(item.slug);
	const resultStage = item.stages.find(stage => stage.id === 'result');
	const outcome = exhibit?.callouts.outcome.trim();
	// 결과 섹션 본문에 callouts.outcome 문장이 이미 들어 있으면 한 번만 보여 주고, 아니면 결과 요약으로 본문 위에 덧붙인다.
	const outcomeIsExtra = Boolean(outcome && resultStage && !resultStage.text.includes(outcome));
	const keyResult = PORTFOLIO_KEY_RESULTS.find(result => result.slug === item.slug);
	const { tone } = getCaseCover(item.slug);

	return (
		<Column className="pb-24 pt-4">
			<Link
				href={PORTFOLIO_PATH}
				className={cn(
					'-ml-2 inline-flex h-11 items-center gap-0.5 rounded-lg pl-1 pr-3 text-[15px] text-pf-gray-700 transition-colors duration-200 hover:bg-pf-gray-100',
					FOCUS_RING,
				)}>
				<ChevronLeft aria-hidden="true" size={20} />
				포트폴리오
			</Link>

			<article className="mt-6">
				<header>
					<p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-pf-gray-700">
						<span className={cn('rounded-md px-2 py-0.5 font-bold', tone)}>{item.organization}</span>
						<span>{[item.service, item.period].filter(Boolean).join(' · ')}</span>
					</p>
					<h2 className="mt-3 break-keep text-[28px] font-bold leading-[1.4] tracking-[-0.02em] text-pf-gray-900 md:text-[32px]">
						{item.title}
					</h2>
				</header>

				<CaseCover slug={item.slug} />

				<CaseGlance summary={item.summary} keyResult={keyResult} />

				{item.stages.map(stage => (
					<section key={stage.id} id={stage.id} aria-labelledby={`${stage.id}-title`} className="mt-14 scroll-mt-6">
						<SectionTitle id={`${stage.id}-title`}>{STAGE_TITLES[stage.id]}</SectionTitle>
						{stage.id === 'result' && outcomeIsExtra && (
							<p className="mt-4 break-keep rounded-2xl bg-pf-blue-50 px-5 py-4 text-[17px] font-bold leading-[1.6] text-pf-blue-700">
								{exhibit?.callouts.outcome}
							</p>
						)}
						<div className="mt-4">
							<Paragraphs
								text={stage.text}
								className="text-[17px] leading-[1.75] text-pf-gray-800"
								render={paragraph => renderRichText(paragraph, stage.highlights, stage.links, TEXT_LINK_CLASS)}
							/>
						</div>
						{stage.id === 'contribution' && <CaseStory story={story} />}
					</section>
				))}

				{children}
			</article>

			{(prev || next) && (
				<nav aria-labelledby="other-cases-title" className="mt-16">
					<SectionTitle id="other-cases-title">다른 프로젝트</SectionTitle>
					<ul className="mt-3">
						{prev && <CaseRow item={prev} description={`이전 프로젝트 · ${prev.service}`} />}
						{next && <CaseRow item={next} description={`다음 프로젝트 · ${next.service}`} />}
					</ul>
				</nav>
			)}
		</Column>
	);
};

export default CaseStudy;
