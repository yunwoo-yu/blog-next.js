import { JSXElementConstructor, ReactElement } from "react";

export interface CompileMdxTypes {
  title: string;
  createdAt: string;
  thumbnail: string;
  description: string;
  tags: string[];
}

export interface PostListTypes {
  content: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
  frontmatter: CompileMdxTypes;
  category: string;
  slug: string;
}
