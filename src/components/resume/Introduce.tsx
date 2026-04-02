import ResumeContainer from './ResumeContainer';

export default function Introduce() {
	return (
		<ResumeContainer title="자기소개">
			<div className="flex flex-col gap-3 text-sm leading-7">
				<p>
					작은 스타트업 환경에서 다양한 역할을 경험하며, 빠르게 변하는 상황에 유연하게 대응하고 주도적으로 문제를
					해결하는 역량을 키워 왔습니다. &apos;내 일&apos;과 &apos;팀의 일&apos; 사이에 선을 긋기보다는 함께 고민하고
					해결하는 환경을 좋아합니다.
				</p>
				<p>
					레거시를 만나면 먼저 코드를 읽고 왜 이렇게 됐는지 맥락을 파악한 뒤, 팀이 오래 유지할 수 있는 구조를
					설계합니다. 외부 라이브러리의 소스를 직접 분석하여 문서에 없는 동작까지 파악하고, UI Kit·보일러플레이트·
					OpenAPI 자동 생성 도입 등 반복 작업을 구조로 해결하여, 팀이 다음 작업을 더 빠르게 시작할 수 있도록 만드는 것을
					우선합니다.
				</p>
			</div>
		</ResumeContainer>
	);
}
