import ResumeContainer from './ResumeContainer';

export default function Introduce() {
	return (
		<ResumeContainer title="자기소개">
			<div className="flex flex-col gap-3 text-sm leading-7">
				<p>
					프론트엔드 엔지니어로서 누적 이용자 500만 정책 플랫폼, AI 챗봇, B2B SaaS 등 다양한 도메인의 서비스를
					설계·구축해왔습니다.
				</p>
				<p>
					마이데이터 연동·커머스 결제 등 신규 서비스 개발과 프레임워크 마이그레이션·디자인 시스템 개선 등 기술 부채
					해소를 병행하며 사용자 경험과 개발 생산성 두 축에서 성과를 만들어왔습니다.
				</p>
				<p>
					기술과 협업 모두 문제 해결을 위한 수단이라 생각하며, 사용자가 겪는 문제와 팀이 겪는 비효율을 함께 해결하는
					것을 우선합니다.
				</p>
			</div>
		</ResumeContainer>
	);
}
