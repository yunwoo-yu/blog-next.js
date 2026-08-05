import { getPostEntries, getThumbnailDecision, inspectImage } from './thumbnail-utils.mjs';

const posts = getPostEntries();
const errors = [];
const counts = new Map();

for (const post of posts) {
	const decision = getThumbnailDecision(post);
	counts.set(decision.type, (counts.get(decision.type) ?? 0) + 1);

	try {
		await inspectImage(decision.publicPath);
	} catch (error) {
		errors.push({
			post: `${post.category}/${post.slug}`,
			type: decision.type,
			publicPath: decision.publicPath,
			message: error instanceof Error ? error.message : String(error),
		});
	}
}

if (errors.length) {
	console.error(`Thumbnail verification failed: ${errors.length} error(s)`);

	for (const error of errors) {
		console.error(`- ${error.post} [${error.type}] ${error.publicPath}: ${error.message}`);
	}

	console.error(
		'\nRun `yarn thumbnail:generate` to create generated fallback thumbnails, or fix the frontmatter path.',
	);
	process.exit(1);
}

const countText = [...counts.entries()].map(([type, count]) => `${type}: ${count}`).join(', ');
console.log(`Thumbnail verification passed for ${posts.length} post(s). ${countText}`);
