import { REVERSE_INFINITE_SCROLL_POST_URL } from '@/constant';
import { ORGANIZATIONS } from '@/constant/organizations';
import { type Careers, compareRecent, getProjectRange, type ProjectItem } from '@/constant/resume';

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
									'지역 상품 커머스 웰마켙은 상품, 배송비, 쿠폰, 웰포인트가 겹쳐 최종 결제 금액이 정해집니다. 화면에 보이는 합계와 PG 승인 금액이 어긋나면 결제 불일치로 이어지는데, 개발 중에 체크아웃 API가 확정한 금액과 화면이 합산한 금액이 실제로 달라진 적이 있었습니다. 결제 도중에는 재고가 먼저 소진되거나 주문이 만료될 수 있어, 그때마다 사용자가 다음에 할 일을 알 수 있어야 했습니다.',
								highlights: ['PG 승인 금액이 어긋나면', '재고가 먼저 소진되거나 주문이 만료될 수'],
							},
							{
								title:
									'결제 금액은 서버가 확정합니다. 결제 화면은 쿠폰·포인트 선택 내역만 체크아웃 API로 보내고, PG사에는 응답에 담긴 확정 금액 하나만 넘깁니다.\n\n결제 버튼을 누르는 순간 체크아웃을 한 번 더 호출해 서버가 재고와 쿠폰을 다시 검증하고, 재고 부족이면 모달로 알린 뒤 장바구니로 돌려보냅니다. 결제 뒤 화면의 버튼은 서버 주문 상태를 보고 한 곳에서 정하고, 입점업체 어드민도 같은 상태를 기준으로 만들었습니다.',
								highlights: ['확정 금액 하나만 넘깁니다', '서버 주문 상태를 보고 한 곳에서 정하고'],
							},
							{
								title:
									'2026.03 오픈 후 1개월간 결제 금액 관련 CS 문의와 API 에러 로그가 0건이었습니다. 결제 금액의 기준이 서버 응답 하나라서 쿠폰·포인트 조합이 늘어도 PG로 가는 금액은 한 곳에서 정해집니다.',
								highlights: ['결제 금액 관련 CS 문의와 API 에러 로그가 0건', '한 곳에서 정해집니다'],
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
									'PC 화면을 필터·본문·보조 영역 세 칸으로 나누되 본문은 기존 600px 폭을 그대로 두고, 카테고리별로 찾는 통합검색을 만들었습니다. 검색 상태의 원본은 URL이어서, 주소에서 카테고리·검색어·필터·정렬·페이지를 복원하고 사용자가 조작하면 상태를 바꾼 뒤 주소에 반영합니다.\n\n검색어를 바꿀 때는 기록을 남겨 뒤로가기가 되고, 필터와 정렬은 기록을 교체해 체크박스를 누를 때마다 기록이 쌓이지 않게 했습니다. 필터 상태는 PC 체크박스와 모바일 칩이 함께 쓰고, 잘못된 주소 값은 기본값으로 되돌립니다.',
								highlights: [
									'주소에서 카테고리·검색어·필터·정렬·페이지를 복원',
									'필터 상태는 PC 체크박스와 모바일 칩이 함께 쓰고',
								],
							},
							{
								title:
									'정책·답례품·동네소식·기부사업을 서비스별로 따로 찾던 흐름이 통합검색 한 화면으로 모였습니다. 개편 전후 2주 GA4 단순 전후 비교(A/B 테스트가 아닙니다)에서 데스크톱 평균 참여 시간이 약 20% 증가했습니다.',
								highlights: ['통합검색 한 화면으로 모였습니다', '데스크톱 평균 참여 시간이 약 20% 증가'],
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
									'기부 페이지에 들어오면 이전 기부 내역을 정산하는 요청을 한 번 보내 두고, 결제 버튼을 누르면 이 정산이 끝나기를 기다린 뒤 최신 완료 이력을 조회하는 순서로 고정했습니다. 완료 이력이 있으면 모달에 지자체와 금액을 보여 주고, 사용자가 기부를 계속할지 멈출지 직접 고릅니다.\n\n외부 납부로 나가기 직전에는 납부 식별값을 저장해 두고, 돌아오면 그 값으로 서버에 조회해 실제 완료 여부를 판별합니다. 환경마다 이동 방식은 나눴지만 복귀 뒤에는 모두 같은 서버 조회를 거칩니다.',
								highlights: ['정산이 끝나기를 기다린 뒤 최신 완료 이력을 조회', '서버에 조회해 실제 완료 여부를 판별'],
							},
							{
								title:
									'외부 납부를 거쳐도 최신 완료 이력을 기준으로 중복 여부를 확인하게 해, 중복 기부 관련 CS 재문의가 70% 감소했다고 CS 담당자가 전했습니다(별도 집계 데이터는 없습니다). Wello 앱·KB·토스 웹뷰와 일반 웹 모두 같은 서버 조회를 기준으로 완료 여부를 판별합니다.',
								highlights: ['CS 재문의가 70% 감소', '같은 서버 조회를 기준으로 완료 여부를 판별'],
							},
						],
					},
					{
						title: '의료·통신·신용 마이데이터 연동 및 연결 관리 구축',
						date: '2025.12 ~ 2026.01',
						details: [
							{
								title:
									'정책 추천에 의료·통신·신용 데이터를 활용하려면 KHIS·KOSCOM·NICE의 서로 다른 절차를 하나의 사용자 여정으로 연결해야 했습니다. 본인인증부터 약관 동의, 전송요구, 전자서명, 재동의, 철회, 전송 이력까지 긴 규제성 흐름이 새로고침과 외부 인증 이후에도 이어져야 했습니다.',
								highlights: ['서로 다른 절차를 하나의 사용자 여정으로 연결', '긴 규제성 흐름'],
							},
							{
								title:
									'외부 본인인증 SDK의 스크립트 로딩과 콜백 순서는 훅으로 감싸 한 곳에서 다루고, 화면이 사라질 때 정리합니다. 현재 단계는 주소에, 단계별 입력값은 세션 스토리지에 나눠 저장해 새로고침하거나 외부 인증을 다녀와도 같은 단계로 돌아오게 했습니다.\n\n기관별 인증·동의·전송요구·전자서명 화면은 단계 목록만 달리해 같은 방식으로 다뤘고, 연결 관리에서는 분야별 상세, 재동의, 개별·일괄 철회, 전송 이력을 구현했습니다.',
								highlights: ['외부 본인인증 SDK', '단계별 입력값은 세션 스토리지에'],
							},
							{
								title:
									'이 연동은 기관 심사에서 반려되어 운영 성과나 수치는 없고, 구현한 범위를 적습니다. 일괄 철회는 기관 요청을 병렬로 처리하고 실패한 항목만 안내해, 일부가 실패해도 나머지 처리가 유지됩니다.',
								highlights: ['기관 심사에서 반려', '실패한 항목만 안내'],
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
									'Wello-biz는 Chakra UI 기반 공통 컴포넌트와 yup 검증, 여러 서드파티 UI 라이브러리가 섞여 있었습니다. 그래서 공통 디자인 시스템과 Zod를 쓰는 모노레포의 다른 앱과 UI·검증 방식이 갈려 있었습니다.',
								highlights: ['Chakra UI 기반 공통 컴포넌트와 yup 검증', 'UI·검증 방식이 갈려 있었습니다'],
							},
							{
								title:
									'Chakra에 의존하던 Modal·Alert·Table 같은 컴포넌트는 공통 디자인 시스템으로 바꾸고, 대시보드 카드 슬라이드는 Embla Carousel로 옮기면서 카드 너비를 flex 비율로 정했습니다. 패널 크기 조절은 스와이프 라이브러리 대신 Pointer Events로 직접 만들어, 빠르게 끌어도 커서를 놓치지 않게 했습니다.\n\nyup 검증은 Zod로 옮기면서 React Hook Form과 이어 주는 resolver를 직접 만들어 배열이나 객체 안의 필드에도 오류가 붙게 했습니다. Zod가 선언하지 않은 필드를 지우는 폼은 스키마를 looseObject로 선언해 필드가 빠지지 않게 했습니다.',
								highlights: ['Embla Carousel로 옮기면서', '빠르게 끌어도 커서를 놓치지 않게'],
							},
							{
								title:
									'Wello-biz 소스에는 Chakra UI, yup, Swiper를 직접 가져오는 코드가 남아 있지 않고, UI는 공통 디자인 시스템과 Tailwind로, 검증은 Zod 하나로 맞춰졌습니다. 빠르게 끌면 커서를 잃던 패널 크기 조절도 같이 고쳤습니다.',
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
									'탭을 2개 열고 작업하면 한쪽이 로그아웃된다는 내부 구성원의 요청이 있었습니다. 토큰이 만료돼도 자동으로 갱신되지 않아 운영자가 직접 다시 로그인해야 했습니다. Next.js 어드민은 탭마다 토큰을 따로 들고 있어 다른 탭이 옛 토큰으로 요청했고, 웰로·웰로비즈 어드민은 같은 이름의 쿠키가 서로의 로그인 정보를 덮어썼습니다.',
								highlights: ['자동으로 갱신되지 않아', '쿠키가 서로의 로그인 정보를 덮어썼습니다'],
							},
							{
								title:
									'요청이 401을 받으면 먼저 실패한 요청의 토큰을 쿠키의 토큰과 비교하고, 다르면 다른 탭이 먼저 갱신한 것이므로 갱신 없이 그 값으로 바로 다시 요청합니다. 같으면 갱신하는데, 진행 중인 갱신 Promise가 있으면 새로 요청하지 않고 그 결과를 함께 기다립니다.\n\n갱신 토큰이 한 번만 쓸 수 있는 방식이면 동시에 거절된 요청이 각자 갱신할 때 첫 요청만 성공하고 나머지는 로그아웃될 수 있기 때문입니다. 쿠키는 웰로·웰로비즈 접속 도메인별로 분리했습니다.',
								highlights: ['쿠키의 토큰과 비교', '진행 중인 갱신 Promise가 있으면 새로 요청하지 않고'],
							},
							{
								title:
									'탭 로그아웃과 쿠키 덮어쓰기가 해소돼 웰로·웰로비즈 어드민 모두에 적용했고, 이후 같은 요청은 없었습니다. 재로그인 횟수처럼 효과를 수치로 잰 값은 없습니다.',
								highlights: ['해소돼', '같은 요청은 없었습니다'],
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
									'고객사 콘텐츠를 근거로 답변하는 AI 챗봇의 사용자 화면과, 운영자가 지식 파일과 OG 정보를 직접 관리하는 CMS가 함께 필요했습니다. 답변이 만들어지는 동안 빈 화면으로 기다리지 않게 해야 했고, 긴 대화 이력을 불러와도 읽던 위치가 밀리지 않아야 했습니다. 이전 대화는 목록 위에 붙기 때문에 스크롤 위치를 따로 보정해야 합니다.',
								highlights: ['빈 화면으로 기다리지 않게', '읽던 위치가 밀리지 않아야'],
							},
							{
								title:
									'AI 설문 MVP에서 쓰던 스트림 처리·응답 상태 관리 패턴을 가져와 OpenAI Assistants의 답변을 대화 화면에 순차 반영했습니다. 질문을 보내면 빈 말풍선을 먼저 만들고 글자가 올 때마다 이어 붙이며, 스트림을 끈 설정에서는 응답이 JSON으로 오므로 상태를 폴링하는 쪽으로 나눴습니다.\n\n이전 대화는 위로 스크롤할 때 10개씩 불러오고, 항목이 위에 붙으면 추가된 높이만큼 스크롤 위치를 보정해 사용자가 읽던 지점을 유지합니다. CMS에서는 OG 편집, 미리보기 채팅, 지식 파일과 벡터 스토어를 다루는 화면을 맡았습니다.',
								highlights: ['OpenAI Assistants의 답변을 대화 화면에 순차 반영', '사용자가 읽던 지점을 유지'],
								links: [
									{
										title: '관련글',
										url: REVERSE_INFINITE_SCROLL_POST_URL,
									},
								],
							},
							{
								title:
									'챗봇 사용자 서비스와 CMS를 실제로 운영했습니다. 운영자는 CMS에서 유튜브 요약을 포함한 지식 파일을 등록·삭제하고 OG 정보를 고치며, 방문자·대화 통계를 확인할 수 있습니다(정량 결과는 없습니다).',
								highlights: ['사용자 서비스와 CMS를 실제로 운영', '지식 파일을 등록·삭제하고 OG 정보를 고치며'],
							},
						],
					},
					{
						title: 'AI 챗봇 고객사별 메타데이터·Open Graph 서버 렌더링 구축',
						date: '2025.01 ~ 2025.08',
						details: [
							{
								title:
									'고객사마다 브랜드와 언어가 다른 챗봇을 제공했지만, React CSR 구조에서는 검색 엔진과 링크 미리보기에 고객사별 정보를 제대로 전달하기 어려웠습니다. 신규 고객사가 추가될 때마다 메타데이터를 코드에 직접 반영하는 방식은 고객사가 늘수록 부담이었습니다.',
								highlights: ['고객사별 정보를 제대로 전달하기 어려웠습니다', '코드에 직접 반영하는 방식'],
							},
							{
								title:
									'서비스가 Next.js 15 App Router 기반으로 옮겨진 뒤, 주소의 첫 칸이 고객사 코드가 되도록 라우트를 재구성했습니다. 서버의 generateMetadata가 그 코드로 고객사 설정을 조회해 title, description, Open Graph, twitter 카드를 채우고, 메인 페이지는 접속한 도메인 헤더를 보고 한국어와 일본어 메타데이터를 고릅니다.\n\n값은 CMS에서 고쳐야 하므로 OG 편집 화면을 만들어, zod로 폼을 검증하고 OG 이미지는 presigned URL로 올리며 저장 전에 링크 미리보기를 확인할 수 있게 했습니다.',
								highlights: ['generateMetadata가 그 코드로 고객사 설정을 조회해', 'OG 편집 화면'],
							},
							{
								title:
									'고객사별 제목·설명·Open Graph를 서버에서 만들기 때문에 검색 엔진과 링크 미리보기가 고객사별 정보를 받고, 값은 CMS에서 고치므로 프론트엔드를 다시 배포하지 않고 반영됩니다. 신규 고객사도 코드를 고치지 않고 같은 방식으로 메타데이터가 만들어지며, 검색 노출이나 클릭률을 잰 수치는 없습니다.',
								highlights: ['프론트엔드를 다시 배포하지 않고 반영', '신규 고객사도 코드를 고치지 않고'],
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
									'Swing은 업무 지원 기능과 Unity WebGL 가상 오피스를 함께 제공하는 신규 서비스였습니다. 백엔드 개발자 1명과 2인 팀에서 사용자 웹과 관리자 CMS 프론트엔드를 구축하고, 웹 인증을 가상 오피스 진입에 연결해야 했습니다. 계약서를 다루는 화면에서는 수정할 때 기존 첨부파일이 사라지는 문제도 풀어야 했고, Unity WebGL 개발은 담당하지 않았습니다.',
								highlights: ['백엔드 개발자 1명과 2인 팀', '사용자 웹과 관리자 CMS 프론트엔드를 구축'],
							},
							{
								title:
									'서비스 개발에 앞서 사용자 웹용 Webpack 5와 CMS용 Vite 보일러플레이트, 두 앱이 함께 쓰는 CMS UI 패키지를 구축하고, 이를 적용해 사용자 웹과 관리자 CMS의 화면을 구현했습니다. 계약을 수정할 때는 기존 첨부파일과 새로 올린 파일의 링크를 합쳐 요청하고, 계약 관리번호가 중복이면 그 입력 항목에 오류를 표시합니다.\n\n웹 로그인 토큰을 쿠키로 공유해 가상 오피스 진입 페이지가 인증하도록 연결했고, 게스트는 토큰 없이 들어오며 토큰이 없으면 로그인으로 돌려보냅니다. Unity 자산을 환경별 S3 경로에서 받아 빌드에 포함하는 부분도 맡았습니다.',
								highlights: [
									'보일러플레이트, 두 앱이 함께 쓰는 CMS UI 패키지',
									'기존 첨부파일과 새로 올린 파일의 링크를 합쳐 요청',
								],
							},
							{
								title:
									'인증 같은 횡단 관심사를 한 파일에 모으고 폴더 구조와 UI 라이브러리를 맞춘 Webpack 사용자 웹과 Vite CMS를 프론트엔드 담당 한 명으로 개발해, 인증부터 가상 오피스 진입까지 연결했습니다. 개발 기간 단축이나 오류 감소 같은 수치는 측정하지 않았습니다.',
								highlights: ['횡단 관심사를 한 파일에 모으고', '폴더 구조와 UI 라이브러리를 맞춘'],
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
									'앱 진입점을 lazy loading과 Suspense 경계로 분리하고, 아바타 파츠·JSON 자산은 S3·CDN 경로에서 불러오도록 이전했습니다.\n\n3D 뷰와 편집 상태는 역할별 컴포넌트·훅으로 나눠, 편집 화면은 보여 줄 대상을 계산하고 3D 뷰는 받은 값을 적용하기만 하게 했습니다. 저장 화면은 별도 썸네일 뷰로 제출 가능 상태를 정하고, 업로드 이미지는 16MB와 정사각형 비율을 검사합니다.',
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
