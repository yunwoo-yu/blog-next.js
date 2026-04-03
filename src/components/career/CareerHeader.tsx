import PrintButton from '@/components/resume/PrintButton';

export default function CareerHeader() {
	return (
		<div className="mb-10 flex items-start justify-between">
			<div>
				<h1 className="text-3xl font-bold">경력기술서</h1>
				<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">유윤우 — 프론트엔드 개발자</p>
			</div>
			<PrintButton />
		</div>
	);
}
