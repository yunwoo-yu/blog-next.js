import { useMDXComponents } from "@/mdx-components";
import { CompileMdxTypes } from "@/types/common.types";
import { readFileSync } from "fs";
import { globSync } from "glob";
import { compileMDX } from "next-mdx-remote/rsc";

const PATH = process.cwd() + "/src/posts";

export function getAllPostsPath() {
  return globSync(`${PATH}/**/*.mdx`);
}

export async function getPostWithCategory(category: string) {
  return readFileSync(`src/posts/${category}/*.mdx`);
}

export async function getAllPosts(postPaths: string[]) {
  const posts = postPaths.map(async (post) => {
    const source = readFileSync(post, "utf-8");
    const { content, frontmatter } = await compileMDX<CompileMdxTypes>({
      source,
      components: useMDXComponents,
      options: {
        parseFrontmatter: true,
      },
    });

    return { content, frontmatter };
  });

  return Promise.all(posts);
}
