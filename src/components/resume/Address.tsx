import { Mail } from 'lucide-react';

import { GitHubIcon } from '@/components/common/Icons';

const ADDRESS_DATA = [
	{
		icon: <Mail size={14} />,
		label: '이메일',
		href: 'skypnal12@gmail.com',
	},
	{
		icon: <GitHubIcon width={14} height={14} />,
		label: '깃허브',
		href: 'https://github.com/yunwoo-yu',
	},
];

export default function Address() {
	return (
		<address className="mt-10 flex flex-col items-end gap-1 text-xs not-italic">
			{ADDRESS_DATA.map(({ icon, label, href }) => (
				<div className="flex" key={label}>
					<div className="mr-2 flex items-center gap-2">
						{icon} {label}
					</div>
					<div className="w-52">
						<a
							href={label === '이메일' ? `mailto:${href}` : href}
							target="_blank"
							className="underline hover:text-destructive">
							{href}
						</a>
					</div>
				</div>
			))}
		</address>
	);
}
