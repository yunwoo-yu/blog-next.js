import { CompileMdxTypes } from "@/types/common.types";
import { readFileSync } from "fs";
import { globSync } from "glob";
import { compileMDX } from "next-mdx-remote/rsc";

const PATH = process.cwd() + "/src/posts";

export const getAllPostsPath = (category?: string) => {
  return globSync(`${PATH}/${category ? category : "**"}/**/*.mdx`);
};

export const getPostDetail = async (category: string, slug: string) => {
  const postPath = `${PATH}/${category}/${slug}/index.mdx`;
  const source = readFileSync(postPath, "utf-8");
  const deleteFrontmatterSource = source.replace(/---[\s\S]*?---/, "");
  const { frontmatter } = await compileMDX<CompileMdxTypes>({
    source,
    options: {
      parseFrontmatter: true,
    },
  });

  return { source: deleteFrontmatterSource, frontmatter };
};

export const getAllPosts = async (postPaths: string[]) => {
  const ParsingPosts = postPaths.map(async (post) => {
    const source = readFileSync(post, "utf-8");
    const { frontmatter } = await compileMDX<CompileMdxTypes>({
      source,
      options: {
        parseFrontmatter: true,
      },
    });
    const [category, slug] = post.split("/").slice(-3);

    return { frontmatter, category, slug };
  });
  const posts = await Promise.all(ParsingPosts);

  return posts.sort((a, b) =>
    a.frontmatter.createdAt > b.frontmatter.createdAt ? -1 : 1
  );
};
