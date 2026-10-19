export const renderHighlightedText = (text: string, highlights: string[]) => {
	if (highlights.length === 0) return text;

	const escapedHighlights = highlights.map(highlight => highlight.replace(/[.*+?^{}$()|[\]\\]/g, '\\$&'));
	const pattern = new RegExp(`(${escapedHighlights.join('|')})`, 'g');

	return text.split(pattern).map((part, index) =>
		highlights.includes(part) ? (
			<strong key={[part, index].join('-')} className="font-bold text-gray-950 print:!text-gray-950 dark:text-gray-50">
				{part}
			</strong>
		) : (
			part
		),
	);
};
