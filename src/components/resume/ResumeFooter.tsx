import Link from 'next/link';

export default function ResumeFooter() {
	return (
		<div className="mt-10 border-t border-gray-300 pt-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400 print:mt-6 print:pt-4">
			<p>자세한 프로젝트 이력은 경력기술서를 확인해주세요.</p>
			<p className="mt-1 hidden print:block">
				아래 링크에서도 확인할 수 있습니다:{' '}
				<span className="text-destructive">https://www.ycow-dev.com/resume</span>
			</p>
			<Link href="/career" className="mt-2 inline-block text-destructive hover:underline print:hidden">
				경력기술서 보기 →
			</Link>
		</div>
	);
}
