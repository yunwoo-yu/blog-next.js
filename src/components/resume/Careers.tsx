import RESUME, { CAREER_DETAILS, getCareerPeriod } from '@/constant/resume';

import ResumeContainer from './ResumeContainer';
import { ResumeLink } from './ResumeLink';

const PROJECT_DETAIL_LABELS = ['문제', '기여', '결과'];
const PRODUCT_LINK_LABELS: Record<string, string> = {
	Wello: '웰로 홈페이지',
	'Wello-biz': '웰로비즈 홈페이지',
};
const PROJECT_HIGHLIGHTS: Record<string, string[][]> = {
	'웰마켙 PG 결제·주문 단계별 처리 플로우 구축': [
		[
			'주문서에 표시되는 금액과 실제 PG 결제 요청 금액이 같은 기준으로 계산',
			'결제 전 금액 계산과 예외 상태를 화면에서 먼저 검증',
		],
		[
			'체크아웃 API 반환값을 NicePay SDK에 그대로 전달해 계산 경로 불일치 가능성을 없앴습니다',
			'배송지·결제수단·약관을 순서대로 검증',
			'각 케이스에 맞는 예외처리',
		],
		[
			'커머스 주문 플로우 전체를 설계·구현해 오픈',
			'결제 금액 관련 이슈 0건',
			'같은 주문 상태 기준으로 배송 처리, 반품·환불, 고객 응대',
		],
	],
	'Wello PC 레이아웃 개편': [
		['PC에서도 600px 폭의 모바일 화면을 그대로 제공', '정책과 지역 콘텐츠를 함께 탐색하기 어려웠습니다'],
		['중앙 피드와 우측 사이드 영역', 'PC 6열 그리드', '콘텐츠 타입별 상세 페이지로 연결'],
		['desktop 평균 참여 시간이 약 20% 증가', 'PC 웹에서도 콘텐츠를 이어서 탐색하는 구조'],
	],
	'중복 기부 방지 및 반복 CS 문의 감소': [
		['Wello가 진행 상태를 직접 통제하기 어려워', '중복 기부와 잘못된 완료 처리'],
		['결제 전 주민등록번호 인증, 기부 가능 여부, 기부금, 기부 용도, 배송지 입력 상태', '최신 기부 완료 이력'],
		[
			'Wello에서 결제 진행 상태를 다시 확인',
			'중복 기부 여부를 묻는 반복 CS 문의를 줄였습니다',
			'앱·웹뷰에서도 같은 기준으로 완료 여부',
		],
	],
	'마이데이터 연동 및 연결 관리 구축': [
		['기관별 본인인증, 동의, 전송요구, 전자서명, 재동의, 철회, 전송 이력 확인', '규제성 플로우'],
		['어댑터 패턴을 적용', '요청 생성, 응답 정규화, 에러 매핑', '인증 중간값은 세션스토리지에 분리해 저장'],
		['어댑터 단위 수정으로 대응', '기존 화면과 공통 플로우 변경 범위를 줄일 수 있게'],
	],
	'Wello-biz 상세검색 키워드 입력 UX 개선': [
		['11개 지점에서 반복', '한글 IME 조합 중 Enter'],
		['자동 리사이징 textarea 입력 컴포넌트', 'IME composition 상태', 'zod schema와 연결'],
		[
			'한글 검색어 입력 중 자음·모음이 분리되던 문제를 해결',
			'11개 입력 지점에서 같은 추가·삭제·초기화 동작과 검증 기준',
		],
	],
	'어드민 인증·개인정보 보호 개선': [
		['401 오류가 반복되고 운영 작업이 끊기는 문제', 'ISMS-P 결함 조치'],
		['공통 401 처리 기준', '첫 요청만 refresh token API를 호출', '최신 쿠키 토큰으로 재시도'],
		['동일한 세션을 유지', '반복 401과 중복 refresh로 인한 작업 중단을 줄였습니다', '필요한 경우에만 개인정보에 접근'],
	],
	'AI 챗봇 플랫폼 & CMS': [
		['AI 챗봇 서비스', 'CMS도 함께 필요'],
		[
			'Threads·Messages·Runs 흐름을 서버 SSE 응답으로 전달',
			'역방향 무한 스크롤',
			'파일 등록, 벡터 스토어 관리, AI 콘텐츠 자동 생성, 통계 대시보드, 프롬프트·모델 설정 화면',
		],
		[
			'Next.js 15 App Router SSR 구조로 전환',
			'검색 노출 관리를 자동화',
			'챗봇 응대와 CMS 운영을 직접 관리',
			'응답 횟수 기반 광고 삽입',
		],
	],
	'AI 대화형 설문 생성 MVP': [
		['신규 서비스 가능성을 빠르게 검증', '스트리밍 UX를 확인할 수 있는 MVP'],
		['OpenAI 응답 스트림을 SSE로 전달', '텍스트 델타를 받아 설문 문항 UI에 실시간 반영'],
		[
			'배포 가능한 환경까지 완성',
			'SSE 처리, 스트리밍 UI, AI 응답 상태 관리, 자동 스크롤 패턴',
			'실시간 채팅 UI 구현 기반',
		],
	],
	'서비스 웹 + 관리자 CMS 프론트엔드 단독 개발': [
		['백엔드 개발자 1명과 2인 팀', '서비스 웹·관리자 CMS와 WebGL 가상공간 진입·연결 프론트엔드'],
		[
			'서비스 웹은 Webpack v5, 관리자 CMS는 Vite로 분리',
			'인증, 대시보드, 사업지원 관리, WebGL 가상공간 진입 화면과 연결 로직',
			'Lazy Loading, 코드 스플리팅, bundle-analyzer 기반 의존성 정리',
		],
		['프론트엔드 영역을 단독으로 설계·개발', '출시 가능한 상태', '보일러플레이트와 CMS UI Kit 구축'],
	],
	'CMS 전용 UI Kit & 보일러플레이트': [
		['환경 구성과 공통 컴포넌트 조정에 시간이 많이 쓰이고 있었습니다'],
		[
			'Webpack v5 보일러플레이트와 CMS용 Vite 보일러플레이트',
			'Rollup.js 기반 CMS UI 라이브러리를 CJS/ESM 빌드 산출물로 배포',
			'Storybook과 Chromatic',
		],
		['반복 세팅을 줄이고 공통 UI를 같은 기준으로 재사용'],
	],
	'아바타 스튜디오 성능 개선 및 CMS 개발': [
		['3초 이상 빈 화면', '800~1000줄 규모의 거대 컴포넌트'],
		['Suspense와 lazy loading', 'AWS S3와 CDN', '공통 컴포넌트와 커스텀 훅'],
		['400~600ms 수준으로 단축', '300명 규모 대학 OT와 오디션 시스템을 안정적으로 출시'],
	],
};

