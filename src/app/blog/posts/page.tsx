import PostList from "@/components/posts/PostList";

import { getAllPosts, getAllPostsPath } from "@/lib/post-utils";

const BlogPostsPage = async () => {
  const postsPaths = getAllPostsPath();
  const posts = await getAllPosts(postsPaths);

  return (
    <section className="px-5 pt-5 max-w-5xl mx-auto">
      <PostList posts={posts} />
    </section>
  );
};

export default BlogPostsPage;
