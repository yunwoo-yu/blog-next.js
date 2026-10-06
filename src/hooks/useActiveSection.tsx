import { useEffect, useState } from 'react';

// 화면 위쪽 1/3 지점에 걸친 섹션을 현재 섹션으로 본다. 고정 헤더와 포트폴리오 내비 높이를 감안한 값이다.
const ROOT_MARGIN = '-120px 0px -60% 0px';

/**
 * 주어진 id 의 섹션 중 현재 읽고 있는 것을 돌려준다.
 * IntersectionObserver 가 없거나 JS 가 꺼져 있으면 null 이고, 내비는 앵커 링크로만 동작한다.
 */
const useActiveSection = (ids: string[]) => {
	const [activeId, setActiveId] = useState<string | null>(null);
	const key = ids.join('|');

	useEffect(() => {
		if (typeof IntersectionObserver === 'undefined') return;

		const targets = key
			.split('|')
			.filter(Boolean)
			.map(id => document.getElementById(id))
			.filter((element): element is HTMLElement => element !== null);
		const visible = new Set<string>();

		const observer = new IntersectionObserver(
			entries => {
				for (const entry of entries) {
					if (entry.isIntersecting) visible.add(entry.target.id);
					else visible.delete(entry.target.id);
				}

				// 여러 섹션이 걸치면 문서 순서상 먼저 나온 것을 고른다.
				const current = targets.find(target => visible.has(target.id));

				if (current) setActiveId(current.id);
			},
			{ rootMargin: ROOT_MARGIN, threshold: 0 },
		);

		for (const target of targets) observer.observe(target);

		return () => observer.disconnect();
	}, [key]);

	return activeId;
};

export default useActiveSection;
