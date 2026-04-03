import type { Metadata } from 'next';

import CareerDetail from '@/components/career/CareerDetail';
import Activities from '@/components/resume/Activities';
import Careers from '@/components/resume/Careers';
import Education from '@/components/resume/Education';
import Introduce from '@/components/resume/Introduce';
import PrintButton from '@/components/resume/PrintButton';
import ResumeFooter from '@/components/resume/ResumeFooter';
import ResumeHeader from '@/components/resume/ResumeHeader';

export const metadata: Metadata = {
	robots: { index: false, follow: false },
};

interface ResumePageProps {
	searchParams: Promise<{ full?: string; detail?: string }>;
}

export default async function ResumePage({ searchParams }: ResumePageProps) {
	const { full, detail } = await searchParams;
	const isFull = full === 'true';
	const isDetailOnly = detail === 'true';

	if (isDetailOnly) {
		return (
			<div className="mx-auto max-w-5xl px-6 py-16 sm:px-16 print:max-w-none print:bg-white print:px-10 print:py-6 dark:print:bg-black">
				<section className="rounded-lg bg-secondary px-8 py-12 sm:px-14 sm:py-14 print:rounded-none print:bg-white print:px-0 print:py-0 dark:print:bg-black">
					<div className="mb-8 flex items-start justify-between print:mb-6">
						<div>
							<h2 className="text-3xl font-bold print:text-2xl">경력기술서</h2>
							<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">유윤우 — 프론트엔드 개발자</p>
						</div>
						<PrintButton />
					</div>
					<CareerDetail />
				</section>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-5xl px-6 py-16 sm:px-16 print:max-w-none print:bg-white print:px-10 print:py-6 dark:print:bg-black">
			<section className="rounded-lg bg-secondary px-8 py-12 sm:px-14 sm:py-14 print:rounded-none print:bg-white print:px-0 print:py-0 dark:print:bg-black">
				<ResumeHeader />
				<Introduce />
				<Careers />
				<div className="print:break-before-page">
					<Activities />
				</div>
				<Education />
				{isFull ? (
					<div className="mt-16 print:mt-8">
						<div className="mb-8 print:mb-6">
							<h2 className="text-3xl font-bold print:text-2xl">경력기술서</h2>
							<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">유윤우 — 프론트엔드 개발자</p>
						</div>
						<CareerDetail />
					</div>
				) : (
					<ResumeFooter />
				)}
			</section>
		</div>
	);
}
