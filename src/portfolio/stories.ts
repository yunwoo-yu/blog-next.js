/**
 * 사례별 "판단과 트러블슈팅" 데이터.
 * basis 가 resume 인 문장은 이력서 본문에 있는 사실을 풀어 쓴 것이다.
 * basis 가 code 인 문장은 코드나 커밋, 본인이 쓴 작업 기록에서 확인한 사실이다(운영에서도 보인다).
 * basis 가 draft 인 문장은 작성자 확인 전의 초안이라 운영 빌드에서는 렌더하지 않는다(isVisible).
 * 확인이 끝나면 basis 를 resume 으로 바꾼다. 확인할 질문은 checks 에 남긴다.
 */

export type Basis = 'resume' | 'code' | 'draft';

export interface DecisionOption {
	name: string;
	verdict: 'chosen' | 'rejected';
	reason: string;
	basis: Basis;
}

export interface Decision {
	question: string;
	options: DecisionOption[];
}

/** 시퀀스 도식: 누가 누구에게 무엇을 보내는지 순서대로. 문제가 생기는 지점을 tone 으로 표시한다. */
export interface SequenceDiagram {
	/** 세로줄로 서는 참여자 이름(왼쪽부터, 2~4개) */
	actors: string[];
	steps: {
		/** actors 의 인덱스 */
		from: number;
		to: number;
		label: string;
		/** problem: 문제가 터지는 단계, fix: 고친 뒤의 단계 */
		tone?: 'normal' | 'problem' | 'fix';
	}[];
	caption?: string;
}

export interface Trouble {
	/** 풀어야 했던 문제. 이력서에 적힌 요구·제약만 쓴다. */
	problem: string;
	fix: string;
	basis: Basis;
	/** 문제가 어떻게 생기는지 보여 주는 도식 */
	diagram?: SequenceDiagram;
}

export interface CaseStory {
	slug: string;
	decisions: Decision[];
	troubles: Trouble[];
	/** 작성자에게 확인할 질문. 화면에는 나오지 않는다. */
	checks: string[];
}

