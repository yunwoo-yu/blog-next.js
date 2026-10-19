import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { buildCasePath, type PortfolioCase } from '@/portfolio/cases';
import { getExhibit } from '@/portfolio/exhibits';

import FlowDiagram from './FlowDiagram';

interface CaseCardProps {
	item: PortfolioCase;
}

/**
 * 사례 카드. 큰 서비스 이미지(공개 화면이 없으면 구조 도식)가 먼저 보이고, 카드 전체가 하나의 링크다.
 */
const CaseCard = ({ item }: CaseCardProps) => {
	const exhibit = getExhibit(item.slug);
	const image = exhibit?.screens.after ?? exhibit?.identity;

	return (
		<li className="group relative flex flex-col overflow-hidden rounded-lg border border-pf-ink/25 bg-pf-paper transition-colors hover:border-pf-signal focus-within:border-pf-signal motion-reduce:transition-none">
			<div className="relative aspect-[16/10] overflow-hidden border-b border-pf-ink/20 bg-pf-stage">
				{image ? (
					<Image
						src={image.src}
						alt={image.alt}
						fill
						sizes="(min-width: 768px) 440px, 100vw"
						className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
					/>
				) : (
					exhibit && (
						<div className="absolute inset-0 p-3" aria-hidden="true">
							<FlowDiagram exhibit={exhibit} variant="after" phase={3} exploded={false} />
						</div>
					)
				)}
			</div>
			<div className="flex flex-1 flex-col p-5">
				<p className="text-xs text-pf-ink/60">
					{item.organization} · {item.service}
					{item.period && ` · ${item.period}`}
				</p>
				<h3 className="mt-2 text-lg font-bold leading-snug tracking-tight">
					<Link
						href={buildCasePath(item.slug)}
						className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-[#FF5A1F]">
						{exhibit?.headline ?? item.title}
					</Link>
				</h3>
				<p className="mt-1 text-sm text-pf-ink/70">{item.title}</p>
				{exhibit && (
					<p className="mt-3 text-sm leading-6">
						<span className="mr-1.5 text-xs font-semibold text-pf-accent-text">결과</span>
						{exhibit.callouts.outcome}
					</p>
				)}
				<span className="mt-4 inline-flex items-center gap-1 text-sm font-medium" aria-hidden="true">
					전시 보기
					<ArrowUpRight size={14} />
				</span>
			</div>
		</li>
	);
};

export default CaseCard;
