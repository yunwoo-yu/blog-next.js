import Image from 'next/image';

import { type Exhibit, getAllScreens, type ServiceScreen } from '@/portfolio/exhibits';
import { cn } from '@/utils/utils';

import { SectionTitle } from './ui';

const Screen = ({ screen }: { screen: ServiceScreen }) => (
	<figure>
		<div
			className="relative overflow-hidden rounded-2xl border border-pf-line bg-pf-gray-50"
			style={{ aspectRatio: `${screen.width} / ${screen.height}` }}>
			<Image
				src={screen.src}
				alt={screen.alt}
				fill
				sizes={screen.device === 'mobile' ? '(min-width: 640px) 220px, 45vw' : '(min-width: 768px) 720px, 100vw'}
				className="object-cover object-top"
			/>
		</div>
		<figcaption className="mt-2 break-keep text-[13px] leading-[1.5] text-pf-gray-600">{screen.caption}</figcaption>
	</figure>
);

/** 공개 서비스 화면. 사례 화면이 아니라 서비스 맥락이므로 캡션에 출처·날짜를 그대로 둔다. */
const CaseScreens = ({ exhibit }: { exhibit: Exhibit }) => {
	const screens = getAllScreens(exhibit).filter(
		(screen, index, all) => all.findIndex(other => other.src === screen.src) === index,
	);

	if (screens.length === 0) return null;

	const desktop = screens.filter(screen => screen.device === 'desktop');
	const mobile = screens.filter(screen => screen.device === 'mobile');

	return (
		<section id="screens" aria-labelledby="screens-title" className="mt-16">
			<SectionTitle id="screens-title">지금 공개된 화면이에요</SectionTitle>
			<p className="mt-2 text-[15px] text-pf-gray-600">작업 당시 화면과 다를 수 있어요.</p>
			{desktop.length > 0 && (
				<ul className="mt-6 grid gap-8">
					{desktop.map(screen => (
						<li key={screen.src}>
							<Screen screen={screen} />
						</li>
					))}
				</ul>
			)}
			{mobile.length > 0 && (
				<ul className={cn('grid grid-cols-2 gap-4 sm:grid-cols-3', desktop.length > 0 ? 'mt-8' : 'mt-6')}>
					{mobile.map(screen => (
						<li key={screen.src}>
							<Screen screen={screen} />
						</li>
					))}
				</ul>
			)}
		</section>
	);
};

export default CaseScreens;
