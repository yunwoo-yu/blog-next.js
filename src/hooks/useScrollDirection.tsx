import { useCallback, useEffect, useRef, useState } from 'react';

const SCROLL_THRESHOLD = 5; // 작은 변화 허용 한계
const TOP_OFFSET = 80; // 이 지점보다 위에서는 항상 헤더를 보여준다

const useScrollDirection = () => {
	const [showHeader, setShowHeader] = useState<boolean>(true);
	const lastScrollYRef = useRef<number>(0);

	const handleScroll = useCallback(() => {
		const currentScrollY = window.scrollY;
		const lastScrollY = lastScrollYRef.current;

		if (currentScrollY <= TOP_OFFSET) {
			lastScrollYRef.current = currentScrollY;
			setShowHeader(true);

			return;
		}

		if (Math.abs(currentScrollY - lastScrollY) >= SCROLL_THRESHOLD) {
			setShowHeader(currentScrollY < lastScrollY);
			lastScrollYRef.current = currentScrollY;
		}
	}, []);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [handleScroll]);

	return showHeader;
};

export default useScrollDirection;
