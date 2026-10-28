import { getPrintContacts } from '@/portfolio/print';

/** 이메일·GitHub·블로그·이력서 4줄. 종이에서도 읽히도록 주소를 글자 그대로 보여 준다. */
const PrintContacts = ({ className }: { className?: string }) => (
	<address className={className}>
		<ul className="pf-contacts">
			{getPrintContacts().map(({ label, value, href }) => (
				<li key={label}>
					<span className="pf-contact-label">{label}</span>
					<a href={href}>{value}</a>
				</li>
			))}
		</ul>
	</address>
);

export default PrintContacts;
