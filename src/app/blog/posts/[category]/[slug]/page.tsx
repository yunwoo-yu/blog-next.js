import CustomMDXRemote from "@/components/common/CustomMDXRemote";
import { getPostDetail } from "@/utils/post-utils";
import { cn } from "@/utils/utils";
import { CalendarDays } from "lucide-react";

interface Params {
  params: Promise<{ category: string; slug: string }>;
}

const PostDetailPage = async ({ params }: Params) => {
  const { category, slug } = await params;
  const { source, frontmatter } = await getPostDetail(category, slug);

  return (
    <>
      <section className="max-w-5xl mx-auto py-10 border-border border-b">
        <h1 className="text-primary text-3xl">{frontmatter.title}</h1>
        <div className="mt-2 text-sm text-gray-400 flex justify-between">
          <span>{frontmatter.description}</span>
          <span className="flex items-center">
            <CalendarDays className="mr-1 size-4" />
            {frontmatter.createdAt}
          </span>
        </div>
        <div className="mt-2">
          {frontmatter.tags.map((tag, idx) => (
            <span
              className={cn("text-gray-500 text-sm", idx && "ml-1")}
              key={slug + tag}
            >
              #{tag}
            </span>
          ))}
        </div>
      </section>
      <section className="prose dark:prose-invert max-w-4xl mx-auto py-10">
        <CustomMDXRemote source={source} />
      </section>
    </>
  );
};

export default PostDetailPage;
