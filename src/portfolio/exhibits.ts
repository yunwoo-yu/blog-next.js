/**
 * 사례별 "전시" 데이터. 화면 이미지·시스템 구조 도식·역할/문제/결정/결과 문구를 담는다.
 * 사실(기간·문제·결과 수치)은 이력서에 있는 것만 옮기고, 이력서에 없는 수치는 만들지 않는다.
 * 도식의 단계 간 변화는 개념 설명용 연출이며 실제 측정값이 아니다.
 */

import { MORE_EXHIBITS } from './exhibit-data-more';

export const VARIANTS = ['before', 'after'] as const;
export type Variant = (typeof VARIANTS)[number];

export const PHASE_COUNT = 4;
export const LAST_PHASE = PHASE_COUNT - 1;
export type PhaseIndex = 0 | 1 | 2 | 3;

export const clampPhase = (value: number): PhaseIndex => {
	if (!Number.isFinite(value)) return 0;
	return Math.min(LAST_PHASE, Math.max(0, Math.trunc(value))) as PhaseIndex;
};

/** 도식 노드의 상태. 색에만 기대지 않도록 화면에서는 기호와 텍스트도 함께 쓴다. */
export type NodeState = 'idle' | 'provisional' | 'confirmed' | 'broken' | 'waiting' | 'recovered';

export const NODE_STATE_LABELS: Record<NodeState, string> = {
	idle: '사용 안 함',
	provisional: '임시·화면 계산',
	confirmed: '확정',
	broken: '문제 발생',
	waiting: '대기',
	recovered: '복구',
};

export const NODE_STATE_GLYPHS: Record<NodeState, string> = {
	idle: '',
	provisional: '~',
	confirmed: '✓',
	broken: '✕',
	waiting: '…',
	recovered: '↺',
};

export interface FlowNode {
	id: string;
	label: string;
	/** 개선 전에 다른 이름으로 불러야 하는 노드의 이름 */
	labelBefore?: string;
	/** 0 화면 · 1 서버·로직 · 2 외부·데이터 */
	layer: 0 | 1 | 2;
	col: 0 | 1 | 2 | 3;
}

export type NodeStates = Record<string, NodeState>;

export interface PhaseCopy {
	title: string;
	/** 이 단계에서 일어나는 일 한두 문장 */
	caption: string;
}

export type ScreenKind = 'public-live';

export interface ServiceScreen {
	src: string;
	width: number;
	height: number;
	alt: string;
	device: 'desktop' | 'mobile';
	kind: ScreenKind;
	/** 화면에 붙는 출처·날짜 설명. 내가 만든 당시 화면이라고 주장하지 않는다. */
	caption: string;
}

export interface ExhibitCallouts {
	/** 내가 맡은 부분 */
	role: string;
	problem: string;
	decision: string;
	outcome: string;
	/** 결과 문구의 근거 구분 */
	outcomeBasis: string;
}

export interface Exhibit {
	slug: string;
	/** 전시 선택 버튼에 쓰는 짧은 이름 */
	shortTitle: string;
	/** 큰 타이포로 보이는 한 줄 */
	headline: string;
	variantLabels: Record<Variant, string>;
	/**
	 * historical: 실제로 있던 상태 / scenario: 위험을 설명하기 위한 가상 비교(과거 사고를 주장하지 않는다) /
	 * none: 새로 만든 기능이라 "개선 전"이 없다. 이때 before 쪽 배열은 비워 두고 화면은 개선 후만 보여 준다.
	 */
	beforeKind: 'historical' | 'scenario' | 'none';
	/** 3D·도식 계층 이름 (분해 보기에서 보인다) */
	layerLabels: [string, string, string];
	nodes: FlowNode[];
	edges: Record<Variant, [string, string][]>;
	states: Record<Variant, NodeStates[]>;
	phases: Record<Variant, PhaseCopy[]>;
	ownedParts: string[];
	callouts: ExhibitCallouts;
	/** 전·후 화면 쌍. 공개된 캡처가 있는 쪽만 채운다. */
	screens: Partial<Record<Variant, ServiceScreen>>;
	/** 해당 서비스의 공개 화면(주문·결제 같은 사례 화면이 아닌 서비스 정체성용). */
	identity?: ServiceScreen;
	/** 모바일 공개 화면 */
	mobile?: ServiceScreen;
	/** 사례 상세에서 더 보여 주는 공개 화면들. 사례 화면이 아니라 서비스 맥락을 보여 준다. */
	gallery?: ServiceScreen[];
	/** 실제 화면이 없을 때 도식 화면에 붙이는 안내 */
	reconstructionNote?: string;
}

