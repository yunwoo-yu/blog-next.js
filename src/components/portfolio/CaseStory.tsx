import Image from 'next/image';

import type { Exhibit } from '@/portfolio/exhibits';
import { type CaseStory as CaseStoryData, isVisible } from '@/portfolio/stories';
import { cn } from '@/utils/utils';

interface CaseStoryProps {
	story: CaseStoryData;
	exhibit?: Exhibit;
}

const DraftBadge = () => (
	<span className="ml-2 rounded bg-pf-break/15 px-1.5 py-0.5 text-[11px] font-medium text-pf-break">
		초안 · 개발 모드에서만 보임
	</span>
);

const sectionTitle = 'text-xl font-bold md:text-2xl';

/** 이 스토리에서 실제로 보이는 판단·문제 목록. 상세 페이지의 내비가 어떤 섹션을 올릴지 정할 때도 쓴다. */
export const getVisibleStory = (story: CaseStoryData | undefined) => ({
	decisions: (story?.decisions ?? [])
		.map(decision => ({ ...decision, options: decision.options.filter(option => isVisible(option.basis)) }))
		.filter(decision => decision.options.length > 0),
	troubles: (story?.troubles ?? []).filter(trouble => isVisible(trouble.basis)),
});

/**
 * 판단 근거(고른 안을 크게, 버린 안을 한 줄로), 풀어야 했던 문제와 해결, 서비스 맥락 화면을 보여 준다.
 * 서버에서 렌더하므로 클라이언트 번들을 늘리지 않는다.
 */
const CaseStory = ({ story, exhibit }: CaseStoryProps) => {
	const { decisions, troubles } = getVisibleStory(story);
	const gallery = exhibit?.gallery ?? [];

	return (
		<>
			{decisions.length > 0 && (
				<section id="decisions" aria-labelledby="decisions-title" className="mt-14 scroll-mt-32">
					<h3 id="decisions-title" className={sectionTitle}>
						판단
					</h3>
					<ul className="mt-5 grid gap-7">
						{decisions.map(decision => {
							const chosen = decision.options.filter(option => option.verdict === 'chosen');
							const rejected = decision.options.filter(option => option.verdict === 'rejected');

							return (
								<li key={decision.question}>
									<h4 className="text-sm font-semibold text-pf-ink/60">{decision.question}</h4>
									{chosen.map(option => (
										<div key={option.name} className="mt-2 border-l-2 border-pf-accent pl-4">
											<p className="text-base font-semibold">
												{option.name}
												{option.basis === 'draft' && <DraftBadge />}
											</p>
											<p className="mt-1 text-sm leading-7 text-pf-ink/80">{option.reason}</p>
										</div>
									))}
									{rejected.map(option => (
										<p key={option.name} className="mt-2 pl-4 text-sm leading-6 text-pf-ink/65">
											<span className="font-medium">선택하지 않음 · {option.name}</span>
											{' — '}
											{option.reason}
											{option.basis === 'draft' && <DraftBadge />}
										</p>
									))}
								</li>
							);
						})}
					</ul>
				</section>
			)}

			{troubles.length > 0 && (
				<section id="troubles" aria-labelledby="troubles-title" className="mt-14 scroll-mt-32">
					<h3 id="troubles-title" className={sectionTitle}>
						문제와 해결
					</h3>
					<ol className="mt-5 grid gap-6">
						{troubles.map(trouble => (
							<li key={trouble.problem} className="grid gap-4 md:grid-cols-2 md:gap-8">
								<div className="border-t-2 border-pf-ink/50 pt-3">
									<p className="text-xs font-semibold text-pf-ink/60">
										문제
										{trouble.basis === 'draft' && <DraftBadge />}
									</p>
									<p className="mt-1 text-sm leading-7">{trouble.problem}</p>
								</div>
								<div className="border-t-2 border-pf-accent pt-3">
									<p className="text-xs font-semibold text-pf-ink/60">해결</p>
									<p className="mt-1 text-sm leading-7">{trouble.fix}</p>
								</div>
							</li>
						))}
					</ol>
				</section>
			)}

			{gallery.length > 0 && (
				<section id="screens" aria-labelledby="screens-title" className="mt-14 scroll-mt-32">
					<h3 id="screens-title" className={sectionTitle}>
						서비스 화면
					</h3>
					<p className="mt-1 text-xs text-pf-ink/60">현재 공개 화면입니다. 작업 당시 화면과 다를 수 있습니다.</p>
					<ul className="mt-4 grid grid-cols-2 items-start gap-4 md:grid-cols-3">
						{gallery.map(screen => (
							<li key={screen.src}>
								<figure>
									<div
										className={cn(
											'relative overflow-hidden rounded-lg border border-pf-ink/25 bg-white',
											screen.device === 'mobile' && 'mx-auto max-w-[140px]',
										)}
										style={{ aspectRatio: `${screen.width} / ${screen.height}` }}>
										<Image
											src={screen.src}
											alt={screen.alt}
											fill
											sizes={screen.device === 'mobile' ? '140px' : '(min-width: 768px) 300px, 50vw'}
											className="object-cover object-top"
										/>
									</div>
									<figcaption className="mt-2 text-[11px] leading-4 text-pf-ink/60">{screen.caption}</figcaption>
								</figure>
							</li>
						))}
					</ul>
				</section>
			)}
		</>
	);
};

export default CaseStory;
