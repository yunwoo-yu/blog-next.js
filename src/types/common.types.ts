import { JSXElementConstructor, ReactElement } from "react";

export interface CompileMdxTypes {
  title: string;
  createdAt: string;
  thumbnail: string;
  description: string;
  tags: string[];
}

export interface PostListTypes {
  frontmatter: CompileMdxTypes;
  category: string;
  slug: string;
}
