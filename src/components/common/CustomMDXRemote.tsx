// @ts-expect-error no types
import remarkA11yEmoji from "@fec/remark-a11y-emoji";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { useMDXComponents } from "@/mdx-components";

interface CustomMDXRemoteProps {
  source: string;
}

const CustomMDXRemote = ({ source }: CustomMDXRemoteProps) => {
  return (
    <MDXRemote
      source={source}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkA11yEmoji, remarkBreaks],
          rehypePlugins: [
            [
              rehypePrettyCode,
              {
                keepBackground: false,
                theme: {
                  dark: "github-dark",
                  light: "github-light",
                },
              },
            ],
            rehypeSlug,
          ],
        },
      }}
      components={useMDXComponents}
    />
  );
};

export default CustomMDXRemote;