const PHASE_LABELS = ['1', '2', '3', '4'];
export const getPhaseLabel = (phase: number) => PHASE_LABELS[clampPhase(phase)];

const WELLO_MARKET_PC: ServiceScreen = {
	src: '/portfolio/wello-market-pc-20261007.jpg',
	width: 1440,
	height: 900,
	alt: '웰마켙 공개 홈 화면. 상단 내비게이션과 기부 배너, 지역 상품 카드가 보입니다.',
	device: 'desktop',
	kind: 'public-live',
	caption: '웰마켙 공개 홈',
};

const WELLO_SEARCH_PC: ServiceScreen = {
	src: '/portfolio/wello-search-pc-20261007.jpg',
	width: 1440,
	height: 900,
	alt: 'Wello 통합검색 PC 화면. 검색창과 카테고리 선택, 아티클 결과 목록이 보입니다.',
	device: 'desktop',
	kind: 'public-live',
	caption: 'Wello 공개 통합검색',
};

const WELLO_HOME_MOBILE: ServiceScreen = {
	src: '/portfolio/wello-home-mobile-20261007.jpg',
	width: 390,
	height: 844,
	alt: 'Wello 홈 모바일 화면. 상단 검색·알림 아이콘과 서비스 바로가기, 정책 카드가 보입니다.',
	device: 'mobile',
	kind: 'public-live',
	caption: 'Wello 공개 모바일 홈.',
};

const WELLO_HOME_PC: ServiceScreen = {
	src: '/portfolio/wello-home-pc-20261012.jpg',
	width: 1440,
	height: 900,
	alt: 'Wello 홈 PC 화면. 왼쪽 내비게이션 아래 서비스 바로가기 아이콘과 피드, 오른쪽 안내 영역의 3단 레이아웃이 보입니다.',
	device: 'desktop',
	kind: 'public-live',
	caption: 'Wello 공개 홈 PC 화면',
};

const WELLO_SEARCH_MOBILE: ServiceScreen = {
	src: '/portfolio/wello-search-mobile-20261012.jpg',
	width: 390,
	height: 844,
	alt: 'Wello 통합검색 모바일 화면. 검색창 오른쪽에 필터 아이콘이 있고 아래에 아티클 결과 목록이 보입니다.',
	device: 'mobile',
	kind: 'public-live',
	caption: 'Wello 공개 통합검색 모바일 화면. 필터는 PC 사이드바 대신 드로어로 열립니다.',
};

const WELLO_MARKET_LIST_PC: ServiceScreen = {
	src: '/portfolio/wello-market-list-pc-20261012.jpg',
	width: 1440,
	height: 900,
	alt: '웰마켙 PC 상품 목록 화면. 기부 안내 배너와 지역 상품 카드가 보입니다.',
	device: 'desktop',
	kind: 'public-live',
	caption: '웰마켙 공개 상품 목록',
};

const WELLO_MARKET_PRODUCT_PC: ServiceScreen = {
	src: '/portfolio/wello-market-product-pc-20261012.jpg',
	width: 1440,
	height: 900,
	alt: '웰마켙 상품 상세 PC 화면. 상품명, 가격, 웰포인트 적립 혜택, 배송비와 옵션 선택이 보입니다.',
	device: 'desktop',
	kind: 'public-live',
	caption:
		'웰마켙 공개 상품 상세. 웰포인트 혜택이 결제 금액에 더해지는 지점입니다. 결제 화면은 로그인이 필요해 싣지 않았습니다.',
};

const WELLO_MARKET_MOBILE: ServiceScreen = {
	src: '/portfolio/wello-market-mobile-20261012.jpg',
	width: 390,
	height: 844,
	alt: '웰마켙 모바일 홈 화면. 상단 장바구니 아이콘, 기부 안내 배너와 상품 이미지, 하단 탭 바가 보입니다.',
	device: 'mobile',
	kind: 'public-live',
	caption: '웰마켙 공개 모바일 홈.',
};

