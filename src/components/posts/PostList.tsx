import { PostListTypes } from "@/types/common.types";
import PostListType from "./PostListType";

interface PostListProps {
  posts: PostListTypes[];
}

const PostList = ({ posts }: PostListProps) => {
  return (
    <>
      {posts.map((post) => (
        <PostListType
          data={post.frontmatter}
          category={post.category}
          slug={post.slug}
          key={post.frontmatter.title}
        />
      ))}

      {/* View Type 잠시 보류 */}
      {/* {viewType && (
        <>
          <ViewToggle viewType={viewType} onChangeViewType={onChangeViewType} />
          <ul className="flex flex-col pt-5">
            {viewType === "list"
              ? posts.map((post) => (
                  <PostListType
                    data={post.frontmatter}
                    category={post.category}
                    slug={post.slug}
                    key={post.frontmatter.title}
                  />
                ))
              : posts.map((post) => (
                  <PostCardType
                    data={post.frontmatter}
                    category={post.category}
                    slug={post.slug}
                    key={post.frontmatter.title}
                  />
                ))}
          </ul>
        </>
      )} */}
    </>
  );
};

export default PostList;
