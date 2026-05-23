import ResumeContainer from './ResumeContainer';

export default function Introduce() {
	return (
		<ResumeContainer>
			<div className="flex flex-col gap-3 text-sm leading-7">
				<p>
					작은 스타트업 환경에서 B2C 플랫폼, B2B SaaS, CMS, 운영 어드민까지 프론트엔드 영역을 넓게 담당하며 빠르게
					변하는 상황에 주도적으로 대응하는 역량을 키워왔습니다.
				</p>
				<p>
					'내 일'과 '팀의 일' 사이에 선을 긋기보다 함께 고민하고 해결하는 환경을 좋아합니다. 코드 자체보다 그 코드가
					실제 사용자에게 닿아 지표로 확인되는 순간에 가장 보람을 느낍니다. 기술, 협업, 개발 문화 모두 그 순간을 만들기
					위한 수단이라고 생각합니다.
				</p>
				<p>실사용자와 팀의 생산성을 함께 고려하며, 변화에 빠르게 대응하고 비즈니스 임팩트를 만드는 것을 우선합니다.</p>
			</div>
		</ResumeContainer>
	);
}