export const STORIES: CaseStory[] = [
	{
		slug: 'wellomarket-checkout',
		decisions: [
			{
				question: '최종 결제 금액은 누가 확정해야 하는가',
				options: [
					{
						name: '서버(체크아웃 API)가 확정',
						verdict: 'chosen',
						reason:
							'쿠폰·포인트 사용 내역만 API에 넘기고 응답의 확정 금액 하나만 결제사에 전달해 기준을 한 곳으로 모았습니다.',
						basis: 'code',
					},
					{
						name: '화면이 계산하고 서버는 검증만',
						verdict: 'rejected',
						reason:
							'개발 단계에서 체크아웃 API가 내려준 금액과 화면이 합산한 금액이 달라지는 문제가 실제로 있어 금액 확정을 서버로 고정했습니다.',
						basis: 'resume',
					},
				],
			},
			{
				question: '구매 후 화면의 버튼과 어드민의 상태 기준을 어떻게 맞출 것인가',
				options: [
					{
						name: '서버 주문 상태를 기준으로 한 곳에서 버튼을 결정',
						verdict: 'chosen',
						reason:
							'한 곳에서 주문 상태로 보여 줄 버튼을 정하고 버튼은 그리기만 하므로, 사용자 화면과 어드민이 같은 상태를 기준으로 동작합니다.',
						basis: 'code',
					},
				],
			},
		],
		troubles: [
			{
				problem:
					'상품·배송비·쿠폰·웰포인트가 겹쳐 최종 금액이 정해지는데, 개발 중에 체크아웃 API가 확정한 금액과 화면이 합산한 금액이 달라졌습니다.',
				fix: '결제사에 보내는 금액을 체크아웃 응답의 확정 금액 하나로 고정하고, 화면 합계는 표시에만 썼습니다.',
				basis: 'resume',
				diagram: {
					actors: ['결제 화면', '체크아웃 API', '결제사'],
					steps: [
						{ from: 0, to: 1, label: '쿠폰·포인트 선택 내역으로 체크아웃 호출' },
						{ from: 1, to: 0, label: '서버가 확정한 결제 금액을 응답' },
						{ from: 0, to: 2, label: '화면이 합산한 금액을 결제사에 전달', tone: 'problem' },
						{ from: 0, to: 2, label: '응답의 확정 금액을 결제사에 전달', tone: 'fix' },
					],
					caption: '금액의 기준을 서버 응답 한 곳으로 모았습니다.',
				},
			},
			{
				problem:
					'결제 버튼을 누르는 사이에 재고가 먼저 소진되거나 주문이 만료될 수 있어, 그때마다 사용자가 다음에 할 일을 알 수 있어야 했습니다.',
				fix: '결제 버튼을 누르면 체크아웃을 다시 호출해 서버가 재고와 쿠폰을 검증하게 하고, 재고 오류는 모달로 알린 뒤 장바구니에서 다시 고르게 했습니다.',
				basis: 'code',
				diagram: {
					actors: ['결제 화면', '체크아웃 API', '장바구니'],
					steps: [
						{ from: 0, to: 1, label: '결제 버튼: 체크아웃 재호출(재고·쿠폰 재검증)' },
						{ from: 1, to: 0, label: '재고 부족 오류 응답', tone: 'problem' },
						{ from: 0, to: 0, label: '모달로 안내', tone: 'fix' },
						{ from: 0, to: 2, label: '장바구니로 이동해 다시 선택', tone: 'fix' },
					],
				},
			},
			{
				problem:
					'구매 후에는 주문 상태마다 보여 줄 버튼이 달랐고, 입점업체 어드민도 같은 상태를 기준으로 봐야 했습니다.',
				fix: '서버 주문 상태를 보고 버튼 목록을 돌려주는 곳을 한 군데로 모으고, 버튼 컴포넌트는 받은 목록을 그리기만 하게 했습니다.',
				basis: 'code',
			},
		],
		checks: [
			'주문 상태는 몇 가지였고, 상태 전이에서 가장 까다로웠던 부분은?',
			'결제 화면과 주문 처리에 쓴 코드의 본인 작성 범위를 커밋으로 구분할 수 있나요? (스냅샷 커밋뿐이라 Jira 담당 기록으로만 확인했습니다)',
			'테스트가 없는데 결제 금액 회귀는 어떻게 확인했나요?',
			'오픈 후 1개월 0건의 원자료(CS 집계, 에러 로그 조회 화면)가 남아 있나요?',
		],
	},
	{
		slug: 'wello-responsive-search',
		decisions: [
			{
				question: '검색 조건을 어디에 둘 것인가',
				options: [
					{
						name: 'URL과 동기화',
						verdict: 'chosen',
						reason:
							'조건을 주소에서 복원하고 기본값은 주소에서 생략해, 공유·새로고침·뒤로가기 뒤에도 같은 결과가 보입니다.',
						basis: 'code',
					},
				],
			},
			{
				question: 'PC 체크박스와 모바일 칩의 필터를 어떻게 만들 것인가',
				options: [
					{
						name: '같은 상태와 콜백을 공유',
						verdict: 'chosen',
						reason: '필터 상태가 하나라서 화면 모양만 다르게 그려도 PC와 모바일의 결과가 어긋나지 않습니다.',
						basis: 'code',
					},
					{
						name: '화면별로 따로 구현',
						verdict: 'rejected',
						reason: '[확인 필요] 실제로 두 구현이 어긋났던 경험이 있었는지 작성자 확인 전 초안입니다.',
						basis: 'draft',
					},
				],
			},
		],
		troubles: [
			{
				problem:
					'검색어·필터·정렬·페이지를 정한 뒤 상세 화면에 다녀오거나 링크를 공유해도 같은 조건이 유지돼야 했고, 상태를 바꾸는 함수 안에서 라우터를 직접 호출해서도 안 됐습니다.',
				fix: '주소를 원본으로 두고, 사용자가 조작하면 상태만 바꾼 뒤 effect에서 주소에 반영했습니다. 검색어는 push, 필터와 정렬은 replace로 써서 체크박스를 누를 때마다 기록이 쌓이지 않게 했습니다.',
				basis: 'code',
				diagram: {
					actors: ['사용자', '검색 화면', '주소(URL)'],
					steps: [
						{ from: 0, to: 1, label: '검색어 입력' },
						{ from: 1, to: 2, label: 'push: 검색어를 쓰고 페이지는 첫 장으로', tone: 'fix' },
						{ from: 0, to: 1, label: '필터 체크박스 선택' },
						{ from: 1, to: 2, label: 'replace: 현재 기록을 교체(기록이 쌓이지 않음)', tone: 'fix' },
						{ from: 0, to: 2, label: '새로고침 또는 링크 공유로 진입' },
						{ from: 2, to: 1, label: '주소에서 검색 조건을 읽어 상태 복원', tone: 'fix' },
					],
				},
			},
			{
				problem: '상위 지역을 바꾸면 이전에 고른 하위 지역이 남아 맞지 않는 지역 조합이 만들어질 수 있었습니다.',
				fix: '상위 지역이 바뀌면 하위 지역을 비웠습니다.',
				basis: 'code',
				diagram: {
					actors: ['사용자', '필터 상태'],
					steps: [
						{ from: 0, to: 1, label: '상위 지역 A, 하위 지역 a-1 선택' },
						{ from: 0, to: 1, label: '상위 지역을 B로 변경' },
						{ from: 1, to: 0, label: '(B, a-1) 조합이 남음', tone: 'problem' },
						{ from: 1, to: 0, label: '(B, 하위 지역 없음)으로 초기화', tone: 'fix' },
					],
				},
			},
			{
				problem:
					'주소를 직접 고치거나 오래된 링크로 들어오면 잘못된 페이지 번호나 허용되지 않은 정렬 값이 올 수 있었습니다.',
				fix: '페이지 번호는 1로 보정하고 소수는 내림하며, 허용되지 않은 정렬 값은 기본 정렬로 되돌립니다.',
				basis: 'code',
			},
		],
		checks: [
			'URL 동기화에서 가장 까다로웠던 지점(뒤로가기 히스토리 쌓임, 디바운스, SSR 초기값 등)은?',
			'PC 레이아웃 확장에서 반응형 기준점(breakpoint)과 컴포넌트 재사용 방식은?',
			'GA4 20% 증가 외에 검색 사용률·이탈률 같은 보조 지표가 있나요? (A/B가 아닌 2주 전후 비교라는 점은 본문에 적었습니다)',
			'검색어 변경만 push이고 필터는 replace인 이유는? 뒤로가기가 필터 단위가 아니라 검색어 단위로 동작하는 것이 의도인가요?',
			'변하지 않은 값을 다시 선택하면 대기 중인 주소 갱신이 남아 이후 변경을 덮어쓸 수 있는데 확인했나요?',
		],
	},
	{
		slug: 'wellobiz-chakra-zod',
		decisions: [
			{
				question: 'Chakra에 의존한 글로벌 컴포넌트와 서드파티 UI 라이브러리를 어떻게 정리할 것인가',
				options: [
					{
						name: '공통 디자인 시스템과 더 단순한 구현으로 대체',
						verdict: 'chosen',
						reason:
							'Modal·Alert·Table 등은 공통 디자인 시스템으로, 캐러셀은 Embla Carousel로, 패널 크기 조절은 Pointer Events 직접 구현으로 바꿨습니다.',
						basis: 'code',
					},
					{
						name: '어댑터를 두고 화면 단위로 점진 교체',
						verdict: 'rejected',
						reason: '[확인 필요] 이 방식을 검토했는지, 일괄 전환을 택한 이유가 무엇인지 작성자 확인 전 초안입니다.',
						basis: 'draft',
					},
				],
			},
			{
				question: 'Zod가 선언되지 않은 필드를 제거하는 문제를 어떻게 풀 것인가',
				options: [
					{
						name: '값을 그대로 보내야 하는 폼의 스키마를 looseObject로 선언',
						verdict: 'chosen',
						reason:
							'선언하지 않은 필드도 제출 데이터에서 빠지지 않아 API 응답 전체를 폼 값으로 쓰는 화면에서도 값이 유지됩니다.',
						basis: 'code',
					},
					{
						name: '모든 필드를 스키마에 선언',
						verdict: 'rejected',
						reason: '[확인 필요] 이 방식을 검토했는지, 버린 이유가 무엇인지 작성자 확인 전 초안입니다.',
						basis: 'draft',
					},
				],
			},
		],
		troubles: [
			{
				problem: '패널 크기를 빠르게 끌면 커서가 패널 밖으로 벗어나 드래그를 놓쳤습니다.',
				fix: '드래그를 시작할 때 포인터를 핸들에 붙들어 밖으로 나가도 이벤트를 계속 받게 하고, 끝나면 해제했습니다.',
				basis: 'code',
				diagram: {
					actors: ['포인터', '드래그 핸들'],
					steps: [
						{ from: 0, to: 1, label: '누르기: 드래그 시작' },
						{ from: 0, to: 1, label: '빠르게 끌어 커서가 핸들 밖으로 벗어남', tone: 'problem' },
						{ from: 1, to: 0, label: '포인터를 핸들에 붙들어 밖에서도 이벤트를 받음', tone: 'fix' },
						{ from: 0, to: 1, label: '떼기: 붙들기를 해제하고 드래그 종료' },
					],
				},
			},
			{
				problem: '배열이나 객체 안에 있는 필드의 검증 오류도 해당 입력에 보여야 했습니다.',
				fix: '직접 만든 resolver가 Zod의 오류 경로를 따라 중첩 오류 객체를 만들어 필드마다 오류가 붙게 했습니다.',
				basis: 'code',
			},
			{
				problem: 'Zod가 스키마에 선언되지 않은 필드를 제출 데이터에서 제거했습니다.',
				fix: '값을 그대로 보내야 하는 폼의 스키마를 looseObject로 바꿔 필드가 빠지지 않게 했습니다.',
				basis: 'resume',
			},
		],
		checks: [
			'looseObject는 어느 화면에서 왜 필요했나요? 선언하지 않은 필드까지 제출될 때의 위험(과다 전송, 검증 우회)은 어떻게 봤나요?',
			'기본 resolver 대신 직접 만든 이유는 무엇인가요? (의존성 버전, 타입 제약) 타입 안전성을 잃는 대가는 어떻게 봤나요?',
			'같은 항목에 오류가 여러 개일 때 마지막 오류가 표시되는 한계를 알고 있나요?',
			'일괄 전환 대신 어댑터를 둔 점진 전환을 검토했나요? 테스트가 없는데 회귀는 어떻게 확인했나요?',
			'번들 크기 변화를 앱 단위로 재 볼 수 있나요? 지금은 수치를 싣지 않았습니다.',
		],
	},
	{
		slug: 'admin-session-refresh',
		decisions: [
			{
				question: '동시에 401을 받은 요청이 토큰 갱신을 어떻게 나눠 쓸 것인가',
				options: [
					{
						name: '진행 중인 갱신 Promise를 공유해 첫 요청만 갱신',
						verdict: 'chosen',
						reason: '첫 요청만 갱신을 호출하고 나머지는 같은 결과를 기다립니다.',
						basis: 'code',
					},
				],
			},
			{
				question: '다른 탭이 먼저 갱신한 경우를 어떻게 다룰 것인가',
				options: [
					{
						name: '실패한 요청의 토큰과 쿠키 토큰을 비교(Next.js 어드민)',
						verdict: 'chosen',
						reason: '쿠키 토큰이 다르면 다른 탭이 이미 갱신한 것으로 보고 갱신 없이 쿠키의 토큰으로 다시 요청합니다.',
						basis: 'code',
					},
				],
			},
		],
		troubles: [
			{
				problem:
					'요청 여러 개가 한꺼번에 401을 받을 때 갱신 토큰이 한 번만 쓸 수 있는 방식이라면, 요청마다 각자 갱신해 첫 요청만 성공하고 나머지는 로그아웃될 수 있습니다.',
				fix: '진행 중인 갱신 Promise가 있으면 새로 요청하지 않고 같은 결과를 함께 기다리게 했습니다.',
				basis: 'resume',
				diagram: {
					actors: ['요청 A', '요청 B', '인증 서버'],
					steps: [
						{ from: 0, to: 2, label: '401 수신, 갱신 요청' },
						{ from: 1, to: 2, label: '401 수신, 같은 갱신 토큰으로 갱신 요청', tone: 'problem' },
						{ from: 2, to: 1, label: '갱신 토큰이 일회용이라면 실패해 로그아웃될 수 있음', tone: 'problem' },
						{ from: 1, to: 0, label: '새로 요청하지 않고 진행 중인 갱신을 기다림', tone: 'fix' },
						{ from: 0, to: 1, label: '갱신 결과 공유, 둘 다 새 토큰으로 재요청', tone: 'fix' },
					],
				},
			},
			{
				problem: '탭을 2개 열고 작업할 때 한 탭이 토큰을 갱신하면, 다른 탭은 옛 토큰으로 요청하다 401을 받았습니다.',
				fix: '401을 받으면 실패한 요청의 토큰과 쿠키의 토큰을 먼저 비교해, 다르면 갱신 없이 쿠키의 토큰으로 다시 요청했습니다.',
				basis: 'code',
				diagram: {
					actors: ['탭 1', '쿠키', '탭 2', '인증 서버'],
					steps: [
						{ from: 0, to: 1, label: '갱신 성공, 새 토큰을 쿠키에 저장' },
						{ from: 2, to: 3, label: '옛 토큰으로 요청, 401', tone: 'problem' },
						{ from: 2, to: 1, label: '실패한 토큰과 쿠키의 토큰 비교', tone: 'fix' },
						{ from: 2, to: 3, label: '다르면 갱신 없이 쿠키의 토큰으로 재요청', tone: 'fix' },
					],
				},
			},
			{
				problem:
					'로그아웃 요청이 401을 받거나 갱신 요청 자신이 같은 인터셉터를 거치면, 갱신과 재시도와 401이 반복될 수 있습니다.',
				fix: '로그아웃 요청은 복구 대상에서 빼고, 갱신은 인터셉터를 거치지 않는 fetch로 보냈습니다.',
				basis: 'code',
			},
		],
		checks: [
			'이전 증상은 "자동 갱신이 없어 직접 다시 로그인"이고, "갱신 중복"은 갱신을 만들 때 막아야 했던 동시성 위험입니다. 둘을 섞어 말하지 않도록 순서(증상, 설계 이유)를 정리했나요?',
			'쿠키 범위를 바꾸면 이미 로그인한 사용자의 기존 쿠키는 어떻게 되나요? (옮기고 지우는 한 번짜리 이동 처리)',
			'갱신용 토큰이 한 번 쓰면 무효가 되는 건 서버 정책인가요? 코드로는 확인하지 못했습니다.',
			'Vue 쪽에는 쿠키 토큰 비교가 없습니다. iframe 안이라 필요 없다고 본 건가요, 아니면 시간상 빠진 건가요?',
			'재시도하는 요청이 생성·수정처럼 두 번 실행되면 안 되는 요청이면 어떻게 되나요?',
			'해결 시기를 2026.01로 확정했습니다. 요청이 들어온 시기와 배포한 시기가 다르면 어느 쪽을 적을까요?',
		],
	},
	{
		slug: 'donation-duplicate-guard',
		decisions: [
			{
				question: '외부 납부 뒤 완료 여부를 어떻게 판별할 것인가',
				options: [
					{
						name: '복귀 시 납부 식별값을 서버에 조회',
						verdict: 'chosen',
						reason:
							'외부 이동 직전에 저장한 납부 식별값으로 돌아온 뒤 서버에 조회하므로 모든 환경이 같은 기준을 씁니다.',
						basis: 'code',
					},
					{
						name: '외부 화면의 완료 응답을 그대로 신뢰',
						verdict: 'rejected',
						reason: '[확인 필요] 이 방식을 검토했는지, 버린 이유가 무엇인지 작성자 확인 전 초안입니다.',
						basis: 'draft',
					},
				],
			},
			{
				question: '중복 기부를 어느 시점에 재확인할 것인가',
				options: [
					{
						name: '결제 시점에 정산 후 최신 완료 이력을 다시 조회',
						verdict: 'chosen',
						reason:
							'정산이 끝나기를 기다린 뒤 최신 이력을 조회하고, 이력이 있으면 모달로 보여 준 뒤 사용자가 진행 여부를 선택합니다.',
						basis: 'code',
					},
				],
			},
		],
		troubles: [
			{
				problem:
					'결제 버튼을 누를 때 정산이 끝나기 전에 최신 완료 이력을 조회하면, 방금 납부한 건이 반영되지 않아 같은 기부를 다시 시도할 수 있습니다.',
				fix: '진입할 때 정산 요청을 한 번 보내 Promise를 보관하고, 결제 버튼을 누르면 그 Promise를 기다린 뒤 최신 완료 이력을 조회하게 순서를 고정했습니다.',
				basis: 'resume',
				diagram: {
					actors: ['사용자', '기부 화면', '서버'],
					steps: [
						{ from: 1, to: 2, label: '페이지 진입: 이전 기부 정산 요청' },
						{ from: 0, to: 1, label: '결제 버튼 클릭' },
						{ from: 1, to: 2, label: '정산이 끝나기 전에 최신 완료 이력 조회', tone: 'problem' },
						{ from: 2, to: 1, label: '직전 납부가 이력에 없어 중복 확인을 통과할 수 있음', tone: 'problem' },
						{ from: 1, to: 2, label: '정산이 끝나기를 기다린 뒤 최신 완료 이력 조회', tone: 'fix' },
						{ from: 2, to: 1, label: '직전 납부까지 포함된 이력, 있으면 모달로 확인', tone: 'fix' },
					],
				},
			},
			{
				problem:
					'토스로 넘어갈 때도 화면이 가려졌다 다시 보이는 이벤트가 생겨, 이벤트만 보면 납부를 마치고 돌아온 것으로 잘못 판단할 수 있었습니다.',
				fix: '화면이 다시 보이는 이벤트로 복귀 후보를 잡고, 이동 직전에 저장한 납부 식별값을 서버에 조회해 실제 납부가 확인된 경우에만 복귀로 처리했습니다.',
				basis: 'code',
				diagram: {
					actors: ['웰로 화면', '토스', '서버'],
					steps: [
						{ from: 0, to: 1, label: '토스로 이동(납부 식별값은 임시 저장)' },
						{ from: 1, to: 0, label: '토스 안에서 화면이 전환될 때도 같은 이벤트 발생', tone: 'problem' },
						{ from: 0, to: 2, label: '저장해 둔 납부 식별값으로 조회', tone: 'fix' },
						{ from: 2, to: 0, label: '실제 납부가 확인되면 복귀로 처리', tone: 'fix' },
					],
				},
			},
			{
				problem:
					'Wello 앱·KB 웹뷰, 토스, 일반 웹마다 외부 납부로 나가고 돌아오는 방식이 달랐고, KB 웹뷰는 이동 중에 화면을 다시 만들어 메모리의 값이 사라질 수 있었습니다.',
				fix: '환경마다 이동 방식을 나누되 이동 직전에 납부 식별값 등을 저장해 두고, 복귀 뒤에는 모두 같은 서버 조회를 거치게 했습니다.',
				basis: 'code',
			},
		],
		checks: [
			'앱·KB·토스 웹뷰와 일반 웹에서 복귀 방식이 달랐다면 어떤 차이를 어떻게 흡수했나요?',
			'결제 버튼을 연타하면 납부 식별값이 두 번 발급될 수 있는데, 서버에서 어떻게 막나요? 서버 측 중복 차단(멱등 키)은 검토했나요?',
			'CS 재문의 70% 감소는 담당자 전언이라 본문에 그렇게 적었습니다. 기간·채널·비교 대상을 담당자에게 다시 물어볼 수 있나요?',
			'정산이나 최신 이력 조회가 실패했을 때의 동작은 본문에서 설명하지 않았습니다. 의도한 동작인지 따로 확인이 필요합니다.',
		],
	},
	{
		slug: 'mydata-integration',
		decisions: [
			{
				question: '긴 연동 흐름의 중간값을 어디에 둘 것인가',
				options: [
					{
						name: '단계는 주소에, 입력값은 세션 스토리지에 저장',
						verdict: 'chosen',
						reason:
							'현재 단계는 주소에, 단계별 입력값은 세션 스토리지에 저장해 새로고침하거나 외부 인증을 다녀와도 같은 단계로 돌아옵니다.',
						basis: 'code',
					},
				],
			},
			{
				question: '일괄 철회에서 일부가 실패하면 어떻게 할 것인가',
				options: [
					{
						name: '기관 요청을 병렬 처리하고 실패한 항목만 안내',
						verdict: 'chosen',
						reason:
							'모든 요청의 결과를 받아 일부 실패에도 나머지 처리가 유지되고 사용자는 실패한 항목만 다시 시도할 수 있습니다.',
						basis: 'code',
					},
				],
			},
		],
		troubles: [
			{
				problem:
					'본인인증부터 철회까지 긴 규제성 흐름이 새로고침과 외부 인증 이후에도 이어져야 했는데, 중간값을 컴포넌트 메모리에만 두면 외부 인증을 다녀와 화면이 다시 열릴 때 사라집니다.',
				fix: '현재 단계는 주소에, 단계별 입력값은 세션 스토리지에 저장하고 화면이 다시 열리면 거기서 읽어 같은 단계로 돌아오게 했습니다.',
				basis: 'code',
				diagram: {
					actors: ['사용자', '연동 화면', '외부 인증'],
					steps: [
						{ from: 0, to: 1, label: '단계 2 진행: 주소와 세션 스토리지에 저장' },
						{ from: 1, to: 2, label: '본인인증을 위해 외부 인증으로 이동' },
						{ from: 2, to: 1, label: '인증을 마치고 돌아와 화면이 다시 열림, 메모리의 값은 사라짐', tone: 'problem' },
						{ from: 1, to: 0, label: '주소와 세션 스토리지에서 읽어 단계 2 복원', tone: 'fix' },
					],
				},
			},
			{
				problem: '기관 요청을 일괄 철회할 때 네트워크나 기관 쪽 문제로 일부 요청만 실패할 수 있었습니다.',
				fix: '기관 요청을 병렬로 보내 결과를 모은 뒤, 실패한 항목만 토스트로 안내했습니다.',
				basis: 'code',
				diagram: {
					actors: ['연결 관리 화면', '기관 1', '기관 2'],
					steps: [
						{ from: 0, to: 1, label: '철회 요청(병렬)' },
						{ from: 0, to: 2, label: '철회 요청(병렬)' },
						{ from: 1, to: 0, label: '성공' },
						{ from: 2, to: 0, label: '실패', tone: 'problem' },
						{ from: 0, to: 2, label: '실패한 항목만 토스트로 안내', tone: 'fix' },
					],
				},
			},
			{
				problem: 'KHIS·KOSCOM·NICE의 서로 다른 절차를 하나의 사용자 여정으로 연결해야 했습니다.',
				fix: '기관별 인증·동의·전송요구·전자서명 화면을 구현하고, 분야별 연동 여부를 기준으로 직접 접근을 차단했습니다.',
				basis: 'resume',
			},
		],
		checks: [
			'이 연동은 기관 심사에서 반려됐습니다. 본문은 성과를 쓰지 않고 구현 범위만 적었습니다. 반려 사유가 프론트엔드 구현과 관련 있었나요?',
			'소스가 현재 저장소에 없어 작업 문서와 QA 하위 작업 9건으로만 확인했습니다. 공개할 수 있는 화면 캡처가 있나요?',
			'세션 스토리지 정리 시점(성공·실패·이탈)을 어떻게 정했고, 민감 정보가 남지 않도록 어떤 점을 지켰나요?',
			'규제 요건 때문에 UX를 양보한 지점이 있었나요?',
		],
	},
	{
		slug: 'ai-chatbot-cms',
		decisions: [
			{
				question: '답변을 어떻게 보여 줄 것인가',
				options: [
					{
						name: '스트림으로 순차 반영',
						verdict: 'chosen',
						reason:
							'AI 설문 MVP에서 쓰던 스트림 처리 패턴을 가져와 빈 말풍선에 글자를 이어 붙이고 완료 이벤트에서 마무리합니다.',
						basis: 'code',
					},
				],
			},
			{
				question: '이전 대화를 불러올 때 읽던 위치를 어떻게 유지할 것인가',
				options: [
					{
						name: '추가된 높이만큼 스크롤 위치를 보정',
						verdict: 'chosen',
						reason: '그리기 전에 스크롤 위치를 보정해 이전 대화가 위에 붙어도 읽던 지점이 그대로 유지됩니다.',
						basis: 'code',
					},
				],
			},
		],
		troubles: [
			{
				problem:
					'이전 대화를 위에서 불러와 붙이면 읽던 위치가 밀립니다. 렌더링이 끝난 뒤 타이머로 되돌리는 방법은 시간을 정할 근거가 없어 환경이 다르면 어긋납니다.',
				fix: '그리기 전에 늘어난 높이만큼 스크롤 위치를 보정해 읽던 지점을 유지하고, 새 메시지를 보낸 경우에는 맨 아래로 내려가게 나눴습니다.',
				basis: 'code',
				diagram: {
					actors: ['사용자', '채팅 목록', '서버'],
					steps: [
						{ from: 0, to: 1, label: '위로 스크롤' },
						{ from: 1, to: 2, label: '이전 대화 10개 요청' },
						{ from: 2, to: 1, label: '응답: 항목이 목록 위에 붙음' },
						{ from: 1, to: 0, label: '스크롤 위치는 그대로라 읽던 내용이 아래로 밀림', tone: 'problem' },
						{ from: 1, to: 0, label: '그리기 전에 늘어난 높이만큼 스크롤 위치 보정', tone: 'fix' },
					],
				},
			},
			{
				problem: '답변이 만들어지는 동안 사용자가 빈 화면을 보며 기다리지 않아야 했습니다.',
				fix: '빈 말풍선을 먼저 만들고, 글자 조각이 올 때마다 마지막 말풍선에 이어 붙이다가 완료 이벤트에서 마무리했습니다.',
				basis: 'code',
				diagram: {
					actors: ['사용자', '채팅 화면', '답변 스트림'],
					steps: [
						{ from: 0, to: 1, label: '질문 전송: 내 말풍선과 빈 말풍선 표시' },
						{ from: 1, to: 0, label: '답변이 끝날 때까지 기다리면 빈 화면', tone: 'problem' },
						{ from: 2, to: 1, label: '글자 조각마다 마지막 말풍선에 이어 붙임', tone: 'fix' },
						{ from: 2, to: 1, label: '완료 이벤트: 입력 상태를 풀고 마무리', tone: 'fix' },
					],
				},
			},
			{
				problem: '스트림을 끈 설정에서 같은 답변이 두 번 표시됐습니다.',
				fix: '답변이 끝나면 대화 이력을 다시 불러오는데, 이력을 화면에 있던 메시지 뒤에 이어 붙이던 방식을 이력으로 목록을 새로 만들도록 바꿨습니다.',
				basis: 'code',
			},
		],
		checks: [
			'AI 설문 MVP에서 스트림 패턴을 검증한 경험을 구체적으로 설명해 줄 수 있나요?',
			'스트림 중 오류·중단·재시도는 어떻게 처리했나요?',
			'프롬프트·모델 설정, 통계 화면, 광고 정책은 본인 비중이 작거나 근거를 찾지 못해 본문에서 줄였습니다. 이 화면들에서 직접 한 일이 더 있나요?',
			'스트림 OFF 2회 표시의 원인을 한 문장으로 설명해 줄 수 있나요?',
		],
	},
	{
		slug: 'ai-chatbot-ssr',
		decisions: [
			{
				question: '고객사별 정보를 검색 엔진과 링크 미리보기에 어떻게 전달할 것인가',
				options: [
					{
						name: '고객사 코드로 조회한 설정을 서버에서 메타데이터·Open Graph로 생성',
						verdict: 'chosen',
						reason:
							'서버가 고객사 코드로 설정을 조회해 메타데이터를 채우므로 검색 엔진과 링크 미리보기가 고객사별 정보를 받습니다.',
						basis: 'code',
					},
					{
						name: '고객사별 메타데이터를 코드에 직접 작성',
						verdict: 'rejected',
						reason: '신규 고객사가 추가될 때마다 메타데이터를 코드에 직접 반영해야 해 고객사가 늘수록 부담이었습니다.',
						basis: 'resume',
					},
				],
			},
			{
				question: '메타데이터 값은 어디서 고칠 것인가',
				options: [
					{
						name: 'CMS의 OG 편집 화면에서 고치고 서버가 조회',
						verdict: 'chosen',
						reason: '값을 CMS에서 고치고 서버가 조회해 쓰므로 프론트엔드 배포 없이 반영됩니다.',
						basis: 'code',
					},
				],
			},
		],
		troubles: [
			{
				problem:
					'CSR 구조에서는 링크 미리보기와 검색 엔진이 받는 HTML에 고객사별 제목·설명·Open Graph를 담기 어려웠습니다.',
				fix: '서버가 고객사 코드로 설정을 조회해 메타데이터를 채우게 했습니다.',
				basis: 'resume',
				diagram: {
					actors: ['링크 미리보기', 'Next.js 서버', '고객사 설정'],
					steps: [
						{ from: 0, to: 1, label: '(CSR) JS를 실행하기 전 HTML에는 고객사별 메타가 없음', tone: 'problem' },
						{ from: 0, to: 1, label: '고객사 코드가 첫 칸인 주소로 요청' },
						{ from: 1, to: 2, label: '서버에서 코드로 고객사와 메타 설정 조회', tone: 'fix' },
						{ from: 2, to: 1, label: '제목·설명·OG 값' },
						{ from: 1, to: 0, label: 'head에 title과 og 태그를 채운 HTML 응답', tone: 'fix' },
					],
				},
			},
			{
				problem: '주소의 첫 칸이 고객사 코드가 되도록 라우트를 다시 짜야 했습니다.',
				fix: '라우트를 고객사 코드 아래로 재구성하고, 그 레이아웃에서 메타데이터를 만들게 했습니다.',
				basis: 'code',
			},
			{
				problem: '운영자가 OG 문구와 이미지를 코드 수정 없이 고치고 결과를 미리 봐야 했습니다.',
				fix: 'CMS에 OG 편집 화면을 만들어 이미지를 올리고, 저장 전에 링크 미리보기를 확인하게 했습니다.',
				basis: 'code',
				diagram: {
					actors: ['운영자', 'CMS', '이미지 저장소', '서버'],
					steps: [
						{ from: 0, to: 1, label: 'OG 문구 입력(폼 검증)과 이미지 선택' },
						{ from: 1, to: 2, label: '이미지 업로드' },
						{ from: 1, to: 0, label: '저장 전에 링크 미리보기로 확인' },
						{ from: 1, to: 3, label: '저장: 이후 서버가 조회해 메타로 사용', tone: 'fix' },
					],
					caption: '값이 CMS에 있으므로 프론트엔드를 다시 배포하지 않고 반영됩니다.',
				},
			},
		],
		checks: [
			'전환 전후에 검색 노출·링크 미리보기를 어떻게 확인했나요? (캡처, Search Console 등)',
			'sitemap과 robots, Next.js 초기 세팅은 다른 팀원이 작성한 것으로 확인해 본문에서 뺐습니다. 본인 몫은 라우트 재구성, 메타데이터 생성, CMS OG 편집이 맞나요?',
			'고객사 설정 조회를 어떻게 캐시했나요? CMS에서 값을 고친 뒤 실제 반영까지 시간이 얼마나 걸리나요?',
		],
	},
	{
		slug: 'swing-frontend',
		decisions: [
			{
				question: '2인 팀에서 개발 속도를 어떻게 확보할 것인가',
				options: [
					{
						name: '서비스 개발 전에 공통 기반(보일러플레이트·CMS UI 패키지)부터 구축',
						verdict: 'chosen',
						reason: '두 앱에 같은 보일러플레이트와 UI 패키지를 적용해 화면별 설정과 반복 UI를 일정하게 유지했습니다.',
						basis: 'resume',
					},
					{
						name: '화면부터 바로 개발',
						verdict: 'rejected',
						reason: '[확인 필요] 기반 작업을 먼저 한 이유가 무엇이었는지 작성자 확인 전 초안입니다.',
						basis: 'draft',
					},
				],
			},
		],
		troubles: [
			{
				problem: '계약을 수정하면 기존 첨부파일이 새로 올린 파일 목록으로 대체됐습니다.',
				fix: '일반·공급·용역 계약 수정 요청에서 기존 파일의 링크와 새 파일의 링크를 합쳐 보내게 했습니다.',
				basis: 'code',
				diagram: {
					actors: ['사용자', '계약 수정 화면', '서버'],
					steps: [
						{ from: 0, to: 1, label: '첨부파일이 있는 계약에 파일 1개 추가' },
						{ from: 1, to: 2, label: '새 파일만 전송', tone: 'problem' },
						{ from: 2, to: 1, label: '기존 첨부파일이 새 파일 목록으로 대체됨', tone: 'problem' },
						{ from: 1, to: 2, label: '기존 파일과 새 파일을 합쳐 전송', tone: 'fix' },
					],
				},
			},
			{
				problem: '웹 서비스의 인증과 Unity WebGL 가상 오피스 진입을 하나의 흐름으로 이어야 했습니다.',
				fix: '웹 로그인 토큰을 쿠키에 저장하고 진입 스크립트가 쿠키에서 읽어 인증하도록 연결했으며, 게스트는 예외로 두고 토큰이 없으면 로그인으로 돌려보냈습니다. Unity 개발은 담당하지 않았습니다.',
				basis: 'code',
				diagram: {
					actors: ['웹 서비스', '쿠키', '진입 스크립트'],
					steps: [
						{ from: 0, to: 1, label: '로그인: 토큰을 쿠키에 저장' },
						{ from: 2, to: 1, label: '가상 오피스 진입: 쿠키에서 토큰 읽기' },
						{ from: 2, to: 0, label: '토큰이 없으면 로그인 화면으로 보냄', tone: 'fix' },
						{ from: 2, to: 1, label: '게스트는 토큰 없이 진입' },
					],
				},
			},
			{
				problem: '계약 관리번호가 중복이면 일반적인 실패 알림만 떠서 무엇이 문제인지 알기 어려웠습니다.',
				fix: '서버가 충돌(409)로 응답하면 관리번호 입력 항목에 오류를 표시했습니다. 생성과 수정 모두 같은 방식입니다.',
				basis: 'code',
			},
		],
		checks: [
			'보일러플레이트에 담은 것(린트, 테스트, 배포 설정 등)과 직접 만든 CMS UI 컴포넌트 수는? CMS UI 저장소가 이 환경에 없어 확인하지 못했습니다.',
			'2인 팀에서 백엔드와 협업하며 정한 규칙(API 스펙, 에러 규약 등)이 있나요?',
			'본문의 "프론트엔드 단독 개발"은 README의 기여자 표기만으로는 확정할 수 없습니다. 맞는 표현인가요?',
			'첨부파일 수정 버그를 어떻게 재현하고 고친 뒤 확인했나요?',
			'Unity 자산을 환경별 S3 경로에서 받는 부분은 코드로 확인하지 못했습니다. 직접 한 작업이 맞나요?',
		],
	},
	{
		slug: 'avatar-studio-performance',
		decisions: [
			{
				question: '첫 화면을 막는 비용을 어떻게 줄일 것인가',
				options: [
					{
						name: '진입점을 lazy loading·Suspense로 분리',
						verdict: 'chosen',
						reason: '3D 렌더링이 첫 화면 표시를 막지 않고, 필요한 시점에 불러옵니다.',
						basis: 'resume',
					},
					{
						name: '아바타 파츠·JSON 자산을 S3·CDN으로 이전',
						verdict: 'chosen',
						reason: '대용량 정적 자산을 앱 번들에서 떼어 내 CDN 경로에서 받습니다.',
						basis: 'resume',
					},
				],
			},
			{
				question: '3D 뷰와 편집 기능을 어떻게 나눌 것인가',
				options: [
					{
						name: '편집 화면이 데이터를 계산하고 3D 뷰는 표시만',
						verdict: 'chosen',
						reason: '편집 화면이 표시할 메시와 텍스처를 계산하고 3D 뷰는 받은 값을 모델에 적용해 보여 주기만 합니다.',
						basis: 'code',
					},
				],
			},
		],
		troubles: [
			{
				problem:
					'3D 렌더링과 대용량 정적 자산이 초기 진입을 막아 3초 이상 빈 화면이 노출됐고, 3D·편집 로직이 큰 컴포넌트에 섞여 작은 기능 변경도 기존 동작에 영향을 주기 쉬웠습니다.',
				fix: '진입점 분리, 자산 CDN 이전, 역할별 컴포넌트 분리를 함께 적용해 Lighthouse FCP 기준 400~600ms로 줄였습니다.',
				basis: 'resume',
				diagram: {
					actors: ['사용자', '앱 진입점', '정적 자산 CDN'],
					steps: [
						{ from: 0, to: 1, label: '앱 접속' },
						{ from: 1, to: 2, label: '3D 렌더링과 대용량 자산을 모두 받은 뒤에야 표시', tone: 'problem' },
						{ from: 1, to: 0, label: '3초 이상 빈 화면', tone: 'problem' },
						{ from: 1, to: 0, label: '핵심 UI를 먼저 표시', tone: 'fix' },
						{ from: 1, to: 2, label: '3D 뷰와 자산은 필요한 시점에 지연 로드', tone: 'fix' },
					],
				},
			},
			{
				problem:
					'3D·편집 로직이 큰 컴포넌트에 섞여 있어, 업로드 이미지 같은 기능을 더하면 기존 렌더링 로직을 함께 고쳐야 했습니다.',
				fix: '편집 화면이 어떤 메시에 어떤 텍스처를 입힐지 계산하고, 3D 뷰는 받은 값을 모델에 적용하기만 하게 나눴습니다.',
				basis: 'code',
				diagram: {
					actors: ['편집 화면', '3D 뷰', '3D 모델'],
					steps: [
						{ from: 0, to: 1, label: '메시 이름과 텍스처 경로 전달' },
						{ from: 1, to: 2, label: '모델 불러오기' },
						{ from: 1, to: 2, label: '대상 메시에는 텍스처를 입히고, 나머지는 숨김', tone: 'fix' },
						{ from: 0, to: 1, label: '업로드 이미지가 있으면 기본 텍스처 경로를 덮어씀', tone: 'fix' },
					],
					caption: '무엇을 보일지는 편집 화면이, 어떻게 그릴지는 3D 뷰가 맡습니다.',
				},
			},
			{
				problem: '사용자가 올린 이미지가 아바타에 반영되지 않았고, 크기와 비율 제한도 필요했습니다.',
				fix: '업로드 이미지가 기본 텍스처를 덮어쓰게 하고, 16MB 제한과 정사각형 비율 검사를 거치게 했습니다.',
				basis: 'code',
			},
		],
		checks: [
			'병목을 찾을 때 쓴 도구와 과정(번들 분석, Network 탭 등)은? 개선 전후 Lighthouse 캡처가 남아 있나요? (3초 이상과 400~600ms의 측정 원자료를 찾지 못했습니다)',
			'외주사에서 인수한 코드에서 가장 위험했던 지점은 무엇이었나요?',
			'git 이력상 lazy App 진입점과 JSON 원격 조회는 선행 작성자의 초기 커밋에 이미 있었습니다. 본인이 추가하거나 바꾼 경계는 어디까지인가요?',
			'S3·CDN 이전은 경로 상수화, 자산 업로드, 배포 구조 변경 중 어디까지 직접 했나요?',
		],
	},
];

/** 운영 빌드에서는 확인이 끝난(resume, code) 항목만 보인다. 개발·테스트에서는 초안도 보인다. */
export const isVisible = (basis: Basis, env: string | undefined = process.env.NODE_ENV) =>
	basis === 'resume' || basis === 'code' || env !== 'production';

export const getStory = (slug: string) => STORIES.find(item => item.slug === slug);

/** 이 스토리에서 실제로 보이는 판단·문제 목록. 초안(draft)은 운영 빌드에서 걸러진다. */
export const getVisibleStory = (story: CaseStory | undefined) => ({
	decisions: (story?.decisions ?? [])
		.map(decision => ({ ...decision, options: decision.options.filter(option => isVisible(option.basis)) }))
		.filter(decision => decision.options.length > 0),
	troubles: (story?.troubles ?? []).filter(trouble => isVisible(trouble.basis)),
});
