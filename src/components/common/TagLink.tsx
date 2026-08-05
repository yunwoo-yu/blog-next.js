import Link from 'next/link';

import { cn } from '@/utils/utils';

interface TagLinkProps {
	tag: string;
	className?: string;
}

/** 태그에 공백·한글이 섞여 있어 경로에 넣을 때 반드시 인코딩한다. */
export const buildTagPath = (tag: string) => `/blog/tags/${encodeURIComponent(tag)}`;

const TagLink = ({ tag, className }: TagLinkProps) => (
	<Link
		href={buildTagPath(tag)}
		className={cn('text-destructive transition hover:underline hover:underline-offset-2', className)}>
		#{tag}
	</Link>
);

export default TagLink;
