import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { AnchorHTMLAttributes } from 'react';

/**
 * 마크다운 링크는 평범한 <a> 로 렌더되어 Next 라우터가 가로채지 않는다.
 * 그대로 두면 글 사이를 오갈 때마다 전체 페이지가 새로 로드된다.
 * 내부 링크만 next/link 로 바꾸고 외부 링크는 건드리지 않는다.
 */
const MdxAnchor = ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
	if (href?.startsWith('/')) {
		return (
			<Link href={href} {...props}>
				{children}
			</Link>
		);
	}

	return (
		<a href={href} {...props}>
			{children}
		</a>
	);
};

export const mdxComponents: MDXComponents = {
	a: MdxAnchor,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		...components,
		...mdxComponents,
	};
}
