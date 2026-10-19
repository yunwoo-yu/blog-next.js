import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { renderRichText } from '@/components/resume/highlight';
import { getAdjacentCases, type PortfolioCase } from '@/portfolio/cases';
import { getExhibit } from '@/portfolio/exhibits';
import { PORTFOLIO_PATH } from '@/portfolio/links';
import { getStory } from '@/portfolio/stories';
import { cn } from '@/utils/utils';

import CaseRow from './CaseRow';
import CaseScreens from './CaseScreens';
import CaseStory from './CaseStory';
import { Column, FOCUS_RING, SectionTitle, TEXT_LINK_CLASS } from './ui';

interface CaseStudyProps {
	item: PortfolioCase;
	/** 본문 뒤, 다른 사례 앞에 들어가는 보조 영역. */
	children?: ReactNode;
}

/** 이력서 원문의 문제·기여·결과를 그대로 싣는 섹션 제목. id 는 예전에 공개한 앵커(#problem 등)를 유지한다. */
const STAGE_TITLES = {
	problem: '어떤 문제였나요',
	contribution: '어떻게 풀었나요',
	result: '결과가 어땠나요',
} as const;

const CaseStudy = ({ item, children }: CaseStudyProps) => {
	const { prev, next } = getAdjacentCases(item.slug);
	const exhibit = getExhibit(item.slug);
	const story = getStory(item.slug);
	const meta = [item.organization, item.service, item.period].filter(Boolean).join(' · ');
	const resultStage = item.stages.find(stage => stage.id === 'result');
	// 상단 결과 박스와 같은 문장이면 아래에 같은 말을 한 번 더 쓰지 않는다. 박스가 #result 앵커를 맡는다.
	const resultInBox = Boolean(exhibit && resultStage && resultStage.text.trim() === exhibit.callouts.outcome.trim());

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
					<h2 className="break-keep text-[28px] font-bold leading-[1.4] tracking-[-0.02em] text-pf-gray-900 md:text-[32px]">
						{item.title}
					</h2>
					<p className="mt-2 break-keep text-[15px] text-pf-gray-600">{meta}</p>
				</header>

				{exhibit && (
					<section aria-label="결과" id={resultInBox ? 'result' : undefined} className="mt-8 scroll-mt-6">
						<p className="break-keep rounded-2xl bg-pf-blue-50 px-5 py-4 text-[17px] font-bold leading-[1.6] text-pf-blue-700">
							{exhibit.callouts.outcome}
						</p>
						<p className="mt-2 break-keep text-[13px] leading-[1.5] text-pf-gray-600">
							근거: {exhibit.callouts.outcomeBasis}
						</p>
					</section>
				)}

				<p className="mt-8 break-keep text-[17px] leading-[1.7] text-pf-gray-800">{item.summary}</p>

				{item.stages
					.filter(stage => !(resultInBox && stage.id === 'result'))
					.map(stage => (
						<section key={stage.id} id={stage.id} aria-labelledby={`${stage.id}-title`} className="mt-14 scroll-mt-6">
							<SectionTitle id={`${stage.id}-title`}>{STAGE_TITLES[stage.id]}</SectionTitle>
							<p className="mt-4 break-keep text-[17px] leading-[1.75] text-pf-gray-800">
								{renderRichText(stage.text, stage.highlights, stage.links, TEXT_LINK_CLASS)}
							</p>
							{stage.id === 'contribution' && <CaseStory story={story} />}
						</section>
					))}

				{exhibit && <CaseScreens exhibit={exhibit} />}

				{children}
			</article>

			{(prev || next) && (
				<nav aria-labelledby="other-cases-title" className="mt-16">
					<SectionTitle id="other-cases-title">다른 프로젝트도 볼 수 있어요</SectionTitle>
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
