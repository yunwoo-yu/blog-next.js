import { mkdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

import {
	getGeneratedThumbnailPath,
	getPostEntries,
	getThumbnailDecision,
	publicPathToFilePath,
} from './thumbnail-utils.mjs';

const width = 1200;
const height = 630;
const force = process.argv.includes('--force') || process.argv.includes('--all');
const dryRun = process.argv.includes('--dry-run');

const escapeHtml = value =>
	String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

const truncate = (value, maxLength) => {
	const text = String(value ?? '').trim();

	return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
};

const wrapText = (value, maxLength, maxLines) => {
	const words = String(value ?? '')
		.trim()
		.split(/\s+/)
		.filter(Boolean);
	const lines = [];

	for (const word of words.length ? words : ['']) {
		const current = lines.at(-1);

		if (!current || `${current} ${word}`.length > maxLength) {
			lines.push(word);
		} else {
			lines[lines.length - 1] = `${current} ${word}`;
		}
	}

	return lines
		.flatMap(line => {
			if (line.length <= maxLength) return [line];

			return line.match(new RegExp(`.{1,${maxLength}}`, 'g')) ?? [];
		})
		.slice(0, maxLines)
		.map((line, index, allLines) =>
			index === allLines.length - 1 && lines.join('').length > maxLength * maxLines ? truncate(line, maxLength) : line,
		);
};

const renderSvg = post => {
	const titleLines = wrapText(post.frontmatter.title, 24, 3);
	const description = truncate(post.frontmatter.description, 84);
	const tags = post.frontmatter.tags
		.slice(0, 4)
		.map(tag => `#${tag}`)
		.join(' ');
	const category = post.category.toUpperCase();

	return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
	<rect width="${width}" height="${height}" fill="#111827"/>
	<rect x="0" y="0" width="${width}" height="${height}" fill="url(#background)"/>
	<rect x="72" y="72" width="1056" height="486" rx="28" fill="#F8FAFC"/>
	<rect x="72" y="72" width="1056" height="486" rx="28" fill="url(#card)" opacity="0.86"/>
	<text x="116" y="136" fill="#BE123C" font-size="28" font-weight="800" font-family="Pretendard, Apple SD Gothic Neo, Noto Sans CJK KR, Arial, sans-serif" letter-spacing="4">${escapeHtml(category)}</text>
	${titleLines
		.map(
			(line, index) =>
				`<text x="116" y="${232 + index * 74}" fill="#0F172A" font-size="58" font-weight="800" font-family="Pretendard, Apple SD Gothic Neo, Noto Sans CJK KR, Arial, sans-serif">${escapeHtml(line)}</text>`,
		)
		.join('\n')}
	<text x="116" y="476" fill="#475569" font-size="30" font-weight="500" font-family="Pretendard, Apple SD Gothic Neo, Noto Sans CJK KR, Arial, sans-serif">${escapeHtml(description)}</text>
	<text x="116" y="522" fill="#64748B" font-size="24" font-weight="600" font-family="Pretendard, Apple SD Gothic Neo, Noto Sans CJK KR, Arial, sans-serif">${escapeHtml(tags)}</text>
	<defs>
		<linearGradient id="background" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
			<stop stop-color="#0F172A"/>
			<stop offset="0.44" stop-color="#164E63"/>
			<stop offset="1" stop-color="#881337"/>
		</linearGradient>
		<linearGradient id="card" x1="72" y1="72" x2="1128" y2="558" gradientUnits="userSpaceOnUse">
			<stop stop-color="#FFFFFF"/>
			<stop offset="1" stop-color="#E2E8F0"/>
		</linearGradient>
	</defs>
</svg>`;
};

const posts = getPostEntries();
const created = [];
const skipped = [];

for (const post of posts) {
	const decision = getThumbnailDecision(post);
	const generatedPublicPath = getGeneratedThumbnailPath(post.category, post.slug);
	const generatedFilePath = publicPathToFilePath(generatedPublicPath);

	if (!force && decision.type !== 'generated') {
		skipped.push(`${post.category}/${post.slug} (${decision.type})`);
		continue;
	}

	if (!force && decision.type === 'generated') {
		try {
			await sharp(generatedFilePath).metadata();
			skipped.push(`${post.category}/${post.slug} (exists)`);
			continue;
		} catch {
			// Generate below when the target file is missing or unreadable.
		}
	}

	if (!dryRun) {
		mkdirSync(path.dirname(generatedFilePath), { recursive: true });
		await sharp(Buffer.from(renderSvg(post)))
			.png()
			.toFile(generatedFilePath);
	}

	created.push(`${post.category}/${post.slug} -> ${generatedPublicPath}`);
}

if (created.length) {
	console.log(`${dryRun ? 'Would create' : 'Created'} ${created.length} thumbnail(s):`);
	console.log(created.map(item => `- ${item}`).join('\n'));
} else {
	console.log('No generated thumbnails needed.');
}

console.log(`Skipped ${skipped.length} post(s).`);
