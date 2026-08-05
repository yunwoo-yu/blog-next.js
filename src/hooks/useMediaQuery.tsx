'use client';

import { useEffect, useState } from 'react';

/** Tailwind md 브레이크포인트. 데스크톱 판정 기준을 CSS와 맞춘다. */
export const DESKTOP_QUERY = '(min-width: 768px)';

/**
 * 서버는 뷰포트를 모르므로 초기값은 항상 false다.
 * 초기 렌더에서 매치 여부를 추측하면 hydration 불일치가 난다.
 *
 * 보이는 것을 이걸로 가르면 서버가 그린 모바일 UI가 한 번 스친다.
 * 화면 분기는 CSS 미디어 쿼리로 하고, 이 값은 서버·클라이언트가 같은 결과를 내는 계산에만 쓴다.
 */
const useMediaQuery = (query: string) => {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const mediaQueryList = window.matchMedia(query);

		setMatches(mediaQueryList.matches);

		const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches);

		mediaQueryList.addEventListener('change', handleChange);

		return () => mediaQueryList.removeEventListener('change', handleChange);
	}, [query]);

	return matches;
};

export default useMediaQuery;
