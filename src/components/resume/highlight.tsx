import type { ResumeLinkProps } from './ResumeLink';

const escapeRegExp = (value: string) => value.replace(/[.*+?^{}$()|[\]\\]/g, '\\$&');

/** 인쇄용 전역 스타일(a { text-decoration: none })을 !로 덮어써 PDF에서도 링크임이 보이게 한다. */
const linkClassName =
	'text-blue-600 underline underline-offset-2 hover:text-blue-700 print:!text-blue-700 print:!underline dark:text-blue-400';

/**
 * 강조 문구는 굵게, 링크는 문장 안의 같은 문구에 직접 건다.
 * 문장에 링크 제목이 없으면 끝에 "(제목)" 형태로 붙인다. 대괄호 형태([제목])는 쓰지 않는다.
 */
export const renderRichText = (
	text: string,
	highlights: string[] = [],
	links: ResumeLinkProps[] = [],
	linkClass: string = linkClassName,
) => {
	const inText = links.filter(link => text.includes(link.title));
	const trailing = links.filter(link => !text.includes(link.title));
	const tokens = [...highlights, ...inText.map(link => link.title)];

	const body =
		tokens.length === 0
			? [text]
			: text.split(new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'g')).map((part, index) => {
					const link = inText.find(item => item.title === part);

					if (link) {
						return (
							<a
								key={`${part}-${index}`}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className={linkClass}>
								{part}
							</a>
						);
					}

					return highlights.includes(part) ? (
						<strong key={`${part}-${index}`} className="font-bold text-gray-950 print:!text-gray-950 dark:text-gray-50">
							{part}
						</strong>
					) : (
						part
					);
				});

	return (
		<>
			{body}
			{trailing.length > 0 && (
				<>
					{' ('}
					{trailing.map((link, index) => (
						<span key={link.url}>
							{index > 0 && ', '}
							<a href={link.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
								{link.title}
							</a>
						</span>
					))}
					{')'}
				</>
			)}
		</>
	);
};

export const renderHighlightedText = (text: string, highlights: string[]) => renderRichText(text, highlights);
