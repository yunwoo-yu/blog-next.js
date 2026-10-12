'use client';

import { useState } from 'react';

import { EXHIBITS } from '@/portfolio/exhibits';
import { cn } from '@/utils/utils';

import ServiceExhibit from './ServiceExhibit';

/** 랜딩의 대표 전시. 사례를 고르면 같은 자리에서 화면·도식·3D 무대가 바뀐다. */
const ExhibitShowcase = () => {
	const [slug, setSlug] = useState(EXHIBITS[0].slug);
	const exhibit = EXHIBITS.find(item => item.slug === slug) ?? EXHIBITS[0];

	return (
		<div>
			<fieldset className="flex min-w-0 flex-wrap gap-2 border-0 p-0">
				<legend className="sr-only">전시할 사례 선택</legend>
				{EXHIBITS.map(item => (
					<button
						key={item.slug}
						type="button"
						aria-pressed={item.slug === slug}
						onClick={() => setSlug(item.slug)}
						className={cn(
							'inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F] motion-reduce:transition-none',
							item.slug === slug ? 'border-pf-accent bg-pf-accent text-white' : 'border-pf-ink/30 hover:border-pf-ink',
						)}>
						{item.shortTitle}
					</button>
				))}
			</fieldset>
			<div className="mt-8">
				<ServiceExhibit key={exhibit.slug} exhibit={exhibit} headingLevel={3} priority />
			</div>
		</div>
	);
};

export default ExhibitShowcase;
