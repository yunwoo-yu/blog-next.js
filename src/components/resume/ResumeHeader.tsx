import Address from './Address';
import NameTitle from './NameTitle';
import PrintButton from './PrintButton';

export default function ResumeHeader() {
	return (
		<div className="mb-10 print:mb-6">
			<h2 className="sr-only">프론트엔드 개발자 이력서</h2>
			<div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
				<NameTitle />
				<div className="flex flex-col items-end gap-6">
					<PrintButton />
					<Address />
				</div>
			</div>
		</div>
	);
}
