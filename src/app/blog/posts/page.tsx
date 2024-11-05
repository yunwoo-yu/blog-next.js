import PostCard from "@/components/posts/PostCard";
import { getAllPosts, getAllPostsPath } from "@/lib/post-utils";

const BlogPostsPage = async () => {
  const postsPaths = getAllPostsPath();
  const posts = await getAllPosts(postsPaths);
  // const post = await readFile(
  //   `src/posts/${categoryList[0]}/created_blog.mdx`,
  //   "utf-8"
  // );

  // const { content, frontmatter } = await compileMDX<{
  //   title: string;
  //   date: string;
  // }>({
  //   source: post,
  //   components: useMDXComponents,
  //   options: {
  //     parseFrontmatter: true,
  //   },
  // });

  // console.log(content);

  return (
    <section>
      <ul>
        {posts.map((post) => (
          <PostCard data={post.frontmatter} key={post.frontmatter.title} />
        ))}
      </ul>
    </section>
  );
};

export default BlogPostsPage;