const CORE_EXHIBITS: Exhibit[] = [
	{
		slug: 'wellomarket-checkout',
		shortTitle: '주문·결제',
		headline: '결제부터 배송·리뷰, 어드민까지',
		variantLabels: { before: '화면이 금액을 정하면', after: '서버가 금액을 확정' },
		beforeKind: 'scenario',
		layerLabels: ['사용자 화면', '서버·주문 상태', '결제사'],
		nodes: [
			{ id: 'cart', label: '주문서', layer: 0, col: 0 },
			{ id: 'calc', label: '화면 금액 계산', layer: 0, col: 1 },
			{ id: 'user', label: '배송조회·리뷰', layer: 0, col: 3 },
			{ id: 'benefit', label: '쿠폰·웰포인트', layer: 1, col: 0 },
			{ id: 'api', label: '체크아웃 API', layer: 1, col: 1 },
			{ id: 'order', label: '주문 상태', layer: 1, col: 2 },
			{ id: 'admin', label: '입점업체 어드민', layer: 1, col: 3 },
			{ id: 'pg', label: '결제사', layer: 2, col: 1 },
		],
		edges: {
			before: [
				['cart', 'calc'],
				['cart', 'benefit'],
				['calc', 'pg'],
			],
			after: [
				['cart', 'benefit'],
				['benefit', 'api'],
				['api', 'pg'],
				['api', 'order'],
				['order', 'admin'],
				['order', 'user'],
			],
		},
		states: {
			before: [
				{ cart: 'provisional', calc: 'provisional', benefit: 'provisional' },
				{ cart: 'provisional', calc: 'provisional', benefit: 'provisional' },
				{ cart: 'provisional', calc: 'provisional', benefit: 'provisional', pg: 'broken' },
				{ calc: 'provisional', pg: 'broken' },
			],
			after: [
				{ cart: 'provisional', benefit: 'provisional' },
				{ cart: 'provisional', benefit: 'provisional', api: 'confirmed' },
				{ cart: 'provisional', benefit: 'provisional', api: 'confirmed', pg: 'confirmed' },
				{ api: 'confirmed', pg: 'confirmed', order: 'confirmed', admin: 'confirmed', user: 'confirmed' },
			],
		},
		phases: {
			before: [
				{ title: '주문서', caption: '화면이 상품·배송비·쿠폰·웰포인트를 조합해 금액을 계산한다고 가정합니다.' },
				{ title: '금액 계산', caption: '서버 확정 없이 화면이 계산한 값이 결제 금액이 되는 경우를 가정합니다.' },
				{ title: '결제 승인', caption: '화면과 서버의 계산 결과가 다르면 PG 승인 금액 불일치로 이어질 수 있습니다.' },
				{ title: '주문 이후', caption: '불일치가 생기면 사용자는 다음 행동을 알기 어려울 수 있습니다.' },
			],
			after: [
				{ title: '주문서', caption: '쿠폰·포인트 사용 내역을 체크아웃 API에 전달합니다.' },
				{
					title: '금액 확정',
					caption: 'API가 최종 결제 금액을 확정하고, 결제 버튼을 누르면 한 번 더 호출해 재고와 쿠폰을 다시 검증합니다.',
				},
				{
					title: '결제 승인',
					caption: '서버가 확정한 금액만 결제사에 전달하고, 재고 오류와 인증 실패는 원인별 안내로 이어집니다.',
				},
				{
					title: '주문 상태',
					caption: '서버 주문 상태 하나로 구매 후 버튼을 정하고, 입점업체 어드민도 같은 상태를 봅니다.',
				},
			],
		},
		ownedParts: [
			'쿠폰·포인트 내역을 체크아웃 API로 전달하는 흐름',
			'서버가 확정한 금액만 결제사로 보내는 결제 연동과 결제 직전 재검증',
			'인증 실패·재고 오류의 원인별 안내와 장바구니 재선택 연결',
			'서버 주문 상태 기반 구매 후 버튼, 택배 연동사별 배송 조회, 리뷰 작성',
			'입점업체 어드민: 업체 목록·등록·상세, 반품 상태 패널, 역할별 접근, 개인정보 확인 모달',
		],
		callouts: {
			role: '결제부터 배송조회·배송완료·리뷰 작성까지 사용자 화면과 입점업체 어드민을 구축했습니다. 상품 상세·장바구니·주문내역은 포함하지 않습니다.',
			problem:
				'화면과 서버의 금액 계산이 다르면 PG 승인 금액이 어긋나고, 재고 소진·주문 만료·인증 실패에서도 다음 행동이 보여야 했습니다.',
			decision:
				'서버가 확정한 금액만 PG에 요청하도록 기준을 서버로 고정하고, 구매 후 버튼도 서버 상태 하나로 정했습니다.',
			outcome: '2026.03 오픈 후 1개월간 결제 금액 관련 CS 문의와 API 에러 로그가 0건이었습니다.',
			outcomeBasis: '이력서 기재 내용. 이 페이지에서 측정한 값이 아닙니다.',
		},
		screens: {},
		identity: WELLO_MARKET_PC,
		gallery: [WELLO_MARKET_LIST_PC, WELLO_MARKET_PRODUCT_PC, WELLO_MARKET_MOBILE],
		reconstructionNote: '주문서·결제 화면은 공개된 캡처가 없어 설명용으로 다시 그린 도식입니다. 실제 화면이 아닙니다.',
	},
	{
		slug: 'wello-responsive-search',
		shortTitle: '반응형·검색',
		headline: '검색 조건이 URL에 남는 통합검색',
		variantLabels: { before: '600px 고정폭', after: 'PC 레이아웃·통합검색' },
		beforeKind: 'historical',
		layerLabels: ['화면', '검색 상태', '콘텐츠'],
		nodes: [
			{ id: 'pc', label: 'PC 화면', labelBefore: '600px 고정폭', layer: 0, col: 0 },
			{ id: 'search', label: '통합검색', layer: 0, col: 1 },
			{ id: 'side', label: 'PC 체크박스', layer: 0, col: 2 },
			{ id: 'drawer', label: '모바일 칩', layer: 0, col: 3 },
			{ id: 'url', label: 'URL 쿼리', layer: 1, col: 1 },
			{ id: 'state', label: '공통 필터 상태', layer: 1, col: 2 },
			{ id: 'c1', label: '정책', layer: 2, col: 0 },
			{ id: 'c2', label: '답례품', layer: 2, col: 1 },
			{ id: 'c3', label: '동네소식', layer: 2, col: 2 },
			{ id: 'c4', label: '기부사업', layer: 2, col: 3 },
		],
		edges: {
			before: [],
			after: [
				['pc', 'search'],
				['search', 'url'],
				['url', 'state'],
				['state', 'side'],
				['state', 'drawer'],
				['search', 'c2'],
				['state', 'c3'],
			],
		},
		states: {
			before: [
				{ pc: 'broken', c1: 'provisional', c2: 'provisional', c3: 'provisional', c4: 'provisional' },
				{ pc: 'broken', c1: 'waiting', c2: 'waiting', c3: 'waiting', c4: 'waiting' },
				{ pc: 'broken', c1: 'waiting', c2: 'waiting', c3: 'waiting', c4: 'waiting' },
				{ pc: 'broken', c1: 'waiting', c2: 'waiting', c3: 'waiting', c4: 'waiting' },
			],
			after: [
				{ pc: 'confirmed' },
				{
					pc: 'confirmed',
					search: 'confirmed',
					url: 'confirmed',
					c1: 'provisional',
					c2: 'provisional',
					c3: 'provisional',
					c4: 'provisional',
				},
				{
					pc: 'confirmed',
					search: 'confirmed',
					url: 'confirmed',
					state: 'confirmed',
					side: 'confirmed',
					drawer: 'confirmed',
					c1: 'confirmed',
					c2: 'confirmed',
					c3: 'confirmed',
					c4: 'confirmed',
				},
				{
					search: 'confirmed',
					url: 'recovered',
					state: 'recovered',
					side: 'recovered',
					drawer: 'recovered',
					c1: 'confirmed',
					c2: 'confirmed',
					c3: 'confirmed',
					c4: 'confirmed',
				},
			],
		},
		phases: {
			before: [
				{ title: '진입', caption: 'PC에서도 600px 고정폭 모바일 화면이 노출됩니다.' },
				{ title: '탐색', caption: '정책·답례품·동네소식·기부사업이 각 메뉴에 흩어져 있습니다.' },
				{ title: '메뉴 이동', caption: '원하는 콘텐츠를 찾으려면 서비스별로 다시 탐색해야 했습니다.' },
				{ title: '재진입', caption: '개선 전 화면에는 통합검색이 없어 각 메뉴를 다시 찾아 들어갑니다.' },
			],
			after: [
				{
					title: '진입',
					caption: '주요 화면을 필터·본문·보조 세 영역의 PC 레이아웃으로 확장하고 본문은 600px를 유지합니다.',
				},
				{
					title: '검색어',
					caption: '주소에서 검색 조건을 복원하고, 검색어 변경은 기록을 남기며 필터·정렬 변경은 기록을 교체합니다.',
				},
				{
					title: '카테고리·필터',
					caption: 'PC 체크박스와 모바일 칩이 같은 필터 상태를 쓰고, 상위 지역이 바뀌면 하위 지역을 비웁니다.',
				},
				{
					title: '공유·복원',
					caption: '공유·새로고침·뒤로가기 뒤에도 같은 조건이 복원되고, 잘못된 값은 기본값으로 돌아옵니다.',
				},
			],
		},
		ownedParts: [
			'주요 화면의 PC 레이아웃 확장',
			'카테고리별로 찾는 통합검색',
			'검색어·카테고리·필터·정렬·페이지와 URL 동기화(검색어 push, 필터·정렬 replace)',
			'PC 체크박스·모바일 칩이 공유하는 필터 상태와 상위 지역 변경 시 하위 지역 초기화',
			'잘못된 페이지·정렬 값의 기본값 복구',
		],
		callouts: {
			role: 'PC 레이아웃 전환과 통합검색의 화면·상태·URL 동기화를 구축했습니다.',
			problem: 'PC에서도 600px 고정폭 화면이 보였고, 정책·답례품·동네소식·기부사업은 메뉴마다 흩어져 있었습니다.',
			decision:
				'화면을 PC로 확장하고 검색 조건을 URL에 두어 공유·재진입이 되게 했으며, 필터 상태는 PC와 모바일이 함께 씁니다.',
			outcome: '개편 전후 2주 GA4 단순 전후 비교에서 데스크톱 평균 참여 시간이 약 20% 증가했습니다.',
			outcomeBasis: '이력서 기재 내용(GA4 2주 단순 전후 비교). 이 페이지에서 측정한 값이 아닙니다.',
		},
		screens: { after: WELLO_SEARCH_PC },
		mobile: WELLO_HOME_MOBILE,
		gallery: [WELLO_HOME_PC, WELLO_SEARCH_MOBILE],
		reconstructionNote:
			'개선 전 화면은 공개 캡처가 없어 600px 고정폭 구조를 다시 그린 도식입니다. 실제 화면이 아닙니다.',
	},
	{
		slug: 'wellobiz-chakra-zod',
		shortTitle: 'UI 스택 정리',
		headline: 'Chakra·yup을 걷어내도 폼 필드는 지워지지 않는다',
		variantLabels: { before: 'Chakra·yup·서드파티', after: '디자인 시스템·Zod' },
		beforeKind: 'historical',
		layerLabels: ['화면 컴포넌트', '라이브러리·검증', '스키마 동작'],
		nodes: [
			{ id: 'ui', label: '디자인 시스템 Modal·Button', labelBefore: 'Chakra 글로벌 컴포넌트', layer: 0, col: 0 },
			{ id: 'form', label: '폼 화면', layer: 0, col: 2 },
			{ id: 'schema', label: 'Zod 스키마', labelBefore: 'yup 스키마', layer: 1, col: 0 },
			{ id: 'resolver', label: '직접 만든 폼 resolver', labelBefore: 'yupResolver', layer: 1, col: 2 },
			{ id: 'libs', label: 'Embla·Pointer Events', labelBefore: 'Swiper·react-swipeable', layer: 1, col: 3 },
			{ id: 'rhf', label: 'react-hook-form 오류 형식', layer: 2, col: 0 },
			{ id: 'strip', label: '선언되지 않은 필드 제거', layer: 2, col: 2 },
		],
		edges: {
			before: [
				['form', 'ui'],
				['form', 'resolver'],
				['resolver', 'schema'],
				['ui', 'libs'],
			],
			after: [
				['form', 'ui'],
				['form', 'resolver'],
				['resolver', 'schema'],
				['resolver', 'rhf'],
				['ui', 'libs'],
			],
		},
		states: {
			before: [
				{ ui: 'provisional' },
				{ schema: 'provisional', resolver: 'provisional' },
				{ ui: 'provisional', form: 'provisional', libs: 'provisional' },
				{ ui: 'waiting', form: 'provisional', libs: 'waiting' },
			],
			after: [
				{ ui: 'confirmed', form: 'confirmed' },
				{ ui: 'confirmed', libs: 'confirmed' },
				{ schema: 'waiting', strip: 'broken' },
				{
					ui: 'confirmed',
					form: 'confirmed',
					libs: 'confirmed',
					schema: 'confirmed',
					resolver: 'confirmed',
					rhf: 'confirmed',
				},
			],
		},
		phases: {
			before: [
				{ title: '컴포넌트', caption: 'Modal·Alert·Table 같은 글로벌 컴포넌트가 Chakra UI에 의존했습니다.' },
				{ title: '폼 검증', caption: '폼 검증은 yup 스키마와 yupResolver에 맞춰져 있었습니다.' },
				{ title: '서드파티', caption: '캐러셀·스와이프·아이콘에 Swiper, react-swipeable, react-feather를 썼습니다.' },
				{ title: '갈라진 기준', caption: '공통 디자인 시스템과 Zod를 쓰는 다른 앱과 UI·검증 방식이 갈려 있었습니다.' },
			],
			after: [
				{
					title: '컴포넌트 대체',
					caption: 'Chakra 의존 컴포넌트를 공통 디자인 시스템의 Modal·Button 조합으로 대체합니다.',
				},
				{
					title: '서드파티 교체',
					caption: '캐러셀은 Embla Carousel로, 패널 크기 조절은 Pointer Events로 직접 만듭니다.',
				},
				{
					title: '필드 제거',
					caption: 'yup을 Zod로 옮기자 선언되지 않은 필드가 제출 데이터에서 사라집니다.',
				},
				{
					title: '해결',
					caption: '스키마를 looseObject로 선언해 필드를 보존하고, 직접 만든 resolver로 폼과 연결합니다.',
				},
			],
		},
		ownedParts: [
			'Chakra 의존 컴포넌트의 공통 디자인 시스템 대체',
			'Swiper를 Embla Carousel로, 스와이프를 Pointer Events 직접 구현으로 교체',
			'yup 스키마의 Zod 전환과 looseObject 스키마로 필드 보존',
			'입력·출력 타입이 다른 스키마를 받고 오류를 중첩 구조로 바꾸는 폼 연결 resolver',
		],
		callouts: {
			role: 'Wello-biz의 Chakra UI·yup과 서드파티 UI 라이브러리를 걷어내고 UI와 검증 기준을 공통 디자인 시스템·Zod로 맞췄습니다.',
			problem:
				'Chakra UI 기반 공통 컴포넌트와 yup 검증, 여러 서드파티 UI 라이브러리가 섞여 있어, 공통 디자인 시스템과 Zod를 쓰는 모노레포의 다른 앱과 UI·검증 방식이 갈려 있었습니다.',
			decision:
				'컴포넌트는 공통 디자인 시스템으로, 캐러셀과 스와이프는 더 단순한 구현으로 바꾸고, 사라지는 필드는 looseObject 스키마로 보존했습니다.',
			outcome:
				'wello-biz 소스에 Chakra UI·yup·Swiper를 직접 가져오는 코드가 남아 있지 않고, UI는 공통 디자인 시스템으로 검증은 Zod 하나로 통일됐습니다.',
			outcomeBasis: '이력서 기재 내용. 번들 크기는 실측하지 않아 수치를 싣지 않았습니다.',
		},
		screens: {},
		reconstructionNote: '내부 코드 전환 작업이라 공개 캡처가 없어 구조를 다시 그린 도식입니다. 실제 화면이 아닙니다.',
	},
	{
		slug: 'avatar-studio-performance',
		shortTitle: '아바타 스튜디오',
		headline: '3D 자산을 초기 로딩에서 분리해 첫 화면 400~600ms',
		variantLabels: { before: '모두 기다린 뒤 표시', after: 'UI 먼저·3D 지연' },
		beforeKind: 'historical',
		layerLabels: ['화면', '진입·변경 경계', '정적 자산'],
		nodes: [
			{ id: 'ui', label: '핵심 UI', layer: 0, col: 0 },
			{ id: 'view', label: '3D 뷰', layer: 0, col: 1 },
			{ id: 'edit', label: '편집 상태', layer: 0, col: 2 },
			{ id: 'entry', label: 'lazy·Suspense 진입점', labelBefore: '단일 진입점', layer: 1, col: 0 },
			{ id: 'hooks', label: '역할별 컴포넌트·훅', labelBefore: '3D·편집 혼재 컴포넌트', layer: 1, col: 2 },
			{ id: 'cdn', label: '파츠·JSON (S3·CDN)', labelBefore: '파츠·JSON 정적 자산', layer: 2, col: 1 },
		],
		edges: {
			before: [
				['entry', 'ui'],
				['entry', 'view'],
				['cdn', 'view'],
				['hooks', 'edit'],
			],
			after: [
				['entry', 'ui'],
				['entry', 'view'],
				['cdn', 'view'],
				['hooks', 'view'],
				['hooks', 'edit'],
			],
		},
		states: {
			before: [
				{ entry: 'waiting', ui: 'waiting', view: 'waiting', edit: 'waiting', cdn: 'waiting' },
				{ entry: 'broken', ui: 'waiting', view: 'waiting', edit: 'waiting', cdn: 'waiting' },
				{ entry: 'broken', view: 'broken', edit: 'broken', hooks: 'broken' },
				{ entry: 'broken', view: 'broken', edit: 'broken', hooks: 'broken' },
			],
			after: [
				{ entry: 'confirmed' },
				{ entry: 'confirmed', cdn: 'confirmed' },
				{ entry: 'confirmed', cdn: 'confirmed', view: 'confirmed', edit: 'confirmed', hooks: 'confirmed' },
				{
					entry: 'confirmed',
					ui: 'confirmed',
					view: 'confirmed',
					edit: 'confirmed',
					cdn: 'confirmed',
					hooks: 'confirmed',
				},
			],
		},
		phases: {
			before: [
				{ title: '초기 진입', caption: '3D 렌더링과 대용량 정적 자산이 초기 진입을 막았습니다.' },
				{ title: '빈 화면', caption: '첫 화면이 나오기까지 3초 이상 빈 화면이 노출됐습니다.' },
				{ title: '섞인 코드', caption: '3D·편집 로직이 큰 컴포넌트에 섞여 있었습니다.' },
				{ title: '변경 위험', caption: '작은 기능 변경도 기존 동작에 영향을 주기 쉬웠습니다.' },
			],
			after: [
				{ title: '진입점 분리', caption: '앱 진입점을 lazy loading과 Suspense 경계로 나눕니다.' },
				{ title: '자산 이전', caption: '아바타 파츠·JSON 자산을 S3·CDN 경로에서 불러오도록 옮깁니다.' },
				{
					title: '역할 분리',
					caption: '편집 화면이 보일 대상을 계산하고 3D 뷰는 적용만 하며, 저장 화면은 별도 썸네일 뷰를 씁니다.',
				},
				{
					title: '결과',
					caption: '첫 화면 표시가 Lighthouse FCP 기준 400~600ms가 됐고 편집 기능을 확장하기 쉬워졌습니다.',
				},
			],
		},
		ownedParts: [
			'앱 진입점의 lazy loading·Suspense 경계 분리',
			'아바타 파츠·JSON 자산의 S3·CDN 이전',
			'3D 뷰와 편집 상태를 역할별 컴포넌트·훅으로 분리(편집 화면이 데이터를 계산, 3D 뷰는 표시)',
			'업로드 이미지의 텍스처 반영, 16MB·정사각형 검사',
		],
		callouts: {
			role: '외주 업체에서 인수한 WebGL 아바타 서비스의 초기 진입과 구조를 개선했습니다.',
			problem:
				'3D 렌더링과 대용량 정적 자산이 진입을 막아 3초 이상 빈 화면이 보였고, 3D·편집 로직이 섞여 작은 변경도 위험했습니다.',
			decision:
				'진입점과 정적 자산을 나누고, 편집 화면은 데이터를 계산하고 3D 뷰는 표시만 하도록 변경 경계를 나눴습니다.',
			outcome: '첫 화면 표시를 Lighthouse FCP 기준 400~600ms로 단축했습니다.',
			outcomeBasis: '이력서 기재 내용. 이 페이지에서 측정한 값이 아닙니다.',
		},
		screens: {},
		reconstructionNote: '서비스 화면은 공개 캡처가 없어 구조를 다시 그린 도식입니다. 단계 간격은 실제 시간이 아닙니다.',
	},
];

