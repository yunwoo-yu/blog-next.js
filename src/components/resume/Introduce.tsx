import React from 'react';

import ResumeContainer from './ResumeContainer';

export default function Introduce() {
	return (
		<ResumeContainer title="자기소개">
			<div className="text-sm leading-7">
				<p>안녕하세요, 협업과 소통을 중시하는 2년차 프론트엔드 개발자 유윤우입니다.</p>
				<p>
					&apos;내 일&apos;과 &apos;팀의 일&apos;의 경계 없이
					<strong> 함께 문제를 해결해 나가는 환경을 좋아합니다.</strong>
				</p>
				<p>작은 스타트업 환경에서 빠른 변화에 유연하게 대응하고, 주도적으로 문제를 해결하는 능력을 키웠습니다.</p>
				<p>사용자 경험과 개발자 경험을 모두 고려한 개발을 하기 위해 노력합니다.</p>
			</div>
		</ResumeContainer>
	);
}
