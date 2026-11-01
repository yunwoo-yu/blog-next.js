import { REVERSE_INFINITE_SCROLL_POST_URL } from '@/constant';
import { ORGANIZATIONS } from '@/constant/organizations';
import { type Careers, compareRecent, getProjectRange, type ProjectItem, SWING_PROJECT_TITLE } from '@/constant/resume';

export type Project = {
	title: string;
	date?: string;
	details: (Pick<ProjectItem, 'links'> & { title: string; highlights: string[] })[];
};

export type ServiceGroup = {
	service: string;
	serviceUrl?: string;
	serviceDescription?: string;
	projects: Project[];
};

export type DetailCareer = Careers & { serviceGroups: ServiceGroup[] };

export type CareerProject = Pick<ServiceGroup, 'service' | 'serviceUrl' | 'serviceDescription'> & {
	project: Project;
};

/** 서비스 구분 없이 프로젝트를 종료일 → 시작일 순으로 최신부터 펼친다. 날짜가 없으면 맨 뒤, 같으면 작성 순서. */
export function getCareerProjects(career: Pick<DetailCareer, 'serviceGroups'>): CareerProject[] {
	return career.serviceGroups
		.flatMap(({ projects, ...service }) => projects.map(project => ({ ...service, project })))
		.map((item, index) => ({ item, index, range: getProjectRange(item.project.date) }))
		.sort((a, b) => compareRecent(a.range, b.range) || a.index - b.index)
		.map(({ item }) => item);
}

/**
 * 포트폴리오용 상세 경력 원문. 이력서(@/constant/resume)는 같은 프로젝트를 1~2줄 요약으로 싣는다.
 * 조직·서비스·프로젝트 제목과 기간은 이력서 항목과 같아야 한다(career-detail.test.ts 가 검사).
 * 사실을 바꾸면 두 파일을 함께 고친다.
 */
