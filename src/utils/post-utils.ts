import { readFileSync } from 'fs';
import { readdir } from 'fs/promises';
import { globSync } from 'glob';
import { compileMDX } from 'next-mdx-remote/rsc';

import { CompileMdxTypes, HeadingTypes } from '@/types/common.types';

const PATH = process.cwd() + '/src/mdx';

export const getAllPostsPath = (category?: string) => {
	return globSync(`${PATH}/${category ? category : '**'}/**/*.mdx`);
};

export const getPostDetail = async (category: string, slug: string) => {
	const postPath = `${PATH}/${category}/${slug}/index.mdx`;
	const source = readFileSync(postPath, 'utf-8');
	const deleteFrontmatterSource = source.replace(/---[\s\S]*?---/, '');

	const { frontmatter } = await compileMDX<CompileMdxTypes>({
		source,
		options: {
			parseFrontmatter: true,
		},
	});

	return { source: deleteFrontmatterSource, frontmatter };
};

export const getAllPosts = async (postPaths: string[]) => {
	const ParsingPosts = postPaths.map(async post => {
		const source = readFileSync(post, 'utf-8');

		const { frontmatter } = await compileMDX<CompileMdxTypes>({
			source,
			options: {
				parseFrontmatter: true,
			},
		});
		const [category, slug] = post.split('/').slice(-3);

		return { frontmatter, category, slug };
	});

	const posts = await Promise.all(ParsingPosts);

	return posts.sort((a, b) => (a.frontmatter.createdAt > b.frontmatter.createdAt ? -1 : 1));
};

export const getCategoryList = async () => {
	const dirCategory = await readdir(PATH, { withFileTypes: true });
	let allCount = 0;

	const categoryNameList = dirCategory.map(category => {
		const postLength = getAllPostsPath(category.name).length;

		allCount += postLength;

		return { label: category.name, count: postLength };
	});

	return { categoryNameList, allCount };
};

export const getHeaderNavigationList = (source: string) => {
	const regex = /^(##|###) (.*$)/gim;
	const headingList = source.match(regex);
	const result: HeadingTypes[] = [];
	let currentSection: null | HeadingTypes = null;

	const parseHref = (text: string) => {
		return text
			.replace(/[\u{1F600}-\u{1F6FF}]/gu, '')
			.replace(/\p{Emoji_Presentation}/gu, '')
			.replace(/[\[\]:!@#$/%^&*()+=,.]/g, '')
			.replace(/ /g, '-')
			.replace(/\?/g, '')
			.toLowerCase();
	};

	headingList?.forEach(heading => {
		if (heading.startsWith('## ')) {
			const textH2 = heading.replace('## ', '');

			currentSection = {
				text: textH2,
				href: '#' + parseHref(textH2),
				children: [],
			};

			result.push(currentSection);
		}

		if (heading.startsWith('### ')) {
			const textH3 = heading.replace('### ', '');

			if (currentSection?.children) {
				currentSection.children.push({
					text: textH3,
					href: '#' + parseHref(textH3),
				});
			} else {
				result.push({
					text: textH3,
					href: '#' + parseHref(textH3),
				});
			}
		}
	});

	return result;
};
