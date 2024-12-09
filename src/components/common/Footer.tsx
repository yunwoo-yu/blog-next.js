import dayjs from 'dayjs';
import Link from 'next/link';

import { GITHUB_URL, LINKEDIN_URL } from '@/constant';

import { Button } from '../ui/button';
import { GitHubIcon, LinkedInIcon } from './Icons';

const Footer = () => {
	return (
		<footer className="flex flex-col items-center justify-center gap-3 border-t py-10">
			<article className="flex justify-center gap-3">
				<Button size="icon" aria-label="github link button">
					<Link
						href={GITHUB_URL}
						target="_blank"
						aria-label="github link button"
						className="flex h-full w-full items-center justify-center">
						<GitHubIcon className="h-9 w-9" />
					</Link>
				</Button>
				<Button size="icon" aria-label="linkedin link button">
					<Link
						href={LINKEDIN_URL}
						target="_blank"
						aria-label="linkedin link button"
						className="flex h-full w-full items-center justify-center">
						<LinkedInIcon className="h-9 w-9" />
					</Link>
				</Button>
			</article>
			<p className="text-sm">Ycow &bull; &copy; {dayjs().format('YYYY')}. All rights reserved</p>
		</footer>
	);
};

export default Footer;
