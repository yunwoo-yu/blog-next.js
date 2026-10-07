import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/** 사용자의 "움직임 줄이기" 설정. 서버와 첫 렌더는 false 이고, hydration 뒤에 실제 값으로 바뀐다. */
const useReducedMotion = () => {
	const [reduced, setReduced] = useState(false);

	useEffect(() => {
		const query = window.matchMedia?.(QUERY);
		if (!query) return;

		setReduced(query.matches);
		const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
		query.addEventListener('change', onChange);

		return () => query.removeEventListener('change', onChange);
	}, []);

	return reduced;
};

export default useReducedMotion;
