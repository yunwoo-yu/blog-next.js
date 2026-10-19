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
									'지역 상품 커머스 웰마켙은 상품·배송비·쿠폰·웰포인트가 겹쳐 최종 결제 금액이 복잡하게 정해집니다. 화면에 보이는 금액과 PG 승인 금액이 어긋나면 결제 불일치로 이어지고, 재고 소진·주문 만료·인증 실패 같은 중단 상황에서도 사용자가 다음 행동을 알 수 있어야 했습니다.',
								highlights: ['PG 승인 금액이 어긋나면', '재고 소진·주문 만료·인증 실패'],
							},
							{
								title:
									'쿠폰·포인트 선택 내역을 체크아웃 API로 보내고, 서버가 확정한 금액만 NICEPAY에 요청하도록 결제 금액 기준을 서버로 고정했습니다. 인증 결과는 응답 코드별(사용자 취소·통신 실패 등)로 안내하고, 재고 부족·주문 만료는 장바구니로 돌려보내 다시 선택하게 했습니다. 배송·취소·반품·환불 화면과 운영 어드민은 같은 서버 주문 상태 코드를 기준으로 동작하게 맞췄습니다.',
								highlights: ['서버가 확정한 금액만 NICEPAY에 요청', '같은 서버 주문 상태 코드를 기준으로'],
							},
							{
								title: '2026.03 오픈 후 1개월간 결제 금액 관련 CS 문의와 API 에러 로그가 0건이었습니다.',
								highlights: ['결제 금액 관련 CS 문의와 API 에러 로그가 0건'],
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
									'주요 화면을 PC 레이아웃으로 확장하고, 흩어진 콘텐츠를 카테고리별로 찾는 통합검색을 구축했습니다. 검색어·카테고리·필터를 URL에 담아 공유하거나 새로고침하고 상세 화면에서 돌아와도 같은 결과가 복원되게 했습니다. 필터는 같은 상태와 동작을 PC 사이드바와 모바일 드로어에 함께 연결해 화면만 다르게 그렸습니다.',
								highlights: ['검색어·카테고리·필터를 URL에 담아', 'PC 사이드바와 모바일 드로어에 함께 연결'],
							},
							{
								title:
									'정책·답례품·동네소식·기부사업을 서비스별로 따로 찾던 흐름이 통합검색 한 화면으로 모였습니다. 개편 전후 2주 GA4 단순 전후 비교에서 데스크톱 평균 참여 시간이 약 20% 증가했습니다.',
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
									'고향사랑기부는 신청 후 외부 지로 화면에서 납부를 완료하는 구조였습니다. 앱·웹뷰를 벗어난 뒤에는 Wello가 진행 상태를 즉시 알기 어렵고, 납부 완료 반영이 늦으면 사용자가 같은 기부를 다시 시도할 수 있었습니다.',
								highlights: ['진행 상태를 즉시 알기 어렵고', '같은 기부를 다시 시도'],
							},
							{
								title:
									'기부 페이지에 진입하면 이전 기부 내역을 정산하고, 결제 직전에는 정산이 끝난 뒤 최신 완료 이력을 다시 조회해 지자체·금액을 보여 주고 사용자가 확인한 뒤 진행할지 선택하게 했습니다. 외부 납부로 이동하기 직전에 납부 식별값을 저장해 두고, 돌아오면 서버에 조회해 실제 완료 여부를 판별했습니다.',
								highlights: [
									'정산이 끝난 뒤 최신 완료 이력을 다시 조회',
									'돌아오면 서버에 조회해 실제 완료 여부를 판별',
								],
							},
							{
								title:
									'외부 납부를 거쳐도 최신 완료 이력을 기준으로 중복 여부를 확인하게 해, 중복 기부 관련 CS 재문의가 70% 감소했습니다. Wello 앱·KB·토스 웹뷰와 일반 웹 모두 같은 서버 조회를 기준으로 완료 여부를 판별합니다.',
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
									'27개 API를 연동하며 외부 본인인증 SDK의 스크립트 로딩과 콜백 순서를 커스텀 훅으로 감싸고, KHIS 4단계·KOSCOM 3단계·NICE 2단계의 인증·동의·전송요구·전자서명 화면을 구현했습니다. 연동 중간값은 세션 스토리지에 단계별로 저장·정리하고, 연결 관리에서는 분야별 상세·재동의·개별·일괄 철회·전송 이력을 구현했습니다.',
								highlights: ['커스텀 훅으로 감싸고', '세션 스토리지에 단계별로 저장·정리'],
							},
							{
								title:
									'의료·통신·신용 연동부터 연결 상태 확인, 재동의, 철회, 전송 이력까지 사용자 흐름이 이어집니다. 분야별 연동 여부를 기준으로 직접 접근을 차단하고, 일괄 철회는 기관 요청을 병렬 처리한 뒤 실패한 항목만 안내해 일부 실패에도 나머지 처리가 유지되게 했습니다.',
								highlights: ['직접 접근을 차단', '실패한 항목만 안내'],
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
									'Wello-biz는 Chakra UI 기반 공통 컴포넌트와 yup 검증, 여러 서드파티 UI 라이브러리가 섞여 있어, 공통 디자인 시스템과 Zod를 쓰는 모노레포의 다른 앱과 UI·검증 방식이 갈려 있었습니다.',
								highlights: ['Chakra UI 기반 공통 컴포넌트와 yup 검증', 'UI·검증 방식이 갈려 있었습니다'],
							},
							{
								title:
									'Chakra에 의존한 Modal·Alert·Table 등 글로벌 컴포넌트를 공통 디자인 시스템의 Modal·Button 조합으로 바꾸고, 캐러셀은 Embla Carousel로, 스와이프는 브라우저 Pointer Events 직접 구현으로 교체했습니다. yup 검증은 Zod로 전환했고, Zod가 선언하지 않은 필드를 제출 데이터에서 지우는 문제는 해당 폼의 스키마를 느슨한 객체로 바꿔 해결했습니다. 폼 라이브러리 연결부는 입력과 출력 타입이 다른 스키마도 받는 어댑터를 직접 작성해 통일했습니다.',
								highlights: [
									'Embla Carousel로, 스와이프는 브라우저 Pointer Events 직접 구현',
									'느슨한 객체로 바꿔 해결',
								],
							},
							{
								title:
									'wello-biz에서 Chakra UI(글로벌 테마 포함), yup, Swiper, react-swipeable, react-feather 의존성이 사라졌고, UI는 공통 디자인 시스템과 Tailwind, 검증은 Zod 하나로 통일되면서 번들이 줄었습니다. 제거한 라이브러리의 gzip 크기 합계는 약 137KB(대체한 Embla·Zod 추가분을 빼면 약 110KB 이상 감소한 것으로 추정, 라이브러리 단위 esbuild 측정이며 앱 번들 실측은 아님)였습니다. 스와이프 라이브러리를 대체한 드래그 리사이즈는 setPointerCapture로 빠른 드래그에서 커서를 잃던 문제도 없앴습니다. 정리 규모는 Chakra 의존 컴포넌트 137개 파일(23,640줄 삭제 포함), legacy-assets 폴더 123개 파일 삭제입니다.',
								highlights: ['의존성이 사라졌고', 'Zod 하나로 통일되면서 번들이 줄었습니다'],
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
						title: 'Next.js·Vue 통합 어드민 토큰 자동 갱신',
						date: '2026.03',
						details: [
							{
								title:
									'탭을 2개 열고 작업하면 한쪽이 로그아웃된다는 내부 구성원의 요청이 있었습니다. 토큰은 만료돼도 자동 갱신되지 않았고, Next.js 어드민은 탭마다 토큰을 따로 들고 있어 다른 탭이 옛 토큰으로 요청했으며, 웰로·웰로비즈 어드민은 같은 이름의 쿠키가 서로 덮어써졌습니다.',
								highlights: ['자동 갱신되지 않았고', '서로 덮어써졌습니다'],
							},
							{
								title:
									'요청이 거절(401)되면 토큰을 갱신해 다시 보내도록 Next.js·Vue 어드민에 구현했습니다. 갱신용 토큰은 한 번 쓰면 무효가 돼 동시에 거절된 요청이 각자 갱신하면 첫 요청만 성공하고 나머지는 로그아웃되므로, 갱신은 한 번만 하고 나머지는 그 결과를 기다리게 했습니다. Next.js 어드민은 쿠키의 토큰이 요청과 다르면 다른 탭이 갱신한 것으로 보고 그 토큰으로 재시도하며, 쿠키는 접속 도메인별로 분리했습니다.',
								highlights: ['첫 요청만 성공하고 나머지는 로그아웃', '갱신은 한 번만 하고 나머지는 그 결과를 기다리게'],
							},
							{
								title:
									'탭 로그아웃과 쿠키 덮어쓰기가 해소돼 웰로·웰로비즈 어드민 모두에 적용했고, 이후 같은 요청은 없었습니다.',
								highlights: ['해소돼', '같은 요청은 없었습니다'],
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
									'서비스 개발에 앞서 사용자 웹용 Webpack 5(local·dev·qa·prod 환경별 빌드와 S3 배포 스크립트, React.lazy로 16개 라우트 분할)와 CMS용 Vite 보일러플레이트, 두 앱이 함께 쓰는 CMS UI 패키지를 구축하고, 이를 적용해 인증·대시보드·사업지원 관리 화면을 구현했습니다. Unity 자산을 환경별 S3 경로에서 받아 빌드에 포함하고, 웹 로그인 토큰을 쿠키로 공유해 가상 오피스 진입 페이지가 인증하도록 연결했습니다.',
								highlights: [
									'보일러플레이트, 두 앱이 함께 쓰는 CMS UI 패키지',
									'쿠키로 공유해 가상 오피스 진입 페이지가 인증하도록 연결',
								],
							},
							{
								title:
									'인증 같은 횡단 관심사를 한 파일에 모으고 폴더 구조와 UI 라이브러리를 맞춘 Webpack 사용자 웹과 Vite CMS를 둘이서 단독 개발해, 인증부터 가상 오피스 진입까지 연결했습니다.',
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
