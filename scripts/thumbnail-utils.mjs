import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';
import sharp from 'sharp';
import { VFile } from 'vfile';
import { matter } from 'vfile-matter';

export const postsRoot = path.join(process.cwd(), 'src', 'mdx');
export const publicRoot = path.join(process.cwd(), 'public');

const localImagePattern = /\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i;

export const isRemotePath = value => /^https?:\/\//i.test(value);

export const isLocalImagePath = value => value.startsWith('/images/') && localImagePattern.test(value);

const stripCodeBlocks = source => source.replace(/```[\s\S]*?```/g, '').replace(/~~~[\s\S]*?~~~/g, '');

export const getGeneratedThumbnailPath = (category, slug) => `/images/${category}/${slug}/thumbnail.png`;

export const extractFirstLocalImage = source => {
	const sourceWithoutCode = stripCodeBlocks(source);
	const markdownImages = [...sourceWithoutCode.matchAll(/!\[[^\]]*]\(\s*<?([^)\s>]+)>?(?:\s+['"][^'"]*['"])?\s*\)/g)];
	const htmlImages = [...sourceWithoutCode.matchAll(/<img\b[^>]*\bsrc=(['"])(.*?)\1[^>]*>/g)];

	return [
		...markdownImages.map(match => ({ index: match.index, src: match[1] })),
		...htmlImages.map(match => ({ index: match.index, src: match[2] })),
	]
		.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
		.find(image => isLocalImagePath(image.src))?.src;
};

export const parseFrontmatter = source => {
	const file = new VFile(source);

	matter(file);

	const frontmatter = file.data.matter ?? {};

	return {
		...frontmatter,
		tags: (frontmatter.tags ?? []).map(String),
		thumbnail: frontmatter.thumbnail ?? '',
	};
};

export const getPostEntries = () =>
	globSync(path.join(postsRoot, '**', 'index.mdx'))
		.sort()
		.map(filePath => {
			const source = readFileSync(filePath, 'utf-8');
			const [category, slug] = filePath.split(path.sep).slice(-3);

			return {
				filePath,
				category,
				slug,
				source,
				frontmatter: parseFrontmatter(source),
			};
		});

export const getThumbnailDecision = post => {
	const explicitThumbnail = post.frontmatter.thumbnail?.trim();

	if (explicitThumbnail) {
		return { type: 'frontmatter', publicPath: explicitThumbnail };
	}

	const firstImage = extractFirstLocalImage(post.source);

	if (firstImage) {
		return { type: 'first-image', publicPath: firstImage };
	}

	return { type: 'generated', publicPath: getGeneratedThumbnailPath(post.category, post.slug) };
};

export const publicPathToFilePath = publicPath => {
	const pathWithoutQuery = publicPath.split(/[?#]/)[0];
	const filePath = path.resolve(publicRoot, pathWithoutQuery.replace(/^\/+/, ''));

	if (filePath !== publicRoot && !filePath.startsWith(`${publicRoot}${path.sep}`)) {
		throw new Error(`${publicPath} escapes public directory`);
	}

	return filePath;
};

export const inspectImage = async publicPath => {
	if (isRemotePath(publicPath)) {
		const response = await fetch(publicPath, { method: 'HEAD' });

		if (!response.ok) {
			throw new Error(`remote image returned ${response.status}`);
		}

		const contentType = response.headers.get('content-type') ?? '';

		if (!contentType.startsWith('image/')) {
			throw new Error(`remote content-type is ${contentType || 'empty'}`);
		}

		return { remote: true, contentType };
	}

	if (!isLocalImagePath(publicPath)) {
		throw new Error('thumbnail must be a local /images/* image path or an http(s) image URL');
	}

	const filePath = publicPathToFilePath(publicPath);

	if (!existsSync(filePath)) {
		throw new Error(`file does not exist: ${path.relative(process.cwd(), filePath)}`);
	}

	if (statSync(filePath).size === 0) {
		throw new Error(`file is empty: ${path.relative(process.cwd(), filePath)}`);
	}

	const metadata = await sharp(filePath, { animated: true }).metadata();

	if (!metadata.width || !metadata.height) {
		throw new Error(`image dimensions are missing: ${path.relative(process.cwd(), filePath)}`);
	}

	return metadata;
};
