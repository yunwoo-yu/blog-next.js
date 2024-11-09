import { CompileMdxTypes } from "@/types/common.types";
import Link from "next/link";
import React from "react";

interface PostCardProps {
  data: CompileMdxTypes;
}

const PostCard = ({ data }: PostCardProps) => {
  return (
    <li>
      {/* <Link></Link> */}
      {data.title}
    </li>
  );
};

export default PostCard;
