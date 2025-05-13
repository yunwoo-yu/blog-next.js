import React from 'react';

import ResumeContainer from './ResumeContainer';

export default function Introduce() {
	return (
		<ResumeContainer title="자기소개">
			<div className="leading-7">
				<p>안녕하세요, 협업과 소통을 중시하는 2년차 프론트엔드 개발자 유윤우입니다.</p>
				<p>&apos;내 일&apos;과 &apos;팀의 일&apos;의 경계 없이 함께 문제를 해결해 나가는 개발 문화를 추구합니다.</p>
				<p>사용자 관점(UX)과 개발자 관점(DX)을 모두 고려한 코드 작성으로 유저와 동료들의 편의를 고려합니다.</p>
				<p>비즈니스적 성장과 함께 성장하는 것에 큰 성취감을 느낍니다.</p>
			</div>
		</ResumeContainer>
	);
}