const renderHighlightedText = (text: string, highlights: string[]) => {
	if (highlights.length === 0) return text;

	const escapedHighlights = highlights.map(highlight => highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
	const pattern = new RegExp(`(${escapedHighlights.join('|')})`, 'g');

	return text.split(pattern).map((part, index) =>
		highlights.includes(part) ? (
			<strong key={`${part}-${index}`} className="font-bold text-gray-950 print:!text-gray-950 dark:text-gray-50">
				{part}
			</strong>
		) : (
			part
		),
	);
};

const getProductLinkLabel = (title: string) => PRODUCT_LINK_LABELS[title] ?? `${title} 홈페이지`;

export default function Careers() {
	return (
		<ResumeContainer title="경력">
			<div className="flex flex-col gap-10 print:gap-8">
				{RESUME.careers.map(career => {
					const careerDetail = CAREER_DETAILS.find(detail => detail.organization === career.organization);
					const productLinks = career.serviceGroups
						.filter(group => group.serviceUrl)
						.map(group => ({ title: group.service, url: group.serviceUrl! }));
					const projects =
						careerDetail?.serviceGroups.flatMap(group =>
							group.projects.map(project => ({
								...project,
								printBreakBefore: group.printBreakBefore,
							})),
						) ?? [];
					const { text, duration, isOngoing } = getCareerPeriod(career);

					return (
						<article
							key={career.organization}
							className="border-l border-violet-200 pl-5 print:break-inside-auto print:border-violet-200 dark:border-violet-300/40">
							<header className="border-b border-gray-300 pb-6 dark:border-slate-700 print:pb-4">
								<div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
									<div>
										<div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
											<h4 className="text-xl font-bold text-gray-950 dark:text-gray-50 print:text-lg print:!text-gray-950">
												{career.organization}
											</h4>
											<span className="text-xs font-medium text-gray-500 dark:text-gray-400 print:!text-gray-500">
												{career.position}
											</span>
										</div>
										{productLinks.length > 0 && (
											<div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400 print:!text-gray-500">
												<span className="font-medium text-gray-500 print:!text-gray-500 dark:text-gray-400">
													제품 링크
												</span>
												{productLinks.map(link => (
													<ResumeLink key={link.title} title={getProductLinkLabel(link.title)} url={link.url} />
												))}
											</div>
										)}
									</div>
									<p className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 print:!text-gray-500 sm:text-right">
										{text} {duration && <span className={isOngoing ? 'print:hidden' : ''}>({duration})</span>}
										{career.exitReason && <span className="text-xs font-normal"> · {career.exitReason}</span>}
									</p>
								</div>

								<p className="mt-5 text-sm leading-7 text-gray-700 dark:text-gray-200 print:mt-3 print:!text-gray-800">
									{career.description}
								</p>

								<div className="mt-4 flex flex-wrap gap-1.5 print:mt-2 print:gap-1">
									{career.techStack.map((tech, index) => (
										<span
											key={index}
											className="rounded-md bg-slate-200 px-2 py-1 text-xs text-slate-800 print:!bg-slate-200 print:!text-slate-800 dark:bg-slate-700/80 dark:text-slate-100">
											{tech}
										</span>
									))}
								</div>
							</header>

							{projects.length > 0 && (
								<section className="mt-8 divide-y divide-gray-300 dark:divide-slate-700 print:mt-5 print:divide-gray-200">
									{projects.map(project => (
										<article
											key={project.title}
											className={`py-7 first:pt-0 last:pb-0 print:py-4 print:break-inside-auto ${
												project.printBreakBefore ? 'print:break-before-page' : ''
											}`}>
											<header className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 gap-y-2 print:mb-2 print:break-after-avoid">
												<h5 className="text-base font-bold leading-7 text-gray-950 dark:text-gray-100 print:text-[15px] print:!text-gray-950">
													{project.title}
												</h5>
												<div className="flex flex-wrap items-center justify-end gap-2 text-xs text-gray-500 dark:text-gray-400 print:!text-gray-500">
													{project.date && <span>{project.date}</span>}
												</div>
											</header>

											<dl className="space-y-3 print:space-y-2">
												{project.details.map((detail, index) => (
													<div
														key={index}
														className="grid grid-cols-[48px_1fr] gap-4 print:grid-cols-[38px_1fr] print:gap-3">
														<dt className="text-xs font-semibold leading-7 text-destructive">
															{PROJECT_DETAIL_LABELS[index] ?? '상세'}
														</dt>
														<dd className="text-sm leading-7 text-gray-700 dark:text-gray-200 print:!text-gray-800">
															{renderHighlightedText(detail.title, PROJECT_HIGHLIGHTS[project.title]?.[index] ?? [])}
															{detail.links?.map((link, linkIndex) => (
																<ResumeLink key={linkIndex} title={link.title} url={link.url} />
															))}
														</dd>
													</div>
												))}
											</dl>
										</article>
									))}
								</section>
							)}
						</article>
					);
				})}
			</div>
		</ResumeContainer>
	);
}
