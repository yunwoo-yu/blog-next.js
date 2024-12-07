import { useEffect, useRef, useState } from 'react';

const useObserverToc = () => {
	const observerRef = useRef<IntersectionObserver>();
	const [activeIds, setActiveIds] = useState<string[]>([]);

	useEffect(() => {
		observerRef.current = new IntersectionObserver(
			entries => {
				const visibleEntries = entries
					.filter(entry => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio);

				if (visibleEntries.length > 0) {
					const entryId = `#${visibleEntries[0].target.id}`;
					setActiveIds([entryId]);
				}
			},
			{ rootMargin: '-97px 0px -40% 0px', threshold: [0.1, 0.9] },
		);

		const titles = document.querySelectorAll('h3');

		titles.forEach(title => {
			observerRef.current?.observe(title);
			title.style.scrollMargin = '100px';
		});

		return () => {
			observerRef.current?.disconnect();
		};
	}, []);

	return { activeIds };
};

export default useObserverToc;
