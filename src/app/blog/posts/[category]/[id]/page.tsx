interface Params {
  params: Promise<{ category: string; id: string }>;
}

const PostPage = async ({ params }: Params) => {
  return <div>PostPage</div>;
};

export default PostPage;
