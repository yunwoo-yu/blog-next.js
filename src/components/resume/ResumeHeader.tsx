import Address from './Address';
import NameTitle from './NameTitle';
import PrintButton from './PrintButton';

export default function ResumeHeader() {
	return (
		<div>
			<h2 className="sr-only">프론트엔드 개발자 이력서</h2>
			<div className="flex items-start justify-between">
				<NameTitle />
				<PrintButton />
			</div>
			<Address />
		</div>
	);
}
