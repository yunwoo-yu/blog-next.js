import { Globe, Mail } from 'lucide-react';

import { GitHubIcon } from '@/components/common/Icons';
import { CONTACT_EMAIL, GITHUB_URL, WWW_BASE_URL } from '@/constant';

const ADDRESS_DATA = [
	{
		icon: <Mail size={14} />,
		label: '이메일',
		href: CONTACT_EMAIL,
	},
	{
		icon: <GitHubIcon width={14} height={14} />,
		label: '깃허브',
		href: GITHUB_URL,
	},
	{
		icon: <Globe size={14} />,
		label: '블로그',
		href: WWW_BASE_URL,
	},
];

export default function Address() {
	return (
		<address className="flex flex-col items-start gap-1 text-xs not-italic sm:items-end">
			{ADDRESS_DATA.map(({ icon, label, href }) => (
				<div className="flex flex-wrap" key={label}>
					<div className="mr-2 flex items-center gap-2">
						{icon} {label}
					</div>
					<div className="min-w-0 break-all sm:w-52">
						<a
							href={label === '이메일' ? `mailto:${href}` : href}
							target="_blank"
							className="underline hover:text-destructive"
							rel="noopener">
							{href}
						</a>
					</div>
				</div>
			))}
		</address>
	);
}
