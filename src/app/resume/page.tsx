import Careers from '@/components/resume/Careers';
import Divider from '@/components/ui/divider';

import Introduce from '../../components/resume/Introduce';
import ResumeHeader from '../../components/resume/ResumeHeader';

export default function ResumePage() {
	return (
		<div className="mx-auto max-w-6xl px-20 py-20 print:px-0 print:py-0">
			<section className="bg-secondary px-16 py-16 print:px-10 print:py-10">
				<ResumeHeader />
				<Divider strokeWidth={2} />
				<Introduce />
				<Divider strokeWidth={2} />
				<Careers />
			</section>
		</div>
	);
}
