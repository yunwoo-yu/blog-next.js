import { type CaseStory as CaseStoryData, isVisible } from '@/portfolio/stories';

/** 초안(basis: draft)은 개발 모드에서만 보인다. 운영 빌드에서는 isVisible 이 걸러 낸다. */
const DraftBadge = () => (
	<span className="ml-2 inline-block rounded bg-pf-gray-100 px-1.5 py-0.5 align-middle text-[12px] font-normal text-pf-gray-700">
		초안 · 개발 모드에서만 보임
	</span>
);

const subTitle = 'text-[17px] font-bold text-pf-gray-900';

/** 이 스토리에서 실제로 보이는 판단·문제 목록. */
export const getVisibleStory = (story: CaseStoryData | undefined) => ({
	decisions: (story?.decisions ?? [])
		.map(decision => ({ ...decision, options: decision.options.filter(option => isVisible(option.basis)) }))
		.filter(decision => decision.options.length > 0),
	troubles: (story?.troubles ?? []).filter(trouble => isVisible(trouble.basis)),
});

/** 판단(고른 방법을 크게, 고르지 않은 방법을 회색으로)과 풀어야 했던 문제를 단순한 목록으로 보여 준다. */
const CaseStory = ({ story }: { story: CaseStoryData | undefined }) => {
	const { decisions, troubles } = getVisibleStory(story);

	return (
		<>
			{decisions.length > 0 && (
				<section id="decisions" aria-labelledby="decisions-title" className="mt-10">
					<h4 id="decisions-title" className={subTitle}>
						이렇게 판단했어요
					</h4>
					<ul className="mt-2 divide-y divide-pf-gray-200">
						{decisions.map(decision => {
							const chosen = decision.options.filter(option => option.verdict === 'chosen');
							const rejected = decision.options.filter(option => option.verdict === 'rejected');

							return (
								<li key={decision.question} className="py-5">
									<p className="break-keep text-[14px] text-pf-gray-600">{decision.question}</p>
									{chosen.map(option => (
										<div key={option.name} className="mt-1.5">
											<p className="break-keep text-[16px] font-bold leading-[1.5] text-pf-gray-900">
												{option.name}
												{option.basis === 'draft' && <DraftBadge />}
											</p>
											<p className="mt-1 break-keep text-[15px] leading-[1.7] text-pf-gray-700">{option.reason}</p>
										</div>
									))}
									{rejected.length > 0 && (
										<ul className="mt-3 grid gap-2 rounded-2xl bg-pf-gray-50 p-4">
											{rejected.map(option => (
												<li key={option.name} className="break-keep text-[14px] leading-[1.6] text-pf-gray-700">
													<span className="font-bold text-pf-gray-800">고르지 않은 방법 · {option.name}</span>
													<br />
													{option.reason}
													{option.basis === 'draft' && <DraftBadge />}
												</li>
											))}
										</ul>
									)}
								</li>
							);
						})}
					</ul>
				</section>
			)}

			{troubles.length > 0 && (
				<section id="troubles" aria-labelledby="troubles-title" className="mt-10">
					<h4 id="troubles-title" className={subTitle}>
						이런 문제를 풀었어요
					</h4>
					<ol className="mt-2 divide-y divide-pf-gray-200">
						{troubles.map(trouble => (
							<li key={trouble.problem} className="py-5">
								<p className="break-keep text-[16px] font-bold leading-[1.5] text-pf-gray-900">
									{trouble.problem}
									{trouble.basis === 'draft' && <DraftBadge />}
								</p>
								<p className="mt-1 break-keep text-[15px] leading-[1.7] text-pf-gray-700">{trouble.fix}</p>
							</li>
						))}
					</ol>
				</section>
			)}
		</>
	);
};

export default CaseStory;
