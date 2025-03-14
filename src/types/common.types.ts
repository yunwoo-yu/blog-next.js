export interface CompileMdxTypes {
	title: string;
	createdAt: string;
	thumbnail: string;
	description: string;
	tags: string[];
}

export interface PostListTypes {
	frontmatter: CompileMdxTypes;
	category: string;
	slug: string;
}

export interface CategoryDataTypes {
	categoryNameList: { label: string; count: number }[];
	allCount: number;
}
export interface HeadingTypes {
	text: string;
	href: string;
	children?: HeadingTypes[];
}
