import type { Metadata } from 'next';

import Activities from '@/components/resume/Activities';
import Careers from '@/components/resume/Careers';
import Education from '@/components/resume/Education';
import Introduce from '@/components/resume/Introduce';
import KeyOutcomes from '@/components/resume/KeyOutcomes';
import Projects from '@/components/resume/Projects';
import ResumeHeader from '@/components/resume/ResumeHeader';
import ResumeSheet from '@/components/resume/ResumeSheet';

export const metadata: Metadata = {
	robots: { index: false, follow: false },
};

export default function ResumePage() {
	return (
		<div className="mx-auto max-w-5xl px-3 py-6 sm:px-6 sm:py-10 md:px-16 md:py-16 print:max-w-none print:bg-white print:px-6 print:py-4">
			<ResumeSheet>
				<ResumeHeader />
				<Introduce />
				<KeyOutcomes />
				<Careers />
				<Projects />
				<div className="mt-16 print:mt-8">
					<Activities />
					<Education />
				</div>
			</ResumeSheet>
		</div>
	);
}
