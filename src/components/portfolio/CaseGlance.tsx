import type { PortfolioKeyResult } from '@/portfolio/overview';
import { cn } from '@/utils/utils';

interface CaseGlanceProps {
	summary: string;
	/** 수치가 있는 사례에만 넘긴다. 없으면 숫자 영역을 그리지 않고 요약을 크게 보여 준다. */
	keyResult: PortfolioKeyResult | undefined;
}

/** 사례 맨 위 "한눈에": 있을 때만 큰 숫자 하나, 그리고 한 줄 요약. */
const CaseGlance = ({ summary, keyResult }: CaseGlanceProps) => (
	<section aria-label="한눈에 보기" className="mt-8 rounded-3xl bg-pf-gray-50 p-6 md:p-8">
		{keyResult && (
			<div data-testid="case-number" className="mb-6 border-b border-pf-line pb-6">
				<p className="text-[56px] font-bold leading-[1.1] tracking-[-0.03em] text-pf-blue md:text-[64px]">
					{keyResult.value}
				</p>
				<p className="mt-2 break-keep text-[15px] leading-[1.55] text-pf-gray-700">{keyResult.label}</p>
			</div>
		)}
		<p
			className={cn(
				'break-keep font-bold text-pf-gray-900',
				keyResult ? 'text-[17px] leading-[1.65]' : 'text-[22px] leading-[1.55] tracking-[-0.02em] md:text-[24px]',
			)}>
			{summary}
		</p>
	</section>
);

export default CaseGlance;
