import ResumeContainer from './ResumeContainer';

export default function Introduce() {
	return (
		<ResumeContainer title="자기소개" titleClassName="mt-6 print:mt-2">
			<div className="flex flex-col gap-3 text-sm leading-7 text-gray-700 dark:text-gray-200 print:!text-gray-800">
				<p>
					작은 스타트업 환경에서 B2C 플랫폼, B2B SaaS, CMS, 운영 어드민까지 프론트엔드 영역을 넓게 담당하며 빠르게
					변하는 상황에 주도적으로 대응하는 역량을 키워왔습니다.
				</p>
				<p>
					'내 일'과 '팀의 일' 사이에 선을 긋기보다 함께 고민하고 해결하는 환경을 좋아합니다. 맡은 기능이 실제 서비스에
					반영되고 사용자 반응과 지표로 성과를 확인할 때 가장 큰 성취감을 느낍니다.
				</p>
			</div>
		</ResumeContainer>
	);
}
