import Address from './Address';
import NameTitle from './NameTitle';

export default function ResumeHeader() {
	return (
		<div>
			<h2 className="sr-only">프론트엔드 개발자 이력서</h2>
			<NameTitle />
			<Address />
		</div>
	);
}
