import { useMDXComponents } from "@/mdx-components";
import { CompileMdxTypes } from "@/types/common.types";
import { readFileSync } from "fs";
import { globSync } from "glob";
import { compileMDX } from "next-mdx-remote/rsc";

const PATH = process.cwd() + "/src/posts";

export function getAllPostsPath(category?: string) {
  return globSync(`${PATH}/${category ? category : "**"}/**/*.mdx`);
}

export async function getAllPosts(postPaths: string[]) {
  const ParsingPosts = postPaths.map(async (post) => {
    const source = readFileSync(post, "utf-8");
    const { content, frontmatter } = await compileMDX<CompileMdxTypes>({
      source,
      components: useMDXComponents,
      options: {
        parseFrontmatter: true,
      },
    });
    const [category, slug] = post.split("/").slice(-3);

    return { content, frontmatter, category, slug };
  });
  const posts = await Promise.all(ParsingPosts);

  return posts.sort((a, b) =>
    a.frontmatter.createdAt > b.frontmatter.createdAt ? -1 : 1
  );
}
