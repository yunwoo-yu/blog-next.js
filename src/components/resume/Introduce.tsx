import ResumeContainer from './ResumeContainer';

export default function Introduce() {
	return (
		<ResumeContainer title="자기소개">
			<div className="flex flex-col gap-3 text-sm leading-7">
				<p>
					&apos;내 일&apos;과 &apos;팀의 일&apos; 사이에 선을 긋기보다는, 함께 고민하고 해결하는 환경을 좋아합니다.
					사용자가 겪는 불편에 민감하고, 기술적 해결이 실제 사용 경험으로 이어지는 순간에 동기부여를 받습니다.
				</p>
				<p>
					문제를 만나면 눈에 보이는 현상에서 멈추지 않고 동작 원리까지 파고드는 편입니다. 레거시를 만나면 먼저 코드를
					읽고 왜 이렇게 됐는지 맥락을 파악한 뒤, 팀이 오래 유지할 수 있는 구조를 고민합니다. 반복되는 작업을 구조로
					바꾸고, 팀이 다음 작업을 더 빠르게 시작할 수 있는 환경을 만드는 데 보람을 느낍니다.
				</p>
			</div>
		</ResumeContainer>
	);
}
