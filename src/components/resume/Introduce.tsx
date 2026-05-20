import ResumeContainer from './ResumeContainer';

export default function Introduce() {
	return (
		<ResumeContainer>
			<div className="flex flex-col gap-3 text-sm leading-7">
				<p>웹과 웹뷰 기반 서비스에서 사용자 경험과 개발 생산성을 함께 개선해 온 프론트엔드 개발자입니다.</p>
				<p>
					작은 스타트업 환경에서 B2C 플랫폼, B2B SaaS, 고객사 운영용 CMS, 운영 어드민을 개발하며 제품 출시와 운영에
					필요한 프론트엔드 영역을 넓게 맡아 왔습니다. 채팅형 인터페이스의 모바일 사용성, WebGL 기반 서비스의 초기 로딩,
					커머스·마이데이터처럼 상태와 정책이 복잡한 기능을 다루며 사용자가 중간에 막히는 지점을 줄이는 데 집중해
					왔습니다.
				</p>
				<p>
					사용자 경험과 개발자 경험을 함께 개선하는 프론트엔드를 지향합니다. 타입, 공통 컴포넌트, 초기 세팅, 검증 절차를
					정리해 개발자가 기능의 맥락을 빠르게 파악하고 안전하게 수정할 수 있도록 해왔고, 최근에는 AI를 활용해 요구사항
					정리부터 테스트, 구현, 리팩터링까지 이어지는 개발 플로우로 일관성 있는 개발 경험을 실험하고 있습니다.
				</p>
			</div>
		</ResumeContainer>
	);
}
