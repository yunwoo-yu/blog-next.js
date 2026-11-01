/**
 * 사례별 "전시" 데이터. 공개 화면 이미지와 역할/문제/결정/결과 문구를 담는다.
 * 사실(기간·문제·결과 수치)은 이력서에 있는 것만 옮기고, 이력서에 없는 수치는 만들지 않는다.
 */

import { MORE_EXHIBITS } from './exhibit-data-more';

export type Variant = 'before' | 'after';

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
}

export interface Exhibit {
	slug: string;
	/** 전시 선택 버튼에 쓰는 짧은 이름 */
	shortTitle: string;
	/** 큰 타이포로 보이는 한 줄 */
	headline: string;
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
}

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
			outcome: '2026.03 오픈 후 1개월간 결제 금액 관련 고객 상담 문의와 API 에러 로그가 0건이었습니다.',
		},
		screens: {},
		identity: WELLO_MARKET_PC,
		gallery: [WELLO_MARKET_LIST_PC, WELLO_MARKET_PRODUCT_PC, WELLO_MARKET_MOBILE],
	},
	{
		slug: 'wello-responsive-search',
		shortTitle: '반응형·검색',
		headline: '검색 조건이 URL에 남는 통합검색',
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
		},
		screens: { after: WELLO_SEARCH_PC },
		mobile: WELLO_HOME_MOBILE,
		gallery: [WELLO_HOME_PC, WELLO_SEARCH_MOBILE],
	},
	{
		slug: 'wellobiz-chakra-zod',
		shortTitle: 'UI 스택 정리',
		headline: 'Chakra·yup을 걷어내도 폼 필드는 지워지지 않는다',
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
		},
		screens: {},
	},
	{
		slug: 'avatar-studio-performance',
		shortTitle: '아바타 스튜디오',
		headline: '3D 뷰와 편집 기능의 역할 분리',
		ownedParts: [
			'3D 뷰에 Suspense 경계 배치',
			'CDN 자산 경로의 환경 변수 상수화',
			'3D 뷰와 편집 상태를 역할별 컴포넌트·훅으로 분리(편집 화면이 데이터를 계산, 3D 뷰는 표시)',
			'업로드 이미지의 텍스처 반영, 16MB·정사각형 검사',
		],
		callouts: {
			role: '외주 업체에서 인수한 WebGL 아바타 서비스의 초기 진입과 구조를 개선했습니다.',
			problem:
				'3D 렌더링과 대용량 정적 자산이 진입을 막아 3초 이상 빈 화면이 보였고, 3D·편집 로직이 섞여 작은 변경도 위험했습니다.',
			decision:
				'3D 뷰에 Suspense 경계를 두고 편집 기능과 3D 표시를 분리했습니다. CDN 자산 경로는 환경 변수 상수로 정리했습니다.',
			outcome:
				'첫 콘텐츠 표시(FCP)는 3초 이상에서 Lighthouse 기준 400~600ms로 줄었습니다(이력서 기재). 3D 편집 조작 가능 시점과는 다릅니다.',
		},
		screens: {},
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
