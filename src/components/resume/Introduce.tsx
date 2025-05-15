import React from 'react';

import ResumeContainer from './ResumeContainer';

export default function Introduce() {
	return (
		<ResumeContainer title="자기소개">
			<div className="leading-7">
				<p>안녕하세요, 협업과 소통을 중시하는 2년차 프론트엔드 개발자 유윤우입니다.</p>
				<p>
					&apos;내 일&apos;과 &apos;팀의 일&apos;의 경계 없이{' '}
					<strong>함께 문제를 해결해 나가는 환경을 좋아합니다.</strong>
				</p>
				<p>UX와 DX를 고려한 코드 작성을 위해 노력합니다.</p>
				<p>트렌디한 기술에 관심이 많지만, 오버엔지니어링을 경계하며 비즈니스 문제를 해결하는 것을 우선시 합니다.</p>
			</div>
		</ResumeContainer>
	);
}
