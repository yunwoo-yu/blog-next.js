import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import remarkA11yEmoji from "@fec/remark-a11y-emoji";
import remarkBreaks from "remark-breaks";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkA11yEmoji, remarkBreaks],
    rehypePlugins: [
      [
        rehypePrettyCode,
        { theme: { dark: "github-dark-dimmed", light: "github-light" } },
      ],
      rehypeSlug,
    ],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
