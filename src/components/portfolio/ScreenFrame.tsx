import Image from 'next/image';

import { type Exhibit, getStageScreen, type ServiceScreen, type Variant } from '@/portfolio/exhibits';
import { cn } from '@/utils/utils';

interface ScreenFrameProps {
	exhibit: Exhibit;
	variant: Variant;
	/** 첫 화면에 보이는 이미지는 우선 로드한다 */
	priority?: boolean;
}

/** 기기 프레임. 가로세로 비율을 고정해 이미지가 바뀌어도 레이아웃이 움직이지 않는다. */
const Device = ({ screen, priority, className }: { screen: ServiceScreen; priority?: boolean; className?: string }) => (
	<div
		className={cn(
			'overflow-hidden rounded-[14px] border border-pf-ink/80 bg-pf-ink p-1 shadow-[0_18px_40px_-24px_rgba(20,22,26,0.7)]',
			className,
		)}>
		<div
			className="relative overflow-hidden rounded-[10px] bg-white"
			style={{ aspectRatio: `${screen.width} / ${screen.height}` }}>
			<Image
				src={screen.src}
				alt={screen.alt}
				fill
				sizes={screen.device === 'mobile' ? '160px' : '(min-width: 1024px) 460px, 100vw'}
				priority={priority}
				className="object-cover object-top"
			/>
		</div>
	</div>
);

/**
 * 공개 캡처가 있을 때만 그린다. 없으면 자리를 비워 두지 않고 null 이라, 전시가 도식 하나로 읽힌다.
 * 캡션은 출처와 촬영일을 밝히고, 개선 당시의 화면이라고 주장하지 않는다.
 */
const ScreenFrame = ({ exhibit, variant, priority }: ScreenFrameProps) => {
	const screen = getStageScreen(exhibit, variant);

	if (!screen) return null;

	return (
		<figure className="flex flex-col gap-2" data-testid="screen-frame">
			<Device screen={screen} priority={priority} className={screen.device === 'mobile' ? 'mx-auto w-40' : undefined} />
			<figcaption className="text-[12px] leading-5 text-pf-ink/70">{screen.caption}</figcaption>
		</figure>
	);
};

export default ScreenFrame;