export const CAREER_DETAIL: DetailCareer[] = [
	{
		organization: ORGANIZATIONS.WELLO,
		position: '프론트엔드 개발자 | 제품실 개발팀',
		startDate: '2025.11',
		endDate: '2026.06',
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
						title: '웰마켙 결제·배송·리뷰와 입점업체 어드민 구축',
						date: '2026.02 ~ 2026.05',
						details: [
							{
								title:
									'지역 상품을 파는 웰마켙은 상품값, 배송비, 쿠폰, 웰포인트(서비스 포인트)를 합쳐 최종 결제 금액이 정해집니다. 화면에 보이는 합계와 PG 승인 금액이 어긋나면 결제 불일치로 이어지는데, 개발 중에 체크아웃 API가 확정한 금액과 화면이 합산한 금액이 실제로 달라진 적이 있었습니다. 결제 도중에는 재고가 먼저 소진되거나 주문이 만료될 수 있어, 그때마다 사용자가 다음에 할 일을 알 수 있어야 했습니다.',
								highlights: ['PG 승인 금액이 어긋나면', '재고가 먼저 소진되거나 주문이 만료될 수'],
							},
							{
								title:
									'처음에는 화면이 금액을 계산하고 서버는 검증만 했는데, 이 불일치를 겪고 결제 금액을 서버가 확정하도록 바꿨습니다. 결제 화면은 쿠폰·포인트 선택 내역만 체크아웃 API로 보내고, PG에는 응답에 담긴 확정 금액 하나만 넘깁니다.\n\n결제 버튼을 누르는 순간 체크아웃을 한 번 더 호출해 서버가 재고와 쿠폰을 다시 검증하고, 재고 부족이면 안내 창으로 알린 뒤 장바구니로 돌려보냅니다. 결제 뒤 화면의 버튼은 서버 주문 상태를 보고 프론트엔드 코드 한 곳에서 정하고, 입점업체 어드민(판매 업체용 관리 화면)의 반품 상태 표시도 서버 상태를 기준으로 만들었습니다.',
								highlights: ['확정 금액 하나만 넘깁니다', '서버 주문 상태를 보고 프론트엔드 코드 한 곳에서 정하고'],
							},
							{
								title: '오픈 후 1개월 동안 결제 금액 관련 CS 문의와 API 에러 로그는 0건이었습니다.',
								highlights: ['결제 금액 관련 CS 문의와 API 에러 로그는 0건'],
							},
						],
					},
					{
						title: 'Wello PC 반응형 전환 및 통합검색 구축',
						date: '2026.04',
						details: [
							{
								title:
									'Wello는 PC에서도 600px 고정폭 모바일 화면을 노출했고, 정책·답례품·동네소식·기부사업은 각 메뉴에 흩어져 있었습니다. PC 사용자는 원하는 콘텐츠를 찾으려고 서비스별로 다시 탐색해야 했습니다. 검색 조건을 정한 뒤 상세 화면에 다녀오거나 링크를 공유해도 같은 조건이 유지돼야 했습니다.',
								highlights: ['PC에서도 600px 고정폭 모바일 화면', '서비스별로 다시 탐색'],
							},
							{
								title:
									'PC 화면을 필터·본문·보조 영역 세 칸으로 나누되 본문은 기존 600px 폭을 그대로 두고, 카테고리별로 찾는 통합검색을 만들었습니다. 진입하거나 뒤로가기로 오면 URL에서 카테고리·검색어·필터·정렬·페이지를 복원하고, 사용자가 조건을 바꾸면 상태를 먼저 갱신한 뒤 effect에서 URL에 씁니다.\n\n검색어는 push, 필터와 정렬은 replace로 나눠 체크박스를 누를 때마다 히스토리가 쌓이지 않게 했습니다. 필터 상태는 PC 체크박스와 모바일 선택 버튼이 함께 쓰고, 잘못된 주소 값은 기본값으로 되돌립니다.',
								highlights: [
									'카테고리·검색어·필터·정렬·페이지를 복원',
									'필터 상태는 PC 체크박스와 모바일 선택 버튼이 함께 쓰고',
								],
							},
							{
								title:
									'데스크톱 평균 참여 시간이 약 20% 증가했습니다(GA4, 개편 전후 2주 단순 비교). 정책·답례품·동네소식·기부사업을 메뉴마다 따로 찾던 흐름도 통합검색 한 화면으로 모였습니다.',
								highlights: ['데스크톱 평균 참여 시간이 약 20% 증가', '통합검색 한 화면으로 모였습니다'],
							},
						],
					},
					{
						title: '외부 납부 환경의 중복 기부 재확인',
						date: '2025.12 ~ 2026.01',
						details: [
							{
								title:
									'고향사랑기부는 신청 후 외부 지로 화면에서 납부를 마치는 구조였습니다. 앱·웹뷰를 벗어난 뒤에는 Wello가 진행 상태를 즉시 알기 어렵고, 납부 완료 반영이 늦으면 사용자가 같은 기부를 다시 시도할 수 있었습니다. 외부로 나가는 방식도 Wello 앱, KB 웹뷰, 토스, 일반 웹마다 달랐습니다.',
								highlights: ['진행 상태를 즉시 알기 어렵고', '같은 기부를 다시 시도'],
							},
							{
								title:
									'기부 페이지에 들어오면 정산(이전 납부 결과를 서비스 내역에 반영하는 처리)을 한 번 요청해 두고, 결제 버튼을 누르면 이 정산이 끝나기를 기다린 뒤 최신 완료 이력을 조회하는 순서로 고정해 방금 납부한 건까지 이력에 들어오게 했습니다. 완료 이력이 있으면 확인 창에 지자체와 금액을 보여 주고, 사용자가 기부를 계속할지 멈출지 직접 고릅니다.\n\n외부 납부로 나가기 직전에는 납부 식별값을 저장해 두고, 돌아오면 그 값으로 서버에 조회해 실제 완료 여부를 판별합니다. 환경마다 이동 방식은 나눴지만 복귀 뒤에는 모두 같은 서버 조회를 거칩니다.',
								highlights: ['정산이 끝나기를 기다린 뒤 최신 완료 이력을 조회', '서버에 조회해 실제 완료 여부를 판별'],
							},
							{
								title:
									'중복 기부 관련 CS 재문의가 약 70% 줄었습니다(CS 담당자 전언). Wello 앱·KB·토스 웹뷰와 일반 웹이 모두 최신 완료 이력을 기준으로 중복 여부를 확인합니다.',
								highlights: ['CS 재문의가 약 70% 줄었습니다'],
							},
						],
					},
					{
						title: '의료·통신·신용 마이데이터 연동 및 연결 관리 구축',
						date: '2025.12 ~ 2026.01',
						details: [
							{
								title:
									'마이데이터를 정책 추천에 활용하려면 KHIS·KOSCOM·NICE의 서로 다른 절차를 하나의 사용자 여정으로 연결해야 했습니다. 본인인증부터 약관 동의, 전송요구, 전자서명, 재동의, 철회, 전송 이력까지 긴 규제성 흐름이 새로고침과 외부 인증 이후에도 이어져야 했습니다.',
								highlights: ['서로 다른 절차를 하나의 사용자 여정으로 연결', '긴 규제성 흐름'],
							},
							{
								title:
									'외부 본인인증 SDK의 스크립트 로딩과 완료 알림 순서는 공통 함수로 모으고, 화면을 닫을 때 이 인증 연결을 정리합니다. 현재 단계는 주소에, 단계별 입력값은 세션 스토리지에 나눠 저장해 새로고침하거나 외부 인증을 다녀와도 같은 단계로 돌아오게 했습니다.\n\n기관별 인증·동의·전송요구·전자서명 화면은 단계 목록만 달리해 같은 방식으로 다뤘고, 연결 관리에서는 분야별 상세, 재동의, 개별·일괄 철회, 전송 이력을 구현했습니다.',
								highlights: ['외부 본인인증 SDK', '단계별 입력값은 세션 스토리지'],
							},
							{
								title:
									'외부 인증 후 저장한 단계와 입력값을 복원하고, 일괄 철회는 기관별 요청을 동시에 보내 실패한 항목만 안내하도록 구현했습니다.',
								highlights: ['단계와 입력값을 복원', '실패한 항목만 안내'],
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
						title: 'Wello-biz 레거시 UI 스택 정리 (Chakra UI·yup 제거)',
						date: '2026.01',
						details: [
							{
								title:
									'Wello-biz에는 Chakra UI 기반 공통 컴포넌트와 yup, Swiper 같은 외부 도구가 섞여 있었습니다. 같은 저장소의 다른 앱은 공통 디자인 시스템과 Zod를 써서, 앱마다 UI·검증 방식이 갈려 있었습니다.',
								highlights: ['Chakra UI 기반 공통 컴포넌트', '검증 방식이 갈려 있었습니다'],
							},
							{
								title:
									'Chakra에 의존하던 대화창·알림·표 같은 화면 부품은 공통 디자인 시스템으로 바꾸고, 대시보드 카드 슬라이드는 Embla Carousel로 옮기면서 카드 너비를 화면 안의 비율로 정했습니다. 패널 크기 조절은 스와이프 도구 대신 Pointer Events로 직접 만들어, 빠르게 끌어도 커서를 놓치지 않게 했습니다.\n\nyup 검증은 Zod로 옮기면서 React Hook Form과 이어 주는 resolver를 직접 만들어 배열이나 객체 안의 입력 칸에도 오류가 표시되게 했습니다. 서버 응답 전체를 폼 값으로 쓰며 선언되지 않은 값도 다시 보내야 하는 화면은 looseObject로 바꿔 값이 빠지지 않게 했습니다.',
								highlights: ['카드 슬라이드는 Embla Carousel', '빠르게 끌어도 커서를 놓치지 않게'],
							},
							{
								title:
									'Wello-biz 소스에는 Chakra UI, yup, Swiper를 직접 가져오는 코드가 남아 있지 않고, UI는 공통 디자인 시스템과 Tailwind로, 검증은 Zod 하나로 맞춰졌습니다.',
								highlights: ['직접 가져오는 코드가 남아 있지 않고', 'Zod 하나로 맞춰'],
							},
						],
					},
				],
			},
			{
				service: 'Wello 통합 어드민',
				serviceDescription: '통합 운영 어드민',
				projects: [
					{
						title: 'Next.js·Vue 통합 어드민 토큰 자동 갱신',
						date: '2026.01',
						details: [
							{
								title:
									'탭을 2개 열고 작업하면 한쪽이 로그아웃된다는 내부 구성원의 요청이 있었습니다. 토큰이 만료돼도 자동 갱신이 없어 운영자가 매번 다시 로그인해야 했습니다. Next.js 어드민은 각 탭이 들고 있는 토큰과 쿠키의 토큰이 달라져도 옛 토큰으로 요청했고, 웰로·웰로비즈 어드민은 같은 이름의 쿠키가 서로의 로그인 정보를 덮어썼습니다.',
								highlights: ['자동 갱신이 없어', '쿠키가 서로의 로그인 정보를 덮어썼습니다'],
							},
							{
								title:
									'Next.js 어드민에서 요청이 401을 받으면 먼저 실패한 요청의 토큰을 쿠키의 토큰과 비교하고, 다르면 다른 탭이 먼저 갱신한 것이므로 갱신 없이 그 값으로 바로 다시 요청합니다. 토큰이 같으면 갱신하되, 같은 탭에서 이미 갱신 중이면 새로 요청하지 않고 그 Promise를 같이 기다리게 했습니다.\n\n갱신 토큰이 한 번만 쓸 수 있는 방식이면 동시에 거절된 요청이 각자 갱신할 때 첫 요청만 성공하고 나머지는 로그아웃될 수 있기 때문입니다. 쿠키는 웰로·웰로비즈 접속 도메인별로 분리했습니다.',
								highlights: ['쿠키의 토큰과 비교', '그 Promise를 같이 기다리게'],
							},
							{
								title:
									'웰로·웰로비즈 어드민 둘 다에 적용했고, 탭 두 개로 작업하면 로그아웃되던 문제와 쿠키 덮어쓰기가 해소됐습니다.',
								highlights: ['어드민 둘 다에 적용했고', '쿠키 덮어쓰기가 해소됐습니다'],
							},
						],
					},
				],
			},
		],
	},
	{
		organization: ORGANIZATIONS.SALIN,
		position: '프론트엔드 개발자 | ILab',
		startDate: '2023.08',
		endDate: '2025.08',
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
									'답변이 만들어지는 동안 빈 화면으로 기다리지 않게 하고, 이전 대화를 불러와도 읽던 위치를 유지해야 했습니다. React CSR에서는 고객사별 정보를 검색 엔진과 링크 미리보기에 전달하기 어려워 SSR이 필요했습니다. 고객사별 메타데이터를 코드에 직접 작성하면 신규 고객사나 값 변경 때마다 코드를 고쳐야 했습니다.',
								highlights: ['읽던 위치를 유지', '고객사별 메타데이터'],
							},
							{
								title:
									'AI 설문 MVP의 스트림 처리 패턴을 가져와 OpenAI Assistants의 글자를 빈 말풍선에 이어 붙이고, 조각으로 받지 않는 설정은 폴링으로 나눴습니다. 타이머로 위치를 되돌리는 방식은 시간을 정할 근거가 없어, 이전 대화를 목록 위에 붙이기 전후의 높이 차이만큼 스크롤 위치를 보정하는 방식으로 정했습니다.\n\nNext.js 15 App Router로 옮겨진 서비스의 라우트를 고객사 코드 아래로 재구성하고, generateMetadata와 메타 조회 함수가 고객사 코드로 설정을 조회해 서버에서 메타데이터·Open Graph를 만들며 메인 페이지는 요청 헤더의 도메인으로 한국어·일본어 메타데이터를 고르게 했습니다. CMS에는 지식 파일·벡터 스토어 관리 화면과, zod로 검증하고 이미지를 presigned URL로 올리며 저장 전 링크 미리보기를 보여 주는 OG 편집 화면을 만들었습니다.',
								highlights: ['스크롤 위치를 보정', '고객사 코드로 설정을 조회'],
								links: [
									{
										title: '관련글',
										url: REVERSE_INFINITE_SCROLL_POST_URL,
									},
								],
							},
							{
								title:
									'챗봇 사용자 서비스와 CMS를 실제로 운영했으며, 운영자는 지식 파일을 등록·삭제하고 방문자·대화 통계를 확인할 수 있습니다. CMS에서 운영자가 OG 값을 바꾸면 프론트엔드 재배포 없이 반영되고, 신규 고객사도 같은 방식으로 메타데이터가 생성됩니다.',
								highlights: ['사용자 서비스와 CMS를 실제로 운영', '프론트엔드 재배포 없이 반영'],
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
						title: SWING_PROJECT_TITLE,
						date: '2024.01 ~ 2024.07',
						details: [
							{
								title:
									'Swing은 업무 지원 기능과 Unity WebGL 가상 오피스를 함께 제공하는 신규 서비스였습니다. 사용자 웹 프론트엔드를 단독으로 구축하고 관리자 CMS 프론트엔드도 개발하며, 웹 인증을 가상 오피스 진입에 연결해야 했습니다. 계약서를 다루는 화면에서는 수정할 때 기존 첨부파일이 사라지는 문제도 풀어야 했고, Unity WebGL 개발은 담당하지 않았습니다.',
								highlights: ['사용자 웹 프론트엔드를 단독으로 구축', '관리자 CMS 프론트엔드도 개발'],
							},
							{
								title:
									'서비스 개발에 앞서 사용자 웹용 Webpack 5와 CMS용 Vite 보일러플레이트, 두 앱이 함께 쓰는 CMS UI 패키지를 구축하고, 이를 적용해 사용자 웹과 관리자 CMS의 화면을 구현했습니다. 계약을 수정할 때는 기존 첨부파일과 새로 올린 파일의 링크를 합쳐 요청하고, 계약 관리번호가 중복이면 그 입력 항목에 오류를 표시합니다.\n\n가상 오피스 진입 시 게스트는 토큰 없이 허용하고, 로그인 사용자는 쿠키의 토큰으로 인증하며, 게스트가 아닌데 토큰이 없으면 로그인 화면으로 보냅니다. 가상 오피스 실행에 쓰는 Unity 파일을 S3 경로에서 받아 웹 배포용 빌드에 포함하는 부분도 맡았습니다.',
								highlights: ['두 앱이 함께 쓰는 CMS UI 패키지', '기존 첨부파일과 새로 올린 파일의 링크를 합쳐 요청'],
							},
							{
								title:
									'사용자 웹은 단독 개발하고 관리자 CMS 프론트엔드도 개발해, 인증부터 가상 오피스 진입까지 연결했습니다.',
								highlights: ['사용자 웹은 단독 개발', '관리자 CMS 프론트엔드도 개발'],
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
									'외주 업체에서 인수한 WebGL 아바타 서비스는 3D 렌더링과 대용량 파일이 초기 진입을 막아 3초 이상 빈 화면이 노출됐습니다. 3D·편집 로직이 큰 컴포넌트에 섞여 있어 작은 기능 변경도 기존 동작에 영향을 주기 쉬웠습니다.',
								highlights: ['3초 이상 빈 화면', '작은 기능 변경도 기존 동작에 영향을 주기 쉬웠습니다'],
							},
							{
								title:
									'3D 뷰에 Suspense 경계를 두었고, 별도로 CDN 파일 경로는 환경 변수 상수로 모았습니다.\n\n편집 화면은 어떤 메시에 어떤 텍스처를 입힐지만 계산하고, 3D 뷰는 받은 값을 적용만 하게 나눴습니다. 그래서 업로드 이미지 같은 기능을 넣을 때 렌더링 코드를 같이 고치지 않아도 되는 구조가 됐습니다. 저장 화면은 별도 썸네일 뷰로 제출 가능 상태를 정하고, 업로드 이미지는 16MB와 정사각형 비율을 검사합니다.',
								highlights: ['3D 뷰에 Suspense', '파일 경로는 환경 변수 상수'],
							},
							{
								title: 'FCP가 3초 이상에서 400~600ms로 줄었습니다(Lighthouse 측정).',
								highlights: ['400~600ms로 줄었습니다'],
							},
						],
					},
				],
			},
		],
	},
];
