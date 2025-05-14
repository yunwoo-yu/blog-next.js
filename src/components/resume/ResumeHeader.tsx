'use client';

import { Button } from '../ui/button';
import Address from './Address';
import NameTitle from './NameTitle';

export default function ResumeHeader() {
	return (
		<div>
			<h2 className="sr-only">주니어 프론트엔드 개발자 이력서</h2>
			<NameTitle />
			<Address />
			<Button onClick={() => window.print()}>임시 프린트 버튼</Button>
		</div>
	);
}
