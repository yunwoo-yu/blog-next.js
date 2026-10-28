import { getPrintContacts } from '@/portfolio/print';

import { cn } from '@/utils/utils';

import { CONTACT_LABEL_CLASS } from './PrintParts';

/** 이메일·GitHub·블로그·이력서 4줄. 종이에서도 읽히도록 주소를 글자 그대로 보여 준다. */
const PrintContacts = ({ className }: { className?: string }) => (
	<address className={cn('not-italic', className)}>
		<ul>
			{getPrintContacts().map(({ label, value, href }) => (
				<li key={label} className="flex gap-[3mm] text-[9.5pt] leading-[1.7]">
					<span className={CONTACT_LABEL_CLASS}>{label}</span>
					<a href={href}>{value}</a>
				</li>
			))}
		</ul>
	</address>
);

export default PrintContacts;
