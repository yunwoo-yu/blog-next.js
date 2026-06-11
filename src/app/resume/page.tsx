import type { Metadata } from 'next';

import Activities from '@/components/resume/Activities';
import Careers from '@/components/resume/Careers';
import Education from '@/components/resume/Education';
import Introduce from '@/components/resume/Introduce';
import MobileUnsupported from '@/components/resume/MobileUnsupported';
import ResumeHeader from '@/components/resume/ResumeHeader';
import ResumeSheet from '@/components/resume/ResumeSheet';

export const metadata: Metadata = {
	robots: { index: false, follow: false },
};

export default function ResumePage() {
	return (
		<>
			<MobileUnsupported />
			<div className="mx-auto hidden max-w-5xl px-6 py-16 sm:px-16 md:block print:block print:max-w-none print:bg-white print:px-6 print:py-4">
				<ResumeSheet>
					<ResumeHeader />
					<Introduce />
					<Careers />
					<div className="mt-16 print:mt-8">
						<Activities />
						<Education />
					</div>
				</ResumeSheet>
			</div>
		</>
	);
}
