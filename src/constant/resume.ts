import type { ResumeItemProps } from '@/components/resume/ResumeItem';
import type { ResumeLinkProps } from '@/components/resume/ResumeLink';

export type Project = {
	title: string;
	date?: string;
	details: (ResumeItemProps & { highlights: string[] })[];
};

export type ServiceGroup = {
	service: string;
	serviceUrl?: string;
	serviceDescription?: string;
	projects: Project[];
	printBreakBefore?: boolean;
};

export type Careers = {
	organization: string;
	position: string;
	startDate?: string;
	endDate?: string;
	exitReason?: string;
	period?: string;
	description: string;
	techStack: string[];
	serviceGroups: ServiceGroup[];
};

type CareerPeriodTarget = Pick<Careers, 'startDate' | 'endDate' | 'period'>;

const toCareerDate = (date: string) => {
	const [year, month, day = '01'] = date.split('.');
	return new Date(Number(year), Number(month) - 1, Number(day));
};

export function getCareerPeriod(career: CareerPeriodTarget) {
	if (career.period) return { text: career.period, duration: '', isOngoing: false };
	if (!career.startDate) return { text: '', duration: '', isOngoing: false };

	const start = toCareerDate(career.startDate);
	const end = career.endDate ? toCareerDate(career.endDate) : new Date();
	const isOngoing = !career.endDate;

	const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
	const years = Math.floor(months / 12);
	const remainingMonths = months % 12;

	let duration = '';
	if (years > 0 && remainingMonths > 0) duration = `${years}년 ${remainingMonths}개월`;
	else if (years > 0) duration = `${years}년`;
	else duration = `${months}개월`;

	const startStr = career.startDate;
	const endStr = isOngoing ? '재직 중' : career.endDate!;

	return { text: `${startStr} ~ ${endStr}`, duration, isOngoing };
}

export type Education = {
	title: string;
	period: string;
};

export type ActivityItem = {
	text: string;
	links?: ResumeLinkProps[];
};

export type Activity = {
	title: string;
	organization: string;
	period: string;
	items: (string | ActivityItem)[];
};

export type Resume = {
	careers: Careers[];
	education: Education[];
	activities: Activity[];
};

