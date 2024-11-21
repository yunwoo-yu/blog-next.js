import { CompileMdxTypes } from '@/types/common.types';

interface PostCardTypeProps {
	data: CompileMdxTypes;
	category: string;
	slug: string;
}

const PostCardType = ({ data }: PostCardTypeProps) => {
	return (
		<li>
			{/* <Link></Link> */}
			{data.title}
		</li>
	);
};

export default PostCardType;
