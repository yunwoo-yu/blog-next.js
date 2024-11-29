'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

const Comments = () => {
	const { resolvedTheme } = useTheme();
	const theme = resolvedTheme === 'dark' ? 'dark' : 'light';

	return (
		<article className="mt-10">
			<Giscus
				id="comment"
				repo="yunwoo-yu/blog-next.js"
				repoId="R_kgDONDDR6w"
				category="✨ Comment ✨"
				categoryId="DIC_kwDONDDR684CkppG"
				mapping="pathname"
				term="Welcome"
				reactionsEnabled="1"
				emitMetadata="0"
				inputPosition="top"
				theme={theme}
				lang="ko"
				loading="eager"
			/>
		</article>
	);
};

export default Comments;
