import React from 'react';

interface Params {
	params: Promise<{ category: string }>;
}

const PostsPageWithCategory = async ({ params }: Params) => {
	const { category } = await params;

	console.log(category);

	return <div>PostsPageWithCategory</div>;
};

export default PostsPageWithCategory;
