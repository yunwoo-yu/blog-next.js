import type { Metadata } from 'next';

import CareerDetail from '@/components/career/CareerDetail';
import Activities from '@/components/resume/Activities';
import Careers from '@/components/resume/Careers';
import Education from '@/components/resume/Education';
import Introduce from '@/components/resume/Introduce';
import MobileUnsupported from '@/components/resume/MobileUnsupported';
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
			<>
				<MobileUnsupported />
				<div className="mx-auto hidden max-w-5xl px-6 py-16 sm:px-16 md:block print:block print:max-w-none print:bg-white print:px-6 print:py-4 dark:print:bg-black">
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
			</>
		);
	}

	return (
		<>
			<MobileUnsupported />
			<div className="mx-auto hidden max-w-5xl px-6 py-16 sm:px-16 md:block print:block print:max-w-none print:bg-white print:px-6 print:py-4 dark:print:bg-black">
				<section className="rounded-lg bg-secondary px-8 py-12 sm:px-14 sm:py-14 print:rounded-none print:bg-white print:px-0 print:py-0 dark:print:bg-black">
					<ResumeHeader />
					<Introduce />
					<Careers />
					{isFull ? (
						<>
							<div className="print:break-before-page">
								<Activities />
							</div>
							<Education />
							<div className="mt-16 print:mt-8">
								<div className="mb-8 print:mb-6">
									<h2 className="text-3xl font-bold print:text-2xl">경력기술서</h2>
									<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">유윤우 — 프론트엔드 개발자</p>
								</div>
								<CareerDetail />
							</div>
						</>
					) : (
						<div className="print:break-before-page print:flex print:min-h-[260mm] print:flex-col">
							<div>
								<Activities />
								<Education />
							</div>
							<div className="print:mt-auto">
								<ResumeFooter />
							</div>
						</div>
					)}
				</section>
			</div>
		</>
	);
}
