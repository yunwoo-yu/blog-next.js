import { type CaseStory as CaseStoryData, getVisibleStory } from '@/portfolio/stories';
import { cn } from '@/utils/utils';

import Paragraphs from './Paragraphs';
import SequenceDiagram from './SequenceDiagram';

/** 초안(basis: draft)은 개발 모드에서만 보인다. 운영 빌드에서는 isVisible 이 걸러 낸다. */
const DraftBadge = () => (
	<span className="ml-2 inline-block rounded bg-pf-gray-100 px-1.5 py-0.5 align-middle text-[12px] font-normal text-pf-gray-700">
		초안 · 개발 모드에서만 보임
	</span>
);

const subTitle = 'text-[17px] font-bold text-pf-gray-900';

/** 판단(고른 방법을 크게, 고르지 않은 방법을 회색으로)과 풀어야 했던 문제를 단순한 목록으로 보여 준다. */
const CaseStory = ({ story }: { story: CaseStoryData | undefined }) => {
	const { decisions, troubles } = getVisibleStory(story);

	return (
		<>
			{decisions.length > 0 && (
				<section id="decisions" aria-labelledby="decisions-title" className="mt-10">
					<h4 id="decisions-title" className={subTitle}>
						판단
					</h4>
					<ul className="mt-3 grid gap-8">
						{decisions.map(decision => {
							const chosen = decision.options.filter(option => option.verdict === 'chosen');
							const rejected = decision.options.filter(option => option.verdict === 'rejected');

							return (
								<li key={decision.question}>
									<p className="break-keep text-[15px] font-bold leading-[1.5] text-pf-gray-700">{decision.question}</p>
									<div className={cn('mt-3 grid gap-3', rejected.length > 0 && 'sm:grid-cols-2')}>
										{chosen.map(option => (
											<div
												key={option.name}
												data-testid="decision-chosen"
												className="rounded-2xl border border-pf-blue-100 bg-pf-blue-50 p-5">
												<p className="text-[13px] font-bold text-pf-blue-700">선택한 방법</p>
												<p className="mt-1.5 break-keep text-[16px] font-bold leading-[1.5] text-pf-gray-900">
													{option.name}
													{option.basis === 'draft' && <DraftBadge />}
												</p>
												<p className="mt-1.5 break-keep text-[15px] leading-[1.7] text-pf-gray-800">{option.reason}</p>
											</div>
										))}
										{rejected.map(option => (
											<div key={option.name} data-testid="decision-rejected" className="rounded-2xl bg-pf-gray-50 p-5">
												<p className="text-[13px] font-bold text-pf-gray-600">검토했지만 고르지 않은 방법</p>
												<p className="mt-1.5 break-keep text-[16px] font-bold leading-[1.5] text-pf-gray-800">
													{option.name}
													{option.basis === 'draft' && <DraftBadge />}
												</p>
												<p className="mt-1.5 break-keep text-[15px] leading-[1.7] text-pf-gray-700">{option.reason}</p>
											</div>
										))}
									</div>
								</li>
							);
						})}
					</ul>
				</section>
			)}

			{troubles.length > 0 && (
				<section id="troubles" aria-labelledby="troubles-title" className="mt-10">
					<h4 id="troubles-title" className={subTitle}>
						풀었던 문제
					</h4>
					<ol className="mt-3 divide-y divide-pf-line">
						{troubles.map(trouble => (
							<li key={trouble.problem} data-testid="trouble" className="py-8 first:pt-2 last:pb-0">
								<h5 className="break-keep text-[19px] font-bold leading-[1.5] tracking-[-0.01em] text-pf-gray-900">
									{trouble.problem}
									{trouble.basis === 'draft' && <DraftBadge />}
								</h5>
								{trouble.diagram && <SequenceDiagram diagram={trouble.diagram} />}
								<div data-testid="trouble-fix" className="mt-5">
									<Paragraphs text={trouble.fix} className="text-[16px] leading-[1.75] text-pf-gray-800" />
								</div>
							</li>
						))}
					</ol>
				</section>
			)}
		</>
	);
};

export default CaseStory;