/** 전시 순서. 사례 카드·월드 장의 순서와 같다(테스트가 cases.ts 와 맞는지 확인한다). */
export const EXHIBIT_ORDER = [
	'wellomarket-checkout',
	'wello-responsive-search',
	'wellobiz-chakra-zod',
	'admin-session-refresh',
	'donation-duplicate-guard',
	'mydata-integration',
	'ai-chatbot-cms',
	'ai-chatbot-ssr',
	'swing-frontend',
	'avatar-studio-performance',
] as const;

const ALL_EXHIBITS = [...CORE_EXHIBITS, ...MORE_EXHIBITS];

export const EXHIBITS: Exhibit[] = EXHIBIT_ORDER.map(slug => {
	const found = ALL_EXHIBITS.find(item => item.slug === slug);

	if (!found) throw new Error(`전시 데이터가 없습니다: ${slug}`);

	return found;
});

export const getExhibit = (slug: string) => EXHIBITS.find(item => item.slug === slug);

export const getNodeLabel = (node: FlowNode, variant: Variant) =>
	variant === 'before' && node.labelBefore ? node.labelBefore : node.label;

export const getNodeState = (exhibit: Exhibit, variant: Variant, phase: number, nodeId: string): NodeState =>
	exhibit.states[variant][clampPhase(phase)][nodeId] ?? 'idle';

