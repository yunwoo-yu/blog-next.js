import ResumeContainer from './ResumeContainer';

export default function Introduce() {
	return (
		<ResumeContainer title="자기소개">
			<div className="flex flex-col gap-3 text-sm leading-7">
				<p>
					저는 완성도 있는 화면이 문제를 정확히 이해하는 데서 시작된다고 생각하는 프론트엔드 엔지니어입니다. 사용자가
					어떤 흐름에서 막혔는지, 그때 어떤 상태가 남아 있었는지부터 확인하고, 재현 조건과 데이터 흐름을 따라 원인을
					좁혀갑니다.
				</p>
				<p>
					기능을 만들 때는 당장의 구현뿐 아니라 이후 운영과 변경 가능성도 함께 봅니다. 사용자가 중간에 이탈하지 않는지,
					운영자가 관리하기 쉬운지, 개발자가 실수하기 쉬운 부분은 없는지 확인하며 오래 유지할 수 있는 형태로 구현하려고
					합니다.
				</p>
			</div>
		</ResumeContainer>
	);
}
