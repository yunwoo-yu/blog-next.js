import ResumeContainer from './ResumeContainer';

export default function Introduce() {
	return (
		<ResumeContainer title="자기소개">
			<div className="flex flex-col gap-3 text-sm leading-7">
				<p>
					프론트엔드 엔지니어로서 누적 이용자 500만 정책 플랫폼, AI 챗봇, B2B SaaS 등 다양한 도메인에서 신규
					서비스 출시와 기존 서비스 개선을 함께 맡아왔습니다.
				</p>
				<p>
					마이데이터 연동·커머스 결제처럼 제품 확장에 필요한 기능을 만들고, 프레임워크 마이그레이션·디자인 시스템
					개선·번들 최적화로 운영 효율과 개발 생산성도 함께 개선해왔습니다.
				</p>
				<p>
					사용자 경험, 운영 가능성, 팀 생산성을 함께 보는 프론트엔드 엔지니어로서 문제의 원인을 구조적으로 정리하고
					지속 가능한 해결책을 만드는 데 집중합니다.
				</p>
			</div>
		</ResumeContainer>
	);
}
