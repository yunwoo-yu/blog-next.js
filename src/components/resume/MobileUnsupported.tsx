import { Monitor } from 'lucide-react';

export default function MobileUnsupported() {
	return (
		<div className="flex min-h-[70vh] items-center justify-center px-6 py-16 md:hidden print:hidden">
			<div className="flex max-w-sm flex-col items-center text-center">
				<Monitor className="mb-6 h-12 w-12 text-gray-400" />
				<h1 className="text-xl font-bold">모바일 환경은 지원하지 않습니다</h1>
				<p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
					이 페이지는 데스크톱 열람 및 인쇄 출력에 최적화되어 있습니다.
					<br />
					PC 환경에서 열어주세요.
				</p>
			</div>
		</div>
	);
}
