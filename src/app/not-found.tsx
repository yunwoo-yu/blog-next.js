import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';

const NotFound = () => {
	return (
		<section className="flex flex-col items-center justify-center py-20">
			<div className="relative h-28 w-28">
				<Image src="/images/logo.png" alt="logo" className="object-cover" fill sizes="224px" priority />
			</div>
			<h2 className="prose mt-10 text-5xl font-bold dark:prose-invert">404 ERROR</h2>
			<div className="mt-10 flex flex-col gap-3 text-center dark:prose-invert">
				<p>페이지를 찾을 수 없습니다.</p>
				<p>존재하지 않는 주소를 입력하셨거나,</p>
				<p>요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.</p>
				<Button className="mt-5">
					<Link href="/blog/posts">홈으로 가기</Link>
				</Button>
			</div>
		</section>
	);
};

export default NotFound;