/** 지금 보이는 실제 화면. 선택한 쪽에 없으면 다른 쪽 화면을 빌리지 않고 undefined 를 돌려준다. */
export const getExhibitScreen = (exhibit: Exhibit, variant: Variant) => exhibit.screens[variant];

/** 전·후 토글에 쓰는 이름. 가상 비교는 "개선 전"이라 부르지 않는다. */
export const getVariantName = (exhibit: Exhibit, variant: Variant) =>
	variant === 'after'
		? exhibit.beforeKind === 'none'
			? '구현'
			: '개선 후'
		: exhibit.beforeKind === 'scenario'
			? '위험 시나리오'
			: '개선 전';

/** 전·후 비교가 있는 전시만 두 가지, 새로 만든 기능은 개선 후 하나뿐이다. */
export const getVariants = (exhibit: Exhibit): Variant[] => (exhibit.beforeKind === 'none' ? ['after'] : [...VARIANTS]);

/**
 * 무대에 올릴 공개 화면. 사례 전용 캡처(screens)가 있으면 그 전·후 쌍만 쓰고, 없는 쪽을 다른 화면으로 채우지 않는다
 * (개선 전 자리에 개선 후 화면이 나오면 거짓이 된다). 사례 전용 캡처가 아예 없으면 서비스 공개 화면을 맥락용으로 쓴다.
 */
export const getStageScreen = (exhibit: Exhibit, variant: Variant): ServiceScreen | undefined => {
	if (Object.keys(exhibit.screens).length > 0) return exhibit.screens[variant];

	return exhibit.identity ?? exhibit.gallery?.[0] ?? exhibit.mobile;
};

/** 전시가 쓰는 모든 공개 화면. */
export const getAllScreens = (exhibit: Exhibit): ServiceScreen[] =>
	[...Object.values(exhibit.screens), exhibit.identity, exhibit.mobile, ...(exhibit.gallery ?? [])].flatMap(screen =>
		screen ? [screen] : [],
	);

/** 도식이 쓰는 모든 이미지 경로. 테스트에서 파일 존재를 확인한다. */
export const getExhibitImagePaths = () => EXHIBITS.flatMap(item => getAllScreens(item).map(screen => screen.src));