const CAREERS: Careers[] = [
	{
		organization: '웰로',
		position: '프론트엔드 개발자 | 제품실 개발팀',
		startDate: '2025.11',
		endDate: '2026.06',
		exitReason: '경영 악화로 인한 권고사직',
		description:
			'누적 이용자 500만 규모의 Wello와 B2B SaaS Wello-biz의 사용자 서비스, 커머스, 마이데이터, 통합 어드민 프론트엔드 개발을 pnpm·Turborepo 기반 모노레포 환경에서 담당했습니다.',
		techStack: [
			'React 19',
			'Next.js 16',
			'TypeScript',
			'TanStack Query v5',
			'Zustand',
			'Tailwind CSS',
			'Zod',
			'OpenAPI',
			'Storybook',
		],
		serviceGroups: [
			{
				service: 'Wello',
				serviceUrl: 'https://www.welfarehello.com/',
				serviceDescription: 'AI 기반 개인 맞춤형 정책 추천 플랫폼',
				projects: [
					{
						title: '웰마켙 주문·결제 전 과정 구축',
						date: '2026.02 ~ 2026.05',
						details: [
							{
								title:
									'지역 상품 커머스 웰마켙은 상품·배송비·쿠폰·웰포인트를 조합해 최종 결제 금액을 계산했습니다. 화면과 서버의 계산 결과가 다르면 PG 승인 금액 불일치로 이어지고, 재고 소진·주문 만료·인증 실패가 발생해도 사용자가 다음 행동을 알 수 있어야 했습니다.',
								highlights: ['PG 승인 금액 불일치', '재고 소진·주문 만료·인증 실패'],
							},
							{
								title:
									'쿠폰·포인트 사용 내역을 체크아웃 API에 전달하고, API가 확정한 금액만 NICEPAY에 전달해 결제 금액의 기준을 서버로 단일화했습니다. 인증 결과는 사용자 취소·통신 실패 등 원인별로 안내하고, 재고 오류는 장바구니에서 다시 선택하도록 연결했습니다.',
								highlights: ['API가 확정한 금액만 NICEPAY에 전달', '결제 금액의 기준을 서버로 단일화'],
							},
							{
								title:
									'주문서부터 결제 승인, 배송, 취소·반품·환불, 운영 어드민까지 주문 상태를 하나의 흐름으로 연결해 출시했습니다. 오픈 후 한 달간 결제 금액 관련 이슈 0건을 유지했고, 사용자 화면과 운영 어드민이 동일한 주문 상태를 기준으로 동작하게 했습니다.',
								highlights: ['결제 금액 관련 이슈 0건', '동일한 주문 상태를 기준으로 동작'],
							},
						],
					},
					{
						title: 'Wello PC 반응형 전환 및 통합검색 구축',
						date: '2026.04',
						details: [
							{
								title:
									'Wello는 PC에서도 600px 고정폭 모바일 화면을 노출했고, 정책·답례품·동네소식·기부사업은 각 메뉴에 흩어져 있었습니다. PC 사용자는 넓은 화면을 활용하지 못한 채 원하는 콘텐츠를 찾기 위해 서비스별로 다시 탐색해야 했습니다.',
								highlights: ['PC에서도 600px 고정폭 모바일 화면', '서비스별로 다시 탐색'],
							},
							{
								title:
									'주요 화면을 PC 레이아웃으로 확장하고, 흩어진 콘텐츠를 카테고리별로 탐색하는 통합검색을 구축했습니다. 검색어·카테고리·필터를 URL과 동기화해 공유·새로고침·뒤로가기 후에도 복원되게 했습니다. 필터는 PC 사이드바와 모바일 드로어가 같은 상태 로직을 사용하도록 구성했습니다.',
								highlights: ['검색어·카테고리·필터를 URL과 동기화', 'PC 사이드바와 모바일 드로어가 같은 상태 로직'],
							},
							{
								title:
									'모바일 중심 화면을 PC까지 확장하고, 검색 조건을 공유·재진입할 수 있는 통합검색으로 콘텐츠 접근 경로를 단순화했습니다. 개편 전후 2주간 GA4 데이터 비교 기준으로 데스크톱 평균 참여 시간이 약 20% 증가했습니다.',
								highlights: ['검색 조건을 공유·재진입할 수 있는 통합검색', '데스크톱 평균 참여 시간이 약 20% 증가'],
							},
						],
					},
					{
						title: '외부 납부 환경의 중복 기부 방지',
						date: '2025.12 ~ 2026.01',
						details: [
							{
								title:
									'고향사랑기부는 신청 후 외부 지로 화면에서 납부를 완료하는 구조였습니다. 앱·웹뷰를 벗어난 뒤에는 Wello가 진행 상태를 즉시 알기 어렵고, 납부 완료 반영이 늦으면 사용자가 같은 기부를 다시 시도할 수 있었습니다.',
								highlights: ['진행 상태를 즉시 알기 어렵고', '같은 기부를 다시 시도'],
							},
							{
								title:
									'페이지 진입 시 이전 기부 내역을 정산하고, 결제 버튼을 누르면 정산 완료 후 최신 기부 완료 이력을 다시 조회했습니다. 완료 이력이 있으면 지자체와 금액을 확인시켜 재결제를 막았습니다. 외부 화면 이동 정보는 저장소에 백업하고, 복귀 시 납부 식별값을 서버에 조회해 실제 완료 여부를 판별했습니다.',
								highlights: ['정산 완료 후 최신 기부 완료 이력을 다시 조회', '복귀 시 납부 식별값을 서버에 조회'],
							},
							{
								title:
									'외부 납부 화면을 거쳐도 최신 완료 이력을 기준으로 중복 여부를 확인하게 했고, 배포 이후 중복 기부 여부를 묻는 반복 문의가 거의 들어오지 않게 됐습니다. Wello 앱·KB·토스 웹뷰와 일반 웹에서도 같은 서버 상태를 기준으로 복귀 흐름이 이어지게 했습니다.',
								highlights: ['반복 문의가 거의 들어오지 않게 됐습니다', '같은 서버 상태를 기준으로 복귀'],
							},
						],
					},
					{
						title: '의료·통신·신용 마이데이터 연동 및 연결 관리 구축',
						date: '2025.12 ~ 2026.03',
						details: [
							{
								title:
									'정책 추천에 의료·통신·신용 데이터를 활용하려면 KHIS·KOSCOM·NICE의 서로 다른 절차를 하나의 사용자 여정으로 연결해야 했습니다. 본인인증부터 약관 동의, 전송요구, 전자서명, 재동의, 철회, 전송 이력까지 긴 규제성 흐름이 새로고침과 외부 인증 이후에도 이어져야 했습니다.',
								highlights: ['서로 다른 절차를 하나의 사용자 여정으로 연결', '긴 규제성 흐름'],
							},
							{
								title:
									'NexBe 본인인증 SDK의 스크립트 로딩과 콜백 순서를 커스텀 훅으로 감싸고, KHIS·KOSCOM별 인증·동의·전송요구·전자서명 화면을 구현했습니다. 연동 중간값은 세션 스토리지에 단계별로 저장·정리하고, 연결 관리에서는 분야별 상세·재동의·개별·일괄 철회·전송 이력을 구현했습니다.',
								highlights: [
									'스크립트 로딩과 콜백 순서를 커스텀 훅으로 감싸고',
									'연동 중간값은 세션 스토리지에 단계별로 저장·정리',
								],
							},
							{
								title:
									'의료·통신·신용 연동부터 연결 상태 확인, 재동의, 철회, 전송 이력까지 전체 흐름을 구축해 기관 심사를 진행했습니다. 분야별 연동 여부를 기준으로 직접 접근을 차단하고, 일괄 철회는 기관 요청을 병렬 처리한 뒤 실패한 항목만 안내해 일부 실패에도 나머지 처리가 유지되게 했습니다.',
								highlights: ['연결 상태 확인, 재동의, 철회, 전송 이력까지 전체 흐름', '실패한 항목만 안내'],
							},
						],
					},
				],
			},
			{
				service: 'Wello-biz',
				serviceUrl: 'https://www.wellobiz.com/',
				serviceDescription: 'B2B SaaS 비즈니스 플랫폼',
				projects: [
					{
						title: '11개 검색 폼의 키워드 입력 통합 및 한글 IME 오류 해결',
						date: '2025.11 ~ 2025.12',
						details: [
							{
								title:
									'지원사업·조달사업 검색은 OR·AND·NOT 조건의 키워드를 여러 개 입력하는 구조였습니다. 같은 입력 UI가 11곳에 중복돼 동작이 달랐고, 한글 조합 중 Enter를 누르면 완성 전 문자열이 검색 조건으로 추가됐습니다.',
								highlights: ['11곳에 중복돼 동작이 달랐고', '완성 전 문자열이 검색 조건으로 추가'],
							},
							{
								title:
									'키워드 칩 추가·삭제와 자동 리사이징을 지원하는 textarea 컴포넌트로 입력을 통합했습니다. IME 조합 상태를 확인해 한글 조합과 Enter 입력 확정을 분리하고, 추가·삭제·초기화 규칙을 컴포넌트 내부로 모았습니다.',
								highlights: ['입력을 통합', '한글 조합과 Enter 입력 확정을 분리'],
							},
							{
								title:
									'한글 IME 조합 오류를 제거하고, 11개 입력 지점의 OR·AND·NOT 키워드를 같은 추가·삭제·초기화·검증 기준으로 통일했습니다. 이후 검색 화면은 입력 로직을 다시 구현하지 않고 동일 컴포넌트를 재사용할 수 있게 됐습니다.',
								highlights: ['한글 IME 조합 오류를 제거', '같은 추가·삭제·초기화·검증 기준으로 통일'],
							},
						],
					},
				],
			},
			{
				service: 'Wello·Wello-biz Admin',
				serviceDescription: '통합 운영 어드민',
				projects: [
					{
						title: 'Next.js·Vue 통합 어드민 세션 안정화',
						date: '2026.01',
						details: [
							{
								title:
									'Next.js 신규 어드민에서 Vue 레거시 어드민을 iframe으로 함께 운영했습니다. 쿠키 세션은 공유했지만 API 클라이언트와 토큰 갱신 방식이 달라, 동시 401 발생 시 refresh 요청이 중복되고 운영 화면이 로그아웃됐습니다.',
								highlights: ['동시 401 발생 시', 'refresh 요청이 중복'],
							},
							{
								title:
									'Next.js와 Vue의 응답 인터셉터에 같은 401 복구 절차를 적용했습니다. refresh Promise를 공유해 첫 요청만 토큰을 갱신하고 나머지는 같은 결과를 기다리게 했습니다. 실패 요청과 쿠키 토큰이 다르면 다른 앱이 이미 갱신한 것으로 보고 최신 토큰으로 재시도했습니다.',
								highlights: ['첫 요청만 토큰을 갱신하고 나머지는 같은 결과를 기다리게', '최신 토큰으로 재시도'],
							},
							{
								title:
									'Next.js와 Vue가 하나의 갱신 결과와 쿠키를 사용해 반복 401과 중복 refresh를 줄였습니다. 토큰 갱신 실패 때만 공통 만료 처리로 이동해 동시 요청으로 운영 작업이 끊기지 않게 했습니다.',
								highlights: ['반복 401과 중복 refresh를 줄였습니다', '운영 작업이 끊기지 않게'],
							},
						],
					},
				],
			},
		],
	},
	{
		organization: '살린',
		position: '프론트엔드 개발자 | ILab',
		startDate: '2023.08',
		endDate: '2025.08',
		exitReason: '경영 악화로 인한 권고사직',
		description:
			'AI 챗봇 플랫폼, WebGL 아바타 서비스, 스타트업 업무 지원 서비스의 사용자 화면과 관리자 CMS 프론트엔드 개발을 담당했습니다.',
		techStack: [
			'React',
			'TypeScript',
			'Next.js 15',
			'NestJS',
			'TanStack Query',
			'Emotion',
			'Zustand',
			'Webpack',
			'Vite',
		],
		serviceGroups: [
			{
				service: 'AI Talker',
				serviceDescription: 'AI 챗봇 플랫폼',
				projects: [
					{
						title: 'AI 챗봇 사용자 서비스·운영 CMS 구축',
						date: '2025.01 ~ 2025.08',
						details: [
							{
								title:
									'고객사 콘텐츠를 근거로 답변하는 AI 챗봇과, 운영자가 프롬프트·모델·지식 베이스·사용량을 직접 관리하는 CMS가 함께 필요했습니다. 답변 생성 시간을 빈 화면으로 기다리지 않게 하고, 긴 대화 이력을 불러와도 읽던 위치를 유지해야 했습니다.',
								highlights: ['운영자가 프롬프트·모델·지식 베이스·사용량을 직접 관리', '읽던 위치를 유지'],
							},
							{
								title:
									'AI 설문 MVP에서 검증한 스트림 처리·응답 상태 관리 패턴을 적용해 OpenAI Assistants의 답변을 대화 화면에 순차 반영했습니다. 이전 대화를 불러올 때는 추가된 높이만큼 스크롤 위치를 보정해 사용자가 읽던 지점을 유지했습니다. CMS에는 파일·벡터 스토어, 프롬프트·모델 설정, 콘텐츠 생성, 방문·대화·비용 통계를 구현했습니다.',
								highlights: ['OpenAI Assistants의 답변을 대화 화면에 순차 반영', '사용자가 읽던 지점을 유지'],
								links: [
									{
										title: '관련글',
										url: 'https://www.ycow-dev.com/blog/posts/next/reverse_infinite_scroll',
									},
								],
							},
							{
								title:
									'챗봇 응답과 운영 설정을 하나의 제품으로 배포해 고객사가 지식 파일과 응답 설정을 직접 관리하게 했습니다. 사용자 서비스와 CMS를 실제 운영했고, 무료 플랜에는 응답 횟수를 기준으로 광고를 노출하는 정책을 연결했습니다.',
								highlights: ['고객사가 지식 파일과 응답 설정을 직접 관리', '사용자 서비스와 CMS를 실제 운영'],
							},
						],
					},
					{
						title: 'React CSR 서비스의 Next.js 15 SSR 전환',
						date: '2025.01 ~ 2025.08',
						details: [
							{
								title:
									'고객사마다 브랜드와 언어가 다른 챗봇을 제공했지만, 기존 React CSR 구조에서는 검색 엔진과 링크 미리보기에 고객사별 정보를 안정적으로 전달하기 어려웠습니다. 신규 고객사가 추가될 때마다 메타데이터와 검색 노출 경로를 코드에 직접 반영하는 방식도 확장에 불리했습니다.',
								highlights: ['고객사별 정보를 안정적으로 전달하기 어려웠습니다', '코드에 직접 반영하는 방식'],
							},
							{
								title:
									'사용자 서비스를 Next.js 15 App Router로 전환하고, 고객사 코드로 조회한 설정을 서버에서 메타데이터·Open Graph에 반영했습니다. 사이트맵도 고객사 코드 목록 API를 기준으로 생성해 새 고객사의 검색 경로가 자동으로 포함되게 했습니다.',
								highlights: [
									'고객사 코드로 조회한 설정을 서버에서 메타데이터·Open Graph에 반영',
									'고객사 코드 목록 API를 기준으로 생성',
								],
							},
							{
								title:
									'고객사별 제목·설명·다국어 Open Graph와 사이트맵을 운영 데이터로 관리하게 해, 프론트엔드 배포 없이 검색 노출 정보를 변경하거나 신규 고객사를 추가할 수 있는 구조로 전환했습니다.',
								highlights: ['프론트엔드 배포 없이 검색 노출 정보를 변경', '신규 고객사를 추가할 수 있는 구조'],
							},
						],
					},
				],
			},
			{
				service: 'Swing',
				serviceDescription: 'WebGL 가상 오피스 기반 스타트업 업무 지원 플랫폼',
				projects: [
					{
						title: '서비스 웹 + 관리자 CMS 프론트엔드 단독 개발',
						date: '2024.01 ~ 2024.07',
						details: [
							{
								title:
									'Swing은 업무 지원 기능과 Unity WebGL 가상 오피스를 함께 제공하는 신규 서비스였습니다. 백엔드 개발자 1명과 2인 팀에서 사용자 웹, 관리자 CMS, WebGL 진입·인증 연결까지 프론트엔드 전 영역을 구축해야 했습니다.',
								highlights: ['백엔드 개발자 1명과 2인 팀', '프론트엔드 전 영역을 구축'],
							},
							{
								title:
									'서비스 개발에 앞서 사용자 웹용 Webpack 5·CMS용 Vite 보일러플레이트와 CMS UI 패키지를 구축하고, 이를 적용해 인증·대시보드·사업지원 관리 화면을 구현했습니다. Unity 자산을 환경별 S3 경로에서 받아 빌드에 포함하고, 웹 토큰을 가상 오피스 진입 과정에 연결했습니다.',
								highlights: ['보일러플레이트와 CMS UI 패키지를 구축', '웹 토큰을 가상 오피스 진입 과정에 연결'],
							},
							{
								title:
									'인증부터 업무 지원 관리와 가상 오피스 진입까지 하나의 서비스 흐름으로 완성했습니다. 공통 개발 기반을 Swing 사용자 웹과 CMS에 적용해 화면별 설정과 반복 UI를 같은 방식으로 유지했습니다.',
								highlights: ['하나의 서비스 흐름으로 완성', '화면별 설정과 반복 UI를 같은 방식으로 유지'],
							},
						],
					},
				],
			},
			{
				service: 'Localo',
				serviceDescription: 'WebGL 아바타 서비스',
				projects: [
					{
						title: '아바타 스튜디오 성능 개선',
						date: '2023.10 ~ 2023.12',
						details: [
							{
								title:
									'외주 업체에서 인수한 WebGL 아바타 서비스는 3D 렌더링과 대용량 정적 자산이 초기 진입을 막아 3초 이상 빈 화면이 노출됐습니다. 3D·편집 로직이 큰 컴포넌트에 섞여 있어 작은 기능 변경도 기존 동작에 영향을 주기 쉬웠습니다.',
								highlights: ['3초 이상 빈 화면', '작은 기능 변경도 기존 동작에 영향을 주기 쉬웠습니다'],
							},
							{
								title:
									'앱 진입점을 lazy loading과 Suspense 경계로 분리하고, 아바타 파츠·JSON 자산은 S3·CDN 경로에서 불러오도록 이전했습니다. 3D 뷰와 편집 상태는 역할별 컴포넌트·훅으로 나눠 신규 기능이 기존 렌더링 로직에 직접 의존하지 않게 했습니다.',
								highlights: ['lazy loading과 Suspense 경계로 분리', 'S3·CDN 경로에서 불러오도록 이전'],
							},
							{
								title:
									'3초 이상 걸리던 첫 화면 표시를 Lighthouse FCP 기준 400~600ms로 단축했습니다. 3D 렌더링과 화면 기능의 변경 경계를 나눠, 기존 동작을 전부 수정하지 않고도 아바타 편집 기능을 확장할 수 있게 했습니다.',
								highlights: ['Lighthouse FCP 기준 400~600ms로 단축', '기존 동작을 전부 수정하지 않고도'],
							},
						],
					},
				],
			},
		],
	},
];

