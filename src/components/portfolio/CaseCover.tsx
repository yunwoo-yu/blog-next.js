import { getCaseCover } from '@/portfolio/covers';
import { cn } from '@/utils/utils';

/** 사례 맨 위 표지. 실제 화면이 아니므로 아이콘과 색 면만 쓰고 장식으로 둔다. */
const CaseCover = ({ slug }: { slug: string }) => {
	const { icon: Icon, tone } = getCaseCover(slug);

	return (
		<div
			aria-hidden="true"
			data-testid="case-cover"
			className={cn('relative mt-8 flex h-24 items-center justify-center overflow-hidden rounded-3xl md:h-28', tone)}>
			<span className="absolute -right-8 -top-10 size-44 rounded-full bg-white/40" />
			<span className="absolute -bottom-12 -left-6 size-36 rounded-full bg-white/30" />
			<Icon className="relative size-10 md:size-12" strokeWidth={1.75} />
		</div>
	);
};

export default CaseCover;
