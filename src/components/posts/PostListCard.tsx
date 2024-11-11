import { cn } from "@/lib/utils";
import { CompileMdxTypes } from "@/types/common.types";
import { randomUUID } from "crypto";

interface PostCardProps {
  data: CompileMdxTypes;
  category: string;
  slug: string;
}

const PostListCard = ({ data, category, slug }: PostCardProps) => {
  return (
    <li className="flex flex-col px-2 py-5 border-t border-gray-400 cursor-pointer">
      <p className="text-xl">{data.title}</p>
      <div className="flex text-xs my-1">
        <span className="text-gray-400">{data.createdAt}</span>
        <div>
          {data.tags.map((tag, idx) => (
            <span
              className={cn("text-gray-500", !idx ? "ml-2" : "ml-1")}
              key={randomUUID()}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <p className="text-sm mt-1 text-gray-500 dark:text-gray-300">
        {data.description}
      </p>
    </li>
  );
};

export default PostListCard;
