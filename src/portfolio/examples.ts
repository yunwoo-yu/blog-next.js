/**
 * 사례별 "예시 화면" 데이터. 실제 서비스 화면 캡처를 싣지 않고, 사례 본문(cases·stories)이 이미 말하는 동작만
 * 가상의 이름·값으로 다시 그린다. 실제 서비스·회사·제품 이름, 실제 연락처·계정은 쓰지 않는다(examples.test.ts 가 지킨다).
 * 가짜 주소는 예약 도메인(example.test) 아래만 쓴다.
 */

/** 모든 예시 화면에 항상 보이는 표기. 앞의 라벨은 배지로, 뒤 문장은 이어서 그린다. */
export const EXAMPLE_LABEL = '예시 화면';
export const EXAMPLE_DISCLAIMER = '개념을 보여 주기 위해 새로 만든 가상의 화면이며 실제 서비스 화면이 아닙니다';
export const EXAMPLE_NOTICE = `${EXAMPLE_LABEL} · ${EXAMPLE_DISCLAIMER}`;

/**
 * 사례가 실제 화면에 있었다고 말하지 않는 요소(상태 배너·결과 패널·위치 표시 등)를 설명용으로 그린 예시의 caption 끝에 붙인다.
 * 그 요소가 실제 화면 구성이라는 사실 주장으로 읽히지 않게 한다.
 */
export const EXAMPLE_ILLUSTRATIVE_NOTE = '강조 표시와 안내 문구는 설명을 위한 것입니다.';

/** 가짜 주소·이메일이 써야 하는 예약 도메인. */
export const EXAMPLE_DOMAIN = 'example.test';

/**
 * 예시 화면의 데이터·렌더 결과 어디에도 나오면 안 되는 실제 서비스·회사·제품·결제/인증 기관 이름(테스트가 검사한다).
 * 라틴 문자는 대소문자를 가리지 않고 찾는다. 화면에 내보내지 않는 검사용 목록이다.
 */
export const EXAMPLE_FORBIDDEN_TERMS = [
	'웰로',
	'Wello',
	'웰마켙',
	'웰포인트',
	'Talker',
	'Swing',
	'스윙',
	'Localo',
	'로컬로',
	'아바타 스튜디오',
	'살린',
	'Salin',
	'KB',
	'국민',
	'토스',
	'Toss',
	'NICEPAY',
	'NICE',
	'나이스',
	'KHIS',
	'KOSCOM',
	'코스콤',
	'ILab',
	'Unity',
	'OpenAI',
	'카카오',
	'네이버',
] as const;

interface ExampleFrame {
	/** 브라우저 틀의 주소 줄(스킴 없이). 예약 도메인 아래만 쓴다. */
	address: string;
	/** 주소 줄에서 강조할 부분(화면의 조건과 같은 값). */
	marks?: string[];
}

export interface ExampleField {
	label: string;
	value: string;
	/** 있으면 입력 칸 아래에 오류 문구로 붙는다. */
	error?: string;
}

interface ExampleRow {
	label: string;
	value: string;
}

interface OrderSummaryData extends ExampleFrame {
	lines: ExampleRow[];
	displayTotal: ExampleRow;
	confirmedTotal: ExampleRow;
	button: string;
	note: string;
}

interface SearchUrlData extends ExampleFrame {
	query: string;
	chips: { label: string; selected?: boolean }[];
	results: { type: string; title: string }[];
	note: string;
}

interface AdminRefreshData extends ExampleFrame {
	status: string;
	statusNote: string;
	columns: string[];
	rows: string[][];
}

interface ConfirmModalData extends ExampleFrame {
	heading: string;
	rows: ExampleRow[];
	question: string;
	confirm: string;
	cancel: string;
}

interface EditorLoadingData extends ExampleFrame {
	parts: { label: string; selected?: boolean }[];
	loadingLabel: string;
	note: string;
}

interface FormErrorsData extends ExampleFrame {
	fields: ExampleField[];
	group: { label: string; items: ExampleField[] };
	submit: string;
}

interface StepperResultsData extends ExampleFrame {
	steps: string[];
	/** 0부터 센 현재 단계 */
	current: number;
	resultsTitle: string;
	results: { label: string; ok: boolean }[];
	failNotice: string;
}

interface ChatAnchorData extends ExampleFrame {
	loadedNotice: string;
	older: string[];
	anchor: { text: string; label: string };
	preview: { label: string; title: string; description: string; host: string; imageLabel: string };
}

interface AttachmentFormData extends ExampleFrame {
	field: ExampleField;
	filesLabel: string;
	files: { name: string; state: 'kept' | 'added' }[];
	note: string;
	submit: string;
}

interface ExampleBase {
	slug: string;
	/** 가상 서비스 화면 이름 */
	title: string;
	/** 보조기기용 한두 문장 설명 */
	alt: string;
	/** 이 화면이 무엇을 보여 주는지 한 줄 */
	caption: string;
}

