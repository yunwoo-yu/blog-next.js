import PostListCard from "@/components/posts/PostListCard";
import { getAllPosts, getAllPostsPath } from "@/lib/post-utils";

const BlogPostsPage = async () => {
  const postsPaths = getAllPostsPath();
  const posts = await getAllPosts(postsPaths);

  console.log(posts);

  return (
    <section className="px-5">
      <ul className="flex flex-col mt-10 max-w-5xl mx-auto">
        {posts.map((post) => (
          <PostListCard
            data={post.frontmatter}
            category={post.category}
            slug={post.slug}
            key={post.frontmatter.title}
          />
        ))}
      </ul>
    </section>
  );
};

export default BlogPostsPage;
