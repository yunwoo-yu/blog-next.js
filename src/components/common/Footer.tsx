import dayjs from 'dayjs';
import Link from 'next/link';

import { GITHUB_URL, LINKEDIN_URL } from '@/constant';

import { GitHubIcon, LinkedInIcon } from './Icons';

const Footer = () => {
	return (
		<footer className="flex flex-col items-center justify-center gap-3 border-t py-10">
			<article className="flex justify-center gap-3">
				<Link
					href={GITHUB_URL}
					target="_blank"
					aria-label="github link button"
					className="flex size-9 items-center justify-center rounded-md border border-input">
					<GitHubIcon width={16} height={16} />
				</Link>
				<Link
					href={LINKEDIN_URL}
					target="_blank"
					aria-label="linkedin link button"
					className="flex size-9 items-center justify-center rounded-md border border-input">
					<LinkedInIcon width={16} height={16} />
				</Link>
			</article>
			<p className="text-sm">Ycow &bull; &copy; {dayjs().format('YYYY')}. All rights reserved</p>
		</footer>
	);
};

export default Footer;
