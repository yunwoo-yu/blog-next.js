import { useCallback, useEffect, useRef, useState } from 'react';

const useScrollDirection = () => {
	const [showHeader, setShowHeader] = useState<boolean>(true);
	const lastScrollYRef = useRef<number>(0);

	const scrollThreshold = 5; // 작은 변화 허용 한계

	const handleScroll = useCallback(() => {
		const currentScrollY = window.scrollY;
		const lastScrollY = lastScrollYRef.current;

		if (Math.abs(currentScrollY - lastScrollY) >= scrollThreshold) {
			if (currentScrollY > lastScrollY) {
				setShowHeader(false);
			} else {
				setShowHeader(true);
			}

			lastScrollYRef.current = currentScrollY;
		}
	}, [lastScrollYRef, scrollThreshold]);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [handleScroll]);

	return showHeader;
};

export default useScrollDirection;
