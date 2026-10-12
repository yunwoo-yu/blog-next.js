import { useEffect, useState } from 'react';

const isDark = () => document.documentElement.classList.contains('dark');

/** html 의 dark 클래스를 따라간다. 서버와 첫 렌더는 false 이고, hydration 뒤에 실제 값으로 바뀐다. */
const useDarkMode = () => {
	const [dark, setDark] = useState(false);

	useEffect(() => {
		setDark(isDark());

		const observer = new MutationObserver(() => setDark(isDark()));
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

		return () => observer.disconnect();
	}, []);

	return dark;
};

export default useDarkMode;
