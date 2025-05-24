'use client';

import { useTheme } from 'next-themes';

import { Button } from '../ui/button';
import Address from './Address';
import NameTitle from './NameTitle';

export default function ResumeHeader() {
	const { setTheme, theme } = useTheme();

	const handlePrint = async () => {
		const originTheme = theme as string;
		setTheme('light');

		await new Promise(resolve => setTimeout(resolve, 50));

		window.print();
		setTheme(originTheme);
	};

	return (
		<div>
			<h2 className="sr-only">주니어 프론트엔드 개발자 이력서</h2>
			<NameTitle />
			<Address />
			<Button className="print:hidden" onClick={handlePrint}>
				임시 프린트 버튼
			</Button>
		</div>
	);
}
