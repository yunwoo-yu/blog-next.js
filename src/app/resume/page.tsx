import type { Metadata } from 'next';

import Activities from '@/components/resume/Activities';
import Careers from '@/components/resume/Careers';
import Education from '@/components/resume/Education';
import Introduce from '@/components/resume/Introduce';
import Projects from '@/components/resume/Projects';
import ResumeHeader from '@/components/resume/ResumeHeader';
import ResumeSheet from '@/components/resume/ResumeSheet';
import Skills from '@/components/resume/Skills';
import { META_AUTHOR_NAME } from '@/constant';

export const metadata: Metadata = {
	title: `${META_AUTHOR_NAME}_프론트엔드_이력서`,
	robots: { index: false, follow: false },
};

export default function ResumePage() {
	return (
		<div className="mx-auto max-w-5xl px-3 py-6 sm:px-6 sm:py-10 md:px-16 md:py-16 print:max-w-none print:bg-white print:px-6 print:pb-0 print:pt-4">
			<ResumeSheet>
				<ResumeHeader />
				<Introduce />
				<Skills />
				<Careers />
				<Projects />
				<div className="mt-16 print:mt-4">
					<Education />
					<Activities />
				</div>
			</ResumeSheet>
		</div>
	);
}
