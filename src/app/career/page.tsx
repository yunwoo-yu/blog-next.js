import type { Metadata } from 'next';

import CareerDetail from '@/components/career/CareerDetail';
import CareerHeader from '@/components/career/CareerHeader';
import MobileUnsupported from '@/components/resume/MobileUnsupported';

export const metadata: Metadata = {
	robots: { index: false, follow: false },
};

export default function CareerPage() {
	return (
		<>
			<MobileUnsupported />
			<div className="mx-auto hidden max-w-4xl px-5 py-20 md:block print:block print:max-w-none print:bg-white print:px-10 print:py-6 dark:print:bg-black">
				<CareerHeader />
				<CareerDetail />
			</div>
		</>
	);
}
