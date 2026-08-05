import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const NotFound = () => {
	return (
		<section className="flex flex-col items-center justify-center px-5 py-20">
			<div className="relative size-28">
				<Image src="/images/logo.png" alt="" className="object-cover" fill sizes="112px" priority />
			</div>
			<h2 className="mt-10 text-4xl font-bold sm:text-5xl">404 ERROR</h2>
			<div className="mt-8 flex flex-col items-center gap-2 text-center text-muted-foreground">
				<p>페이지를 찾을 수 없습니다.</p>
				<p>존재하지 않는 주소를 입력하셨거나,</p>
				<p>요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.</p>
			</div>
			<Button asChild className="mt-8">
				<Link href="/blog/posts">글 목록으로 가기</Link>
			</Button>
		</section>
	);
};

export default NotFound;
