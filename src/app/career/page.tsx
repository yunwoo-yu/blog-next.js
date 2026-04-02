import type { Metadata } from 'next';

import CareerDetail from '@/components/career/CareerDetail';
import CareerHeader from '@/components/career/CareerHeader';

export const metadata: Metadata = {
	robots: { index: false, follow: false },
};

export default function CareerPage() {
	return (
		<div className="mx-auto max-w-4xl px-5 py-20 print:max-w-none print:bg-white print:px-10 print:py-6 dark:print:bg-black">
			<CareerHeader />
			<CareerDetail />
		</div>
	);
}