const EDUCATION: Education[] = [];

const ACTIVITIES: Activity[] = [
	{
		title: '항해플러스 프론트엔드 6기',
		organization: '',
		period: '2025.07 ~ 2025.09',
		items: [
			'바닐라 JS로 Virtual DOM(JSX 파싱·diff)과 React 훅·메모이제이션을 직접 구현하고, Express 기반 SSR/SSG를 구현하며 프레임워크 내부 동작을 학습했습니다.',
			'TDD 기반 단위·통합 테스트(Vitest + RTL + MSW)와 성능 프로파일링을 반복해 훈련했고, 최종 주차 성능 최적화 과제에서 BP(Best Practice)로 선정됐습니다.',
		],
	},
	{
		title: '오픈소스 컨트리뷰션 아카데미',
		organization: '과학기술정보통신부',
		period: '2023.07 ~ 2024.01',
		items: [
			{
				text: '드롭다운 컴포넌트 함수형 전환, 워크플로우 목록 툴바 UI 개선, Cron Workflow 실행 이력 노출 등 3개 PR을 머지했습니다.',
				links: [
					{
						title: '#11901',
						url: 'https://github.com/argoproj/argo-workflows/pull/11901',
					},
					{
						title: '#11444',
						url: 'https://github.com/argoproj/argo-workflows/pull/11444',
					},
					{
						title: '#11811',
						url: 'https://github.com/argoproj/argo-workflows/pull/11811',
					},
				],
			},
			'멘티 활동 결과로 과학기술정보통신부 장관상 대상을 수상했습니다.',
		],
	},
	{
		title: '멋쟁이사자처럼 프론트엔드 스쿨 3기',
		organization: '멋쟁이사자처럼',
		period: '2022.08 ~ 2023.01',
		items: [
			'Dawn With Me 4인 팀을 이끌며 프로젝트 구조를 설계하고 게시판 CRUD·프로필·인증 라우팅을 구현했습니다. 별도 회고조의 조장을 맡아 매주 회고 모임을 운영했습니다.',
		],
	},
];

const RESUME: Resume = {
	careers: CAREERS,
	education: EDUCATION,
	activities: ACTIVITIES,
};

export default RESUME;
