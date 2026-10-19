import ResumeContainer from './ResumeContainer';

export default function Introduce() {
	return (
		<ResumeContainer title="자기소개" titleClassName="mt-6 print:mt-2">
			<div className="flex max-w-[44rem] flex-col gap-3 text-base leading-8 text-gray-800 dark:text-gray-100 print:text-sm print:leading-6 print:!text-gray-800">
				<p>
					스타트업 두 곳(살린 2023.08~2025.08, 웰로 2025.11~2026.06)에서 B2C 서비스, B2B SaaS, CMS, 운영 어드민의
					프론트엔드를 개발했습니다.
				</p>
				<p>
					결제·마이데이터·외부 납부처럼 서버 상태가 기준인 흐름, 어드민 토큰 갱신, WebGL 초기 로딩 개선을 맡았고, CS
					문의·에러 로그·GA4·Lighthouse 같은 수치로 결과를 확인해 왔습니다.
				</p>
			</div>
		</ResumeContainer>
	);
}