export type ExampleScreen = ExampleBase &
	(
		| { kind: 'order-summary'; data: OrderSummaryData }
		| { kind: 'search-url'; data: SearchUrlData }
		| { kind: 'admin-refresh'; data: AdminRefreshData }
		| { kind: 'confirm-modal'; data: ConfirmModalData }
		| { kind: 'editor-loading'; data: EditorLoadingData }
		| { kind: 'form-errors'; data: FormErrorsData }
		| { kind: 'stepper-results'; data: StepperResultsData }
		| { kind: 'chat-anchor'; data: ChatAnchorData }
		| { kind: 'attachment-form'; data: AttachmentFormData }
	);

export const EXAMPLE_SCREENS: readonly ExampleScreen[] = [
	{
		slug: 'wellomarket-checkout',
		kind: 'order-summary',
		title: '샘플마켓 주문 결제',
		alt: '가상의 쇼핑몰 주문 요약 화면입니다. 상품 금액·배송비·쿠폰·포인트 아래에 화면 합계(표시용)와 서버가 확정한 결제 금액이 나란히 있고, 결제 버튼은 서버가 확정한 금액을 씁니다.',
		caption: '화면 합계는 표시에만 쓰고, 결제사에는 서버가 확정한 결제 금액 하나만 보냅니다.',
		data: {
			address: 'shop.example.test/checkout',
			lines: [
				{ label: '상품 금액', value: '15,000원' },
				{ label: '배송비', value: '3,000원' },
				{ label: '쿠폰', value: '-4,000원' },
				{ label: '포인트', value: '-2,000원' },
			],
			displayTotal: { label: '화면 합계(표시용)', value: '12,000원' },
			confirmedTotal: { label: '결제 금액(서버가 확정)', value: '12,000원' },
			button: '12,000원 결제하기',
			note: '결제사로 보내는 값: 서버가 확정한 결제 금액',
		},
	},
	{
		slug: 'wello-responsive-search',
		kind: 'search-url',
		title: '예시 통합검색',
		alt: '가상의 통합검색 화면입니다. 주소 줄의 q=예시, sort=latest 값과 화면의 검색어·정렬 조건이 같게 강조돼 있고, 아래에 필터 칩과 검색 결과 목록이 있습니다.',
		caption: '주소의 검색어·정렬 값과 화면의 검색 조건이 같아, 링크를 공유하거나 새로고침해도 같은 조건으로 봅니다.',
		data: {
			address: 'search.example.test/search?q=예시&sort=latest',
			marks: ['q=예시', 'sort=latest'],
			query: '예시',
			chips: [{ label: '정렬: 최신순', selected: true }, { label: '상위 지역: 전체' }, { label: '하위 지역: 전체' }],
			results: [
				{ type: '분류 A', title: '예시 결과 1' },
				{ type: '분류 B', title: '예시 결과 2' },
				{ type: '분류 C', title: '예시 결과 3' },
			],
			note: '주소의 q·sort 값 = 화면의 검색어·정렬',
		},
	},
	{
		slug: 'admin-session-refresh',
		kind: 'admin-refresh',
		title: '데모 어드민 목록',
		alt: '가상의 관리 화면 목록입니다. 위쪽에 로그인 정보를 갱신하는 중이라는 상태 표시가 있고, 다시 로그인하지 않아도 목록 요청이 이어진다는 안내가 붙어 있습니다.',
		caption: `로그인 증명값이 만료되면 갱신한 뒤 요청을 다시 보내, 다시 로그인하지 않고 작업을 이어 갑니다. ${EXAMPLE_ILLUSTRATIVE_NOTE}`,
		data: {
			address: 'admin.example.test/items',
			status: '로그인 정보를 갱신하는 중…',
			statusNote: '다시 로그인하지 않고 요청을 이어서 보냅니다',
			columns: ['번호', '제목', '상태'],
			rows: [
				['2', '예시 항목 B', '비공개'],
				['1', '예시 항목 A', '공개'],
			],
		},
	},
	{
		slug: 'donation-duplicate-guard',
		kind: 'confirm-modal',
		title: '예시 기부 재확인',
		alt: '가상의 기부 화면 위에 확인 창이 떠 있습니다. "최근 기부 이력이 있습니다"라는 안내와 기관·금액·일시가 있고, 계속 기부하기와 그만두기 중 하나를 고르게 합니다.',
		caption: '외부 납부를 다녀온 뒤 최신 이력을 다시 확인하고, 완료 이력이 있으면 계속할지 사용자가 고릅니다.',
		data: {
			address: 'give.example.test/donate',
			heading: '최근 기부 이력이 있습니다',
			rows: [
				{ label: '기관', value: '예시 기관' },
				{ label: '금액', value: '10,000원' },
				{ label: '일시', value: '20XX.01.01 12:00' },
			],
			question: '그래도 기부를 계속할까요?',
			confirm: '계속 기부하기',
			cancel: '그만두기',
		},
	},
	{
		slug: 'avatar-studio-performance',
		kind: 'editor-loading',
		title: '캐릭터 편집기 예시',
		alt: '가상의 3D 캐릭터 편집 화면입니다. 왼쪽에 파츠 목록이 있고, 오른쪽 3D 영역은 회색 로딩 자리로 따로 표시됩니다.',
		caption: '3D 뷰에 Suspense 경계를 두고, 편집 목록과 3D 표시를 나눈 구성을 보여 줍니다.',
		data: {
			address: 'editor.example.test/character',
			parts: [{ label: '머리', selected: true }, { label: '상의' }, { label: '하의' }, { label: '신발' }],
			loadingLabel: '3D 영역 불러오는 중',
			note: '로딩 표시는 3D 영역에만(Suspense 경계)',
		},
	},
	{
		slug: 'wellobiz-chakra-zod',
		kind: 'form-errors',
		title: '예시 입력 폼',
		alt: '가상의 입력 폼입니다. 이메일 칸 바로 아래에 형식 오류가, 담당자 목록 안 두 번째 항목 칸 바로 아래에 이름 누락 오류가 점선 테두리와 함께 표시됩니다.',
		caption: '배열 안 항목까지 포함해, 검증 오류를 그 오류가 난 입력 칸 바로 아래에 표시합니다.',
		data: {
			address: 'form.example.test/settings',
			fields: [
				{ label: '이름', value: '홍길동' },
				{ label: '이메일', value: 'hong@example', error: '이메일 형식을 확인해 주세요' },
			],
			group: {
				label: '담당자 목록',
				items: [
					{ label: '담당자 1', value: '김예시' },
					{ label: '담당자 2', value: '', error: '담당자 2의 이름을 입력해 주세요' },
				],
			},
			submit: '저장',
		},
	},
	{
		slug: 'mydata-integration',
		kind: 'stepper-results',
		title: '예시 데이터 연결',
		alt: '가상의 데이터 연결 화면입니다. 위에는 본인인증·동의·전송요구·전자서명 4단계 중 현재 단계가 강조돼 있고, 아래에는 일괄 철회 결과로 성공한 기관과 실패한 기관이 나뉘어 실패한 기관만 다시 시도하라는 안내가 있습니다.',
		caption: `외부 인증을 다녀와도 이어지는 진행 단계와, 일괄 철회에서 실패한 기관만 따로 알리는 결과를 보여 줍니다. ${EXAMPLE_ILLUSTRATIVE_NOTE}`,
		data: {
			address: 'connect.example.test/flow?step=2',
			marks: ['step=2'],
			steps: ['본인인증', '동의', '전송요구', '전자서명'],
			current: 1,
			resultsTitle: '일괄 철회 결과',
			results: [
				{ label: '예시 기관 A', ok: true },
				{ label: '예시 기관 B', ok: false },
				{ label: '예시 기관 C', ok: true },
			],
			failNotice: '예시 기관 B만 철회하지 못했습니다. 이 기관만 다시 시도해 주세요',
		},
	},
	{
		slug: 'ai-chatbot-cms',
		kind: 'chat-anchor',
		title: '예시 상담 챗봇',
		alt: '가상의 챗봇 화면입니다. 위쪽에 이전 대화 10개가 새로 붙었지만 읽던 메시지는 같은 자리에 표시돼 있고, 옆에는 고객사별 제목·설명·이미지 자리가 있는 링크 미리보기 카드가 있습니다.',
		caption: `위에 이전 대화가 붙어도 읽던 메시지는 같은 자리에 있고, 링크 미리보기에는 고객사별 제목·설명이 담깁니다. ${EXAMPLE_ILLUSTRATIVE_NOTE}`,
		data: {
			address: 'chat.example.test/sample-co',
			marks: ['sample-co'],
			loadedNotice: '이전 대화 10개를 불러왔습니다',
			older: ['이전 질문 예시', '이전 답변 예시'],
			anchor: { text: '읽던 메시지 예시', label: '읽던 위치 그대로' },
			preview: {
				label: '링크 미리보기',
				title: '샘플 고객사 상담',
				description: '고객사 설정에서 가져온 제목·설명',
				host: 'chat.example.test',
				imageLabel: '대표 이미지 자리',
			},
		},
	},
	{
		slug: 'swing-frontend',
		kind: 'attachment-form',
		title: '예시 계약 수정',
		alt: '가상의 계약 수정 폼입니다. 관리번호 칸 바로 아래에 이미 사용 중인 관리번호라는 오류가 있고, 첨부 파일 목록에는 기존 파일 1개가 유지된 채 새 파일 1개가 추가돼 있습니다.',
		caption:
			'계약을 수정할 때 기존 첨부 파일을 유지한 채 새 파일을 더하고, 관리번호 중복은 그 입력 칸 아래에 알립니다.',
		data: {
			address: 'contract.example.test/contracts/edit',
			field: { label: '관리번호', value: 'DEMO-0001', error: '이미 사용 중인 관리번호입니다' },
			filesLabel: '첨부 파일',
			files: [
				{ name: '계약서_예시.pdf', state: 'kept' },
				{ name: '추가자료_예시.pdf', state: 'added' },
			],
			note: '저장하면 기존 파일과 새 파일을 함께 보냅니다',
			submit: '수정 저장',
		},
	},
];

export const getExampleScreen = (slug: string) => EXAMPLE_SCREENS.find(example => example.slug === slug);
