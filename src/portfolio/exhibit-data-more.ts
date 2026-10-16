import type { Exhibit, ServiceScreen } from './exhibits';

const AITALKER_HOME_PC: ServiceScreen = {
	src: '/portfolio/aitalker-home-pc-20261012.jpg',
	width: 1440,
	height: 900,
	alt: 'AI Talker(143AI) 공개 소개 페이지. 검색 대신 대화하세요 문구와 데모 신청, 소개자료 버튼이 보입니다.',
	device: 'desktop',
	kind: 'public-live',
	caption:
		'AI Talker(143AI) 공개 소개 페이지, 2026-10-12 촬영. 고객사 챗봇·CMS 화면이 아니며 작업 당시 화면과 다를 수 있습니다.',
};

/**
 * 이력서의 나머지 프로젝트 전시. 문장은 이력서 본문에 있는 사실만 옮기고, 수치를 새로 만들지 않는다.
 * 공개 화면이 없는 사례는 reconstructionNote 로 "구조를 다시 그린 도식"임을 밝힌다.
 */
export const MORE_EXHIBITS: Exhibit[] = [
	{
		slug: 'donation-duplicate-guard',
		shortTitle: '중복 기부 재확인',
		headline: '외부에서 납부해도 중복 기부는 서버 기준으로 재확인한다',
		variantLabels: { before: '외부 납부 후 상태 불명', after: '정산·이력 재조회로 재확인' },
		beforeKind: 'historical',
		layerLabels: ['사용자 화면', 'Wello 서버', '외부 납부 화면'],
		nodes: [
			{ id: 'apply', label: '기부 신청', layer: 0, col: 0 },
			{ id: 'block', label: '재확인 후 선택', layer: 0, col: 1 },
			{ id: 'backup', label: '납부 식별값 저장', layer: 0, col: 2 },
			{ id: 'guide', label: '지자체·금액 확인', layer: 0, col: 3 },
			{ id: 'settle', label: '이전 내역 정산', layer: 1, col: 0 },
			{ id: 'history', label: '완료 이력 재조회', layer: 1, col: 1 },
			{ id: 'check', label: '납부 식별값 조회', layer: 1, col: 2 },
			{ id: 'giro', label: '외부 지로 납부', layer: 2, col: 1 },
		],
		edges: {
			before: [['apply', 'giro']],
			after: [
				['apply', 'backup'],
				['backup', 'giro'],
				['giro', 'check'],
				['check', 'history'],
				['settle', 'history'],
				['history', 'block'],
				['block', 'guide'],
			],
		},
		states: {
			before: [
				{ apply: 'provisional' },
				{ apply: 'provisional', giro: 'waiting' },
				{ apply: 'waiting', giro: 'waiting' },
				{ apply: 'broken', giro: 'waiting' },
			],
			after: [
				{ apply: 'provisional', settle: 'confirmed' },
				{ apply: 'provisional', settle: 'confirmed', backup: 'confirmed', giro: 'waiting' },
				{ settle: 'confirmed', backup: 'confirmed', giro: 'confirmed', check: 'confirmed' },
				{ settle: 'confirmed', history: 'confirmed', check: 'confirmed', block: 'recovered', guide: 'confirmed' },
			],
		},
		phases: {
			before: [
				{ title: '신청', caption: '신청 뒤 외부 지로 화면에서 납부를 마쳐야 하는 구조였습니다.' },
				{ title: '이탈', caption: '앱·웹뷰를 벗어난 뒤에는 Wello가 진행 상태를 즉시 알기 어렵습니다.' },
				{ title: '반영 지연', caption: '납부 완료가 늦게 반영될 수 있습니다.' },
				{ title: '재시도', caption: '사용자가 같은 기부를 다시 시도할 수 있었습니다.' },
			],
			after: [
				{ title: '진입', caption: '페이지에 들어오면 이전 기부 내역을 정산합니다.' },
				{ title: '외부 이동', caption: '외부 납부로 이동하기 직전에 납부 식별값을 저장해 둡니다.' },
				{ title: '복귀', caption: '돌아오면 납부 식별값을 서버에 조회해 실제 완료 여부를 판별합니다.' },
				{
					title: '재확인 후 선택',
					caption:
						'결제 버튼을 누르면 정산 뒤 최신 완료 이력을 다시 조회하고, 있으면 지자체와 금액을 보여 주고 사용자가 확인한 뒤 진행 여부를 선택하게 합니다.',
				},
			],
		},
		ownedParts: [
			'페이지 진입 시 이전 기부 내역 정산',
			'결제 시점의 최신 완료 이력 재조회와 사용자 재확인',
			'외부 이동 직전의 납부 식별값 저장과 복귀 시 완료 여부 판별',
			'Wello 앱·KB·토스 웹뷰와 일반 웹의 복귀 흐름',
		],
		callouts: {
			role: '외부 납부 복귀 흐름과 중복 기부 재확인 로직을 구현했습니다.',
			problem:
				'앱·웹뷰를 벗어난 뒤에는 진행 상태를 즉시 알기 어렵고, 납부 완료 반영이 늦으면 같은 기부를 다시 시도할 수 있었습니다.',
			decision:
				'페이지 진입 시 정산하고 결제 시점에 최신 완료 이력을 다시 조회해 사용자가 확인하고 선택하게 했습니다. 이동 직전에 납부 식별값을 저장해 두고 돌아오면 서버에 조회했습니다.',
			outcome:
				'외부 납부 화면을 거쳐도 최신 완료 이력을 기준으로 중복 여부를 확인하게 해 중복 기부 관련 CS 재문의가 70% 감소했습니다.',
			outcomeBasis: '이력서 기재 내용. 문의 건수를 이 페이지에서 측정한 값이 아닙니다.',
		},
		screens: {},
		reconstructionNote:
			'외부 납부 흐름은 로그인이 필요해 공개 캡처가 없어 구조를 다시 그린 도식입니다. 실제 화면이 아닙니다.',
	},
	{
		slug: 'mydata-integration',
		shortTitle: '마이데이터',
		headline: '긴 규제성 흐름을 하나의 사용자 여정으로',
		variantLabels: { before: '', after: '인증부터 철회까지 한 흐름' },
		beforeKind: 'none',
		layerLabels: ['사용자 화면', '연동 상태', '기관 절차'],
		nodes: [
			{ id: 'verify', label: '본인인증', layer: 0, col: 0 },
			{ id: 'terms', label: '약관 동의', layer: 0, col: 1 },
			{ id: 'sign', label: '전송요구·전자서명', layer: 0, col: 2 },
			{ id: 'manage', label: '연결 관리', layer: 0, col: 3 },
			{ id: 'sdk', label: '인증 SDK 훅', layer: 1, col: 0 },
			{ id: 'session', label: '단계별 중간값 저장', layer: 1, col: 1 },
			{ id: 'guard', label: '분야별 접근 차단', layer: 1, col: 3 },
			{ id: 'nexbe', label: '외부 본인인증 SDK', layer: 2, col: 0 },
			{ id: 'agency', label: '기관 절차(KHIS·KOSCOM·NICE)', layer: 2, col: 2 },
		],
		edges: {
			before: [],
			after: [
				['verify', 'sdk'],
				['sdk', 'nexbe'],
				['verify', 'terms'],
				['terms', 'session'],
				['terms', 'sign'],
				['sign', 'agency'],
				['sign', 'manage'],
				['manage', 'guard'],
				['manage', 'agency'],
			],
		},
		states: {
			before: [],
			after: [
				{ verify: 'confirmed', sdk: 'confirmed', nexbe: 'confirmed' },
				{ verify: 'confirmed', terms: 'confirmed', session: 'confirmed', sign: 'confirmed', agency: 'waiting' },
				{ sign: 'confirmed', session: 'confirmed', agency: 'confirmed', manage: 'confirmed', guard: 'confirmed' },
				{ manage: 'recovered', guard: 'confirmed', agency: 'broken' },
			],
		},
		phases: {
			before: [],
			after: [
				{ title: '본인인증', caption: '본인인증 SDK의 스크립트 로딩과 콜백 순서를 커스텀 훅으로 감쌉니다.' },
				{
					title: '동의·전송요구',
					caption: '약관 동의부터 전송요구·전자서명까지 연동 중간값을 세션 스토리지에 단계별로 저장하고 정리합니다.',
				},
				{
					title: '연결 관리',
					caption: '분야별 상세·재동의·개별·일괄 철회·전송 이력을 구현하고, 연동하지 않은 분야는 직접 접근을 막습니다.',
				},
				{
					title: '일부 실패',
					caption: '일괄 철회는 기관 요청을 병렬로 처리하고, 실패한 항목만 안내해 나머지 처리는 유지합니다.',
				},
			],
		},
		ownedParts: [
			'본인인증 SDK 로딩·콜백 순서를 감싼 커스텀 훅',
			'기관별 인증·동의·전송요구·전자서명 화면',
			'세션 스토리지 기반 단계별 중간값 저장·정리',
			'연결 관리: 재동의·개별·일괄 철회·전송 이력',
		],
		callouts: {
			role: '본인인증부터 연동, 연결 상태 확인, 재동의, 철회, 전송 이력까지 전체 흐름을 구축했습니다.',
			problem:
				'서로 다른 기관 절차를 하나의 사용자 여정으로 연결해야 했고, 긴 규제성 흐름이 새로고침과 외부 인증 이후에도 이어져야 했습니다.',
			decision:
				'SDK 로딩·콜백 순서를 훅으로 감싸고 연동 중간값을 세션 스토리지에 단계별로 저장·정리했습니다. 일괄 철회는 병렬로 처리하고 실패한 항목만 안내했습니다.',
			outcome: '의료·통신·신용 연동부터 철회와 전송 이력까지 전체 흐름을 구축했습니다.',
			outcomeBasis: '이력서 기재 내용. 이 페이지에서 측정한 값이 아닙니다.',
		},
		screens: {},
		reconstructionNote:
			'마이데이터 화면은 로그인과 본인인증이 필요해 공개 캡처가 없어 흐름을 다시 그린 도식입니다. 실제 화면이 아닙니다.',
	},
	{
		slug: 'admin-session-refresh',
		shortTitle: '어드민 세션',
		headline: '토큰이 만료돼도 갱신은 한 번만',
		variantLabels: { before: '자동 갱신 없음', after: '갱신 한 번·결과 공유' },
		beforeKind: 'historical',
		layerLabels: ['어드민 화면', '401 복구', '토큰 갱신'],
		nodes: [
			{ id: 'req', label: '동시 API 요청', layer: 0, col: 0 },
			{ id: 'recover', label: '401 복구 (갱신 후 재시도)', labelBefore: '401 처리 없음', layer: 1, col: 0 },
			{ id: 'share', label: '진행 중인 refresh 공유', layer: 1, col: 1 },
			{ id: 'cookie', label: '쿠키 토큰 비교', layer: 1, col: 2 },
			{ id: 'refresh', label: 'refresh API', layer: 2, col: 0 },
			{ id: 'relogin', label: '직접 다시 로그인', layer: 2, col: 3 },
		],
		edges: {
			before: [
				['req', 'recover'],
				['recover', 'relogin'],
			],
			after: [
				['req', 'recover'],
				['recover', 'share'],
				['recover', 'cookie'],
				['share', 'refresh'],
			],
		},
		states: {
			before: [
				{ req: 'waiting' },
				{ req: 'broken', recover: 'waiting' },
				{ req: 'broken', recover: 'broken' },
				{ req: 'broken', recover: 'broken', relogin: 'broken' },
			],
			after: [
				{ req: 'waiting', recover: 'confirmed' },
				{ recover: 'confirmed', share: 'confirmed', refresh: 'waiting' },
				{ recover: 'confirmed', cookie: 'confirmed' },
				{ req: 'recovered', recover: 'confirmed', share: 'confirmed', cookie: 'confirmed', refresh: 'confirmed' },
			],
		},
		phases: {
			before: [
				{ title: '동시 요청', caption: '어드민 한 화면이 API를 여러 개 동시에 부르는 중에 토큰이 만료됩니다.' },
				{ title: '401', caption: '요청이 한꺼번에 401 응답을 받습니다.' },
				{ title: '복구 수단 없음', caption: '토큰을 자동으로 갱신하는 처리가 없어 요청을 이어 갈 수 없습니다.' },
				{ title: '다시 로그인', caption: '운영자가 직접 다시 로그인해야 했습니다.' },
			],
			after: [
				{ title: '401 복구', caption: '401 응답을 받으면 복구 로직이 갱신 후 재시도 절차를 시작합니다.' },
				{
					title: '갱신은 한 번',
					caption:
						'갱신용 토큰은 한 번 쓰면 무효가 되므로, 진행 중인 갱신 Promise를 공유해 첫 요청만 refresh를 호출하고 나머지는 같은 결과를 기다립니다.',
				},
				{
					title: '쿠키 토큰 비교',
					caption:
						'Next.js 어드민은 실패한 요청의 토큰과 쿠키 토큰이 다르면 다른 탭·프레임이 이미 갱신한 것으로 보고 refresh 없이 쿠키의 토큰으로 재시도합니다.',
				},
				{ title: '재시도', caption: '새 토큰으로 요청을 다시 보내고, 갱신에 실패했을 때만 만료 처리로 넘어갑니다.' },
			],
		},
		ownedParts: [
			'Next.js·Vue 어드민의 401 → 갱신 → 재시도',
			'진행 중인 refresh Promise 공유',
			'쿠키 토큰 비교(다른 탭·프레임이 먼저 갱신한 경우)',
			'logout 요청을 복구 대상에서 제외',
			'웰로·웰로비즈 도메인별 쿠키 분리(기존 상위 도메인 쿠키는 옮기고 삭제)',
		],
		callouts: {
			role: 'Next.js 어드민과 Vue 어드민의 토큰 만료 대응과 로그인 쿠키 분리를 구현했습니다.',
			problem:
				'탭을 2개 열고 작업하면 한쪽이 로그아웃된다는 내부 구성원의 요청이 있었습니다. 토큰은 만료돼도 자동 갱신되지 않았고, Next.js 어드민은 탭마다 토큰을 따로 들고 있어 다른 탭이 옛 토큰으로 요청했으며, 웰로·웰로비즈 어드민은 같은 이름의 쿠키가 서로 덮어써졌습니다.',
			decision:
				'요청이 거절(401)되면 토큰을 갱신해 다시 보내도록 Next.js·Vue 어드민에 구현했습니다. 갱신용 토큰은 한 번 쓰면 무효가 돼 동시에 거절된 요청이 각자 갱신하면 첫 요청만 성공하고 나머지는 로그아웃되므로, 갱신은 한 번만 하고 나머지는 그 결과를 기다리게 했습니다. Next.js 어드민은 쿠키의 토큰이 요청과 다르면 다른 탭이 갱신한 것으로 보고 그 토큰으로 재시도하며, 쿠키는 접속 도메인별로 분리했습니다.',
			outcome:
				'탭 로그아웃과 쿠키 덮어쓰기가 해소돼 웰로·웰로비즈 어드민 모두에 적용했고, 이후 같은 요청은 없었습니다.',
			outcomeBasis: '이력서 기재 내용. 이 페이지에서 측정한 값이 아닙니다.',
		},
		screens: {},
		reconstructionNote: '어드민은 로그인이 필요해 공개 캡처가 없어 흐름을 다시 그린 도식입니다. 실제 화면이 아닙니다.',
	},
	{
		slug: 'ai-chatbot-cms',
		shortTitle: 'AI 챗봇·CMS',
		headline: '답변은 이어서 나오고, 읽던 자리는 그대로',
		variantLabels: { before: '', after: '스트림 응답과 위치 유지' },
		beforeKind: 'none',
		layerLabels: ['사용자 챗봇', '스트림·상태', 'OpenAI·운영 CMS'],
		nodes: [
			{ id: 'chat', label: '대화 화면', layer: 0, col: 0 },
			{ id: 'history', label: '이전 대화 불러오기', layer: 0, col: 1 },
			{ id: 'ad', label: '무료 플랜 광고', layer: 0, col: 3 },
			{ id: 'stream', label: '스트림 응답 처리', layer: 1, col: 0 },
			{ id: 'scroll', label: '스크롤 위치 보정', layer: 1, col: 1 },
			{ id: 'plan', label: '응답 횟수 정책', layer: 1, col: 3 },
			{ id: 'openai', label: 'OpenAI Assistants', layer: 2, col: 0 },
			{ id: 'kb', label: '파일·벡터 스토어', layer: 2, col: 1 },
			{ id: 'cms', label: '운영 CMS', layer: 2, col: 2 },
		],
		edges: {
			before: [],
			after: [
				['chat', 'stream'],
				['stream', 'openai'],
				['history', 'scroll'],
				['scroll', 'chat'],
				['cms', 'kb'],
				['kb', 'openai'],
				['stream', 'plan'],
				['plan', 'ad'],
			],
		},
		states: {
			before: [],
			after: [
				{ chat: 'provisional', stream: 'confirmed' },
				{ chat: 'confirmed', stream: 'confirmed', openai: 'confirmed' },
				{ chat: 'confirmed', history: 'confirmed', scroll: 'confirmed' },
				{ cms: 'confirmed', kb: 'confirmed', openai: 'confirmed', plan: 'confirmed', ad: 'confirmed' },
			],
		},
		phases: {
			before: [],
			after: [
				{
					title: '질문',
					caption: '답변 생성 시간을 빈 화면으로 기다리지 않도록 스트림 처리·응답 상태 관리 패턴을 적용합니다.',
				},
				{ title: '순차 반영', caption: 'OpenAI Assistants의 답변을 대화 화면에 순차로 반영합니다.' },
				{
					title: '이전 대화',
					caption: '이전 대화를 불러올 때 추가된 높이만큼 스크롤 위치를 보정해 읽던 지점을 유지합니다.',
				},
				{
					title: '운영',
					caption:
						'CMS에서 지식 파일·프롬프트·모델 설정과 방문·대화·비용 통계를 관리하고, 무료 플랜에는 응답 횟수 기준 광고를 노출합니다.',
				},
			],
		},
		ownedParts: [
			'OpenAI Assistants 답변의 스트림 처리와 응답 상태 관리',
			'이전 대화 로딩 시 스크롤 위치 보정',
			'CMS: 파일·벡터 스토어, 프롬프트·모델 설정, 콘텐츠 생성',
			'방문·대화·비용 통계와 무료 플랜 광고 정책 연결',
		],
		callouts: {
			role: '고객사용 AI 챗봇 사용자 서비스와 운영자용 CMS의 프론트엔드를 구축했습니다.',
			problem:
				'답변 생성 시간을 빈 화면으로 기다리지 않게 하고, 긴 대화 이력을 불러와도 읽던 위치를 유지해야 했습니다.',
			decision:
				'스트림 처리 패턴으로 답변을 순차 반영하고, 이전 대화를 불러올 때 추가된 높이만큼 스크롤 위치를 보정했습니다.',
			outcome: '고객사가 지식 파일과 응답 설정을 직접 관리하게 했고, 사용자 서비스와 CMS를 실제 운영했습니다.',
			outcomeBasis: '이력서 기재 내용. 이력서에 정량 결과는 적혀 있지 않습니다.',
		},
		screens: {},
		identity: AITALKER_HOME_PC,
		reconstructionNote: '고객사 서비스 화면은 공개할 수 없어 구조를 다시 그린 도식입니다. 실제 화면이 아닙니다.',
	},
	{
		slug: 'ai-chatbot-ssr',
		shortTitle: 'SSR 전환',
		headline: '고객사별 정보는 서버가 메타데이터로 내보낸다',
		variantLabels: { before: 'CSR: 정보 전달이 어려움', after: 'SSR: 서버가 메타데이터 생성' },
		beforeKind: 'historical',
		layerLabels: ['검색 엔진·링크 미리보기', 'Next.js 서버', '운영 데이터'],
		nodes: [
			{ id: 'bot', label: '검색 엔진·링크 미리보기', layer: 0, col: 0 },
			{ id: 'page', label: '고객사별 챗봇 화면', layer: 0, col: 2 },
			{ id: 'meta', label: '메타데이터·Open Graph', labelBefore: '코드에 직접 반영', layer: 1, col: 1 },
			{ id: 'sitemap', label: '사이트맵', layer: 1, col: 2 },
			{ id: 'tenant', label: '고객사 설정', layer: 2, col: 1 },
			{ id: 'list', label: '고객사 코드 목록 API', layer: 2, col: 2 },
		],
		edges: {
			before: [
				['bot', 'page'],
				['page', 'meta'],
			],
			after: [
				['bot', 'page'],
				['page', 'meta'],
				['meta', 'tenant'],
				['bot', 'sitemap'],
				['sitemap', 'list'],
			],
		},
		states: {
			before: [
				{ bot: 'provisional', page: 'provisional' },
				{ bot: 'broken', page: 'provisional' },
				{ bot: 'broken', page: 'provisional', meta: 'broken' },
				{ bot: 'broken', page: 'provisional', meta: 'broken' },
			],
			after: [
				{ bot: 'provisional', page: 'confirmed' },
				{ bot: 'provisional', page: 'confirmed', meta: 'confirmed', tenant: 'confirmed' },
				{ bot: 'provisional', page: 'confirmed', meta: 'confirmed', sitemap: 'confirmed', list: 'confirmed' },
				{
					bot: 'confirmed',
					page: 'confirmed',
					meta: 'confirmed',
					tenant: 'recovered',
					sitemap: 'confirmed',
					list: 'confirmed',
				},
			],
		},
		phases: {
			before: [
				{ title: '고객사별 챗봇', caption: '고객사마다 브랜드와 언어가 다른 챗봇을 React CSR로 제공했습니다.' },
				{ title: '크롤링', caption: '검색 엔진과 링크 미리보기에 고객사별 정보를 안정적으로 전달하기 어려웠습니다.' },
				{
					title: '신규 고객사',
					caption: '신규 고객사가 추가될 때마다 메타데이터와 검색 노출 경로를 코드에 직접 반영해야 했습니다.',
				},
				{ title: '확장', caption: '고객사가 늘수록 코드에 반영하는 방식은 확장에 불리했습니다.' },
			],
			after: [
				{ title: '전환', caption: '사용자 서비스를 Next.js 15 App Router로 전환합니다.' },
				{ title: '메타데이터', caption: '고객사 코드로 조회한 설정을 서버에서 메타데이터·Open Graph에 반영합니다.' },
				{ title: '사이트맵', caption: '고객사 코드 목록 API를 기준으로 사이트맵을 생성합니다.' },
				{
					title: '운영',
					caption: '제목·설명·다국어 Open Graph를 운영 데이터로 관리해 배포 없이 바꾸고 신규 고객사를 추가합니다.',
				},
			],
		},
		ownedParts: [
			'React CSR → Next.js 15 App Router 전환',
			'고객사 코드 기반 메타데이터·Open Graph 서버 반영',
			'고객사 코드 목록 API 기반 사이트맵 생성',
		],
		callouts: {
			role: '고객사별 챗봇 사용자 서비스를 Next.js 15 SSR로 전환했습니다.',
			problem:
				'CSR 구조에서는 검색 엔진과 링크 미리보기에 고객사별 정보를 안정적으로 전달하기 어렵고, 신규 고객사마다 코드를 고쳐야 했습니다.',
			decision:
				'고객사 코드로 조회한 설정을 서버에서 메타데이터·Open Graph에 반영하고, 사이트맵도 고객사 코드 목록 API 기준으로 생성했습니다.',
			outcome: '프론트엔드 배포 없이 검색 노출 정보를 바꾸고 신규 고객사를 추가할 수 있는 구조로 전환했습니다.',
			outcomeBasis: '이력서 기재 내용. 검색 노출 수치는 이력서에 적혀 있지 않습니다.',
		},
		screens: {},
		identity: AITALKER_HOME_PC,
		reconstructionNote: '고객사 서비스 화면은 공개할 수 없어 구조를 다시 그린 도식입니다. 실제 화면이 아닙니다.',
	},
	{
		slug: 'swing-frontend',
		shortTitle: 'Swing',
		headline: '2인 팀에서 프론트엔드 전 영역을 구축',
		variantLabels: { before: '', after: '인증부터 가상 오피스 진입까지' },
		beforeKind: 'none',
		layerLabels: ['사용자 웹·CMS', '공통 기반', 'Unity WebGL'],
		nodes: [
			{ id: 'web', label: '사용자 웹', layer: 0, col: 0 },
			{ id: 'cms', label: '관리자 CMS', layer: 0, col: 1 },
			{ id: 'office', label: '가상 오피스 진입', layer: 0, col: 3 },
			{ id: 'boiler', label: 'Webpack 5 · Vite 보일러플레이트', layer: 1, col: 0 },
			{ id: 'ui', label: 'CMS UI 패키지', layer: 1, col: 1 },
			{ id: 'token', label: '웹 토큰 연결', layer: 1, col: 3 },
			{ id: 's3', label: '환경별 S3 경로', layer: 2, col: 2 },
			{ id: 'unity', label: 'Unity WebGL 자산', layer: 2, col: 3 },
		],
		edges: {
			before: [],
			after: [
				['boiler', 'web'],
				['boiler', 'cms'],
				['ui', 'cms'],
				['web', 'token'],
				['token', 'office'],
				['s3', 'unity'],
				['unity', 'office'],
			],
		},
		states: {
			before: [],
			after: [
				{ boiler: 'confirmed', ui: 'confirmed' },
				{ boiler: 'confirmed', ui: 'confirmed', web: 'confirmed', cms: 'confirmed' },
				{ web: 'confirmed', cms: 'confirmed', s3: 'confirmed', unity: 'confirmed' },
				{ web: 'confirmed', token: 'confirmed', unity: 'confirmed', office: 'recovered' },
			],
		},
		phases: {
			before: [],
			after: [
				{
					title: '공통 기반',
					caption: '서비스 개발에 앞서 사용자 웹용 Webpack 5, CMS용 Vite 보일러플레이트와 CMS UI 패키지를 구축합니다.',
				},
				{ title: '화면', caption: '공통 기반을 적용해 인증·대시보드·사업지원 관리 화면을 구현합니다.' },
				{ title: 'WebGL 자산', caption: 'Unity 자산을 환경별 S3 경로에서 받아 빌드에 포함합니다.' },
				{
					title: '진입',
					caption: '웹 토큰을 가상 오피스 진입 과정에 연결해 인증부터 진입까지 하나의 흐름으로 완성합니다.',
				},
			],
		},
		ownedParts: [
			'사용자 웹(Webpack 5)·CMS(Vite) 보일러플레이트',
			'CMS UI 패키지',
			'인증·대시보드·사업지원 관리 화면',
			'Unity 자산 S3 경로 연동과 웹 토큰 연결',
		],
		callouts: {
			role: '백엔드 개발자 1명과 2인 팀에서 사용자 웹, 관리자 CMS, WebGL 진입·인증 연결까지 프론트엔드 전 영역을 맡았습니다.',
			problem:
				'업무 지원 기능과 Unity WebGL 가상 오피스를 함께 제공하는 신규 서비스를 2인 팀이 처음부터 만들어야 했습니다.',
			decision:
				'서비스 개발에 앞서 공통 보일러플레이트와 CMS UI 패키지를 먼저 만들고, 두 앱에 같은 방식으로 적용했습니다.',
			outcome: '인증부터 업무 지원 관리와 가상 오피스 진입까지 하나의 서비스 흐름으로 완성했습니다.',
			outcomeBasis: '이력서 기재 내용. 이력서에 정량 결과는 적혀 있지 않습니다.',
		},
		screens: {},
		reconstructionNote: '서비스 화면은 공개 캡처가 없어 구조를 다시 그린 도식입니다. 실제 화면이 아닙니다.',
	},
];
