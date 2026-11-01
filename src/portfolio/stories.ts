/**
 * 사례별 "판단과 트러블슈팅" 데이터.
 * basis 가 resume 인 문장은 이력서 본문에 있는 사실을 풀어 쓴 것이다.
 * basis 가 code 인 문장은 코드나 커밋, 본인이 쓴 작업 기록에서 확인한 사실이다(운영에서도 보인다).
 * basis 가 draft 인 문장은 작성자 확인 전의 초안이라 운영 빌드에서는 렌더하지 않는다(isVisible).
 * 확인이 끝나면 basis 를 resume 으로 바꾼다. 확인할 질문은 checks 에 남긴다.
 */

export type Basis = 'resume' | 'code' | 'draft';

export interface DecisionOption {
	/** 실제 작업에서 이 방식이 차지한 지위. */
	label: string;
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
						label: '지금 접근',
						name: '서버가 금액을 확정',
						verdict: 'chosen',
						reason: '쿠폰·포인트 선택 내역만 체크아웃 API에 넘기고, 응답에 담긴 확정 금액을 결제사에 보냅니다.',
						basis: 'code',
					},
					{
						label: '처음 접근',
						name: '화면이 계산하고 서버는 검증만',
						verdict: 'rejected',
						reason: '개발 중에 화면 합계와 체크아웃 API 금액이 실제로 달라져 이 방식을 버렸습니다.',
						basis: 'resume',
					},
				],
			},
		],
		troubles: [
			{
				problem: '어느 금액을 결제사로 보낼 것인가',
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
				},
			},
			{
				problem: '결제 직전에 재고가 소진되거나 주문이 만료될 때',
				fix: '결제 버튼을 누르면 체크아웃을 다시 호출해 서버가 재고와 쿠폰을 검증하게 하고, 재고 오류는 안내 창으로 알린 뒤 장바구니에서 다시 고르게 했습니다.',
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
				problem: '주문 상태마다 다른 구매 후 버튼과 어드민 반품 상태',
				fix: '프론트엔드 코드 한 곳에서 서버 주문 상태를 읽어 버튼 목록을 정하고, 버튼 컴포넌트는 그 목록을 그리기만 하게 했습니다.',
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
		decisions: [],
		troubles: [
			{
				problem: '필터를 누를 때마다 뒤로가기 기록이 쌓이지 않게 하기',
				fix: '검색어를 바꾸면 push로 기록을 남기고 페이지를 첫 장으로 돌리며, 필터·정렬은 replace로 현재 기록만 바꿉니다. 새로고침이나 공유 링크로 들어오면 주소에서 조건을 읽어 상태를 복원합니다.',
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
				problem: '상위 지역을 바꿔도 이전 하위 지역이 남는 문제',
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
				problem: '직접 고친 주소나 오래된 링크의 잘못된 페이지·정렬 값',
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
			'PC와 모바일 필터를 화면별로 따로 구현했다가 어긋난 경험이 있었나요? 있었다면 판단 카드로 되살립니다.',
		],
	},
	{
		slug: 'wellobiz-chakra-zod',
		decisions: [
			{
				question: '기존 화면 도구와 공통 부품을 어떻게 바꿀 것인가',
				options: [
					{
						label: '바꾼 방식',
						name: '공통 디자인 시스템과 더 단순한 구현으로 대체',
						verdict: 'chosen',
						reason:
							'대화창·알림·표는 공통 디자인 시스템으로, 카드 슬라이드는 Embla Carousel로, 패널 크기 조절은 Pointer Events 직접 구현으로 바꿨습니다.',
						basis: 'code',
					},
					{
						label: '기존 방식',
						name: 'Chakra UI·Swiper 등 화면 도구를 직접 사용',
						verdict: 'rejected',
						reason: '다른 앱은 공통 디자인 시스템을 쓰고 있어 Wello-biz의 화면 구성 방식이 갈려 있었습니다.',
						basis: 'resume',
					},
				],
			},
		],
		troubles: [
			{
				problem: '패널을 빠르게 끌면 드래그를 놓치는 문제',
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
				problem: '배열·객체 안 필드의 검증 오류 표시',
				fix: '직접 만든 resolver가 배열·객체 안에서 오류가 난 위치를 따라 검증 결과를 연결해, 해당 입력 칸에 오류가 표시되게 했습니다.',
				basis: 'code',
			},
			{
				problem: 'Zod가 선언하지 않은 값을 제출 데이터에서 지우는 문제',
				fix: '값을 그대로 보내야 하는 폼의 검증 설정을 looseObject로 바꿔 필드가 빠지지 않게 했습니다.',
				basis: 'resume',
			},
		],
		checks: [
			'looseObject는 어느 화면에서 왜 필요했나요? 선언하지 않은 필드까지 제출될 때의 위험(과다 전송, 검증 우회)은 어떻게 봤나요?',
			'기본 resolver 대신 직접 만든 이유는 무엇인가요? (의존성 버전, 타입 제약) 타입 안전성을 잃는 대가는 어떻게 봤나요?',
			'같은 항목에 오류가 여러 개일 때 마지막 오류가 표시되는 한계를 알고 있나요?',
			'일괄 전환 대신 어댑터를 둔 점진 전환을 검토했나요? 테스트가 없는데 회귀는 어떻게 확인했나요?',
			'번들 크기 변화를 앱 단위로 재 볼 수 있나요? 지금은 수치를 싣지 않았습니다.',
			'모든 필드를 스키마에 선언하는 방식을 looseObject 대신 검토했나요? 했다면 판단 카드로 되살립니다.',
		],
	},
	{
		slug: 'admin-session-refresh',
		decisions: [],
		troubles: [
			{
				problem: '같은 탭의 요청 여러 개가 동시에 401을 받을 때',
				fix: '같은 탭 안에서 진행 중인 갱신 Promise를 함께 기다리게 했고, 다른 탭이 먼저 갱신했는지는 쿠키 토큰 비교로 확인했습니다.',
				basis: 'resume',
				diagram: {
					actors: ['같은 탭 요청 A', '같은 탭 요청 B', '인증 서버'],
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
				problem: '다른 탭이 먼저 토큰을 갱신했을 때',
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
				problem: '로그아웃·갱신 요청이 401 복구를 되풀이하는 문제',
				fix: '로그아웃 요청은 복구 대상에서 빼고, 갱신은 인터셉터를 거치지 않는 별도 요청으로 보냈습니다.',
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
		decisions: [],
		troubles: [
			{
				problem: '정산이 끝나기 전에 최신 이력을 조회하면 생기는 중복',
				fix: '진입할 때 정산 요청을 한 번 보내 Promise를 보관하고, 결제 버튼을 누르면 그 결과를 기다린 뒤 최신 완료 이력을 조회하게 순서를 고정했습니다.',
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
				problem: '토스로 넘어갈 때의 화면 전환을 복귀로 오인하는 문제',
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
				problem: '환경마다 다른 외부 납부 이동·복귀 방식',
				fix: '환경마다 이동 방식을 나누되 이동 직전에 납부 식별값 등을 저장해 두고, 복귀 뒤에는 모두 같은 서버 조회를 거치게 했습니다.',
				basis: 'code',
			},
		],
		checks: [
			'앱·KB·토스 웹뷰와 일반 웹에서 복귀 방식이 달랐다면 어떤 차이를 어떻게 흡수했나요?',
			'결제 버튼을 연타하면 납부 식별값이 두 번 발급될 수 있는데, 서버에서 어떻게 막나요? 서버 측 중복 차단(멱등 키)은 검토했나요?',
			'CS 재문의 약 70% 감소는 담당자 전언이라 본문에 그렇게 적었습니다. 기간·채널·비교 대상을 담당자에게 다시 물어볼 수 있나요?',
			'정산이나 최신 이력 조회가 실패했을 때의 동작은 본문에서 설명하지 않았습니다. 의도한 동작인지 따로 확인이 필요합니다.',
			'외부 화면의 완료 응답을 그대로 믿는 방식을 검토했나요? 했다면 판단 카드로 되살립니다.',
		],
	},
	{
		slug: 'mydata-integration',
		decisions: [],
		troubles: [
			{
				problem: '외부 인증을 다녀오면 사라지는 진행 단계와 입력값',
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
				problem: '일괄 철회 중 일부 기관만 실패할 때',
				fix: '기관 요청을 병렬로 보내 결과를 모은 뒤, 실패한 항목만 토스트로 알렸습니다.',
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
				problem: '기관마다 다른 절차를 하나의 사용자 여정으로 잇기',
				fix: '기관별 인증·동의·전송요구·전자서명 화면을 구현하고, 분야별 연동 여부를 기준으로 해당 분야 화면에 주소로 바로 들어오는 접근을 제한했습니다.',
				basis: 'resume',
			},
		],
		checks: [
			'소스가 현재 저장소에 없어 작업 문서와 QA 하위 작업 9건으로만 확인했습니다. 공개할 수 있는 화면 캡처가 있나요?',
			'세션 스토리지 정리 시점(성공·실패·이탈)을 어떻게 정했고, 민감 정보가 남지 않도록 어떤 점을 지켰나요?',
			'규제 요건 때문에 UX를 양보한 지점이 있었나요?',
		],
	},
	{
		slug: 'ai-chatbot-cms',
		decisions: [
			{
				question: '고객사별 정보를 검색 엔진과 링크 미리보기에 어떻게 전달할 것인가',
				options: [
					{
						label: '이 방법',
						name: '고객사 코드로 조회한 설정을 서버에서 메타데이터·Open Graph로 생성',
						verdict: 'chosen',
						reason:
							'서버가 고객사 코드로 설정을 조회해 메타데이터를 채우므로 검색 엔진과 링크 미리보기가 고객사별 정보를 받습니다.',
						basis: 'code',
					},
					{
						label: '다른 방법',
						name: '고객사별 페이지 정보를 코드에 직접 작성',
						verdict: 'rejected',
						reason: '신규 고객사가 추가될 때마다 메타데이터를 코드에 직접 반영해야 해 고객사가 늘수록 부담이었습니다.',
						basis: 'resume',
					},
				],
			},
			{
				question: '이전 대화를 불러올 때 읽던 위치를 어떻게 유지할 것인가',
				options: [
					{
						label: '적용한 방식',
						name: '추가된 높이만큼 스크롤 위치를 보정',
						verdict: 'chosen',
						reason:
							'목록 위에 대화를 추가하기 전후의 높이 차이만큼 스크롤 위치를 옮겨, 화면이 그려질 때 읽던 내용이 같은 자리에 보이게 합니다.',
						basis: 'code',
					},
					{
						label: '검토한 방식',
						name: '화면이 그려진 뒤 타이머로 위치를 되돌림',
						verdict: 'rejected',
						reason: '타이머 시간을 정할 근거가 없어 실행 환경이 달라지면 읽던 위치와 어긋날 수 있었습니다.',
						basis: 'code',
					},
				],
			},
		],
		troubles: [
			{
				problem: 'CSR에서 고객사별 메타데이터를 링크 미리보기에 전달하기',
				fix: '고객사 코드 아래로 라우트를 재구성하고 서버가 설정을 조회해 메타데이터를 채우며, 메인 페이지는 도메인 헤더로 한국어·일본어 메타데이터를 고르게 했습니다. CMS에서 OG 문구·이미지를 편집하고 저장 전 미리보기를 확인하면 프론트엔드 재배포 없이 반영됩니다.',
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
				problem: '이전 대화를 위에 붙이면 밀리는 읽던 위치',
				fix: '목록 위에 대화를 추가하기 전후의 높이 차이만큼 스크롤 위치를 옮긴 뒤 화면을 그려 읽던 지점을 유지하고, 새 메시지를 보낸 경우에는 맨 아래로 내려가게 나눴습니다.',
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
				problem: '답변 생성 중 빈 화면과 이력 재조회 시 중복 표시',
				fix: '스트림은 빈 말풍선에 글자 조각을 이어 붙이고 완료 이벤트에서 마무리했습니다. 폴링 후 불러온 이력은 기존 메시지에 이어 붙이지 않고 목록을 새로 만들었습니다.',
				basis: 'code',
			},
		],
		checks: [
			'[code]/layout.tsx의 generateMetadata와 메타 조회 함수, 라우트 재구성, 메인 도메인 헤더의 ko/jp 메타, CMS OG 편집은 본인 작업으로 확인됐습니다. sitemap·robots와 Next.js 초기 세팅은 다른 팀원의 작업입니다.',
			'고객사 설정 조회를 어떻게 캐시했나요? CMS에서 값을 고친 뒤 실제 반영까지 시간이 얼마나 걸리나요?',
			'스트림 중 오류·중단·재시도는 어떻게 처리했나요?',
			'프롬프트·모델 설정·비용 통계·광고 정책은 본인 몫이 작거나 근거가 없어 공개 문구에서 뺐습니다(광고 on/off·관리 화면 일부만 본인 작업).',
		],
	},
	{
		slug: 'swing-frontend',
		decisions: [],
		troubles: [
			{
				problem: '계약 수정 시 기존 첨부파일이 새 목록으로 대체되는 문제',
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
				problem: '웹 인증과 가상 오피스 진입 연결',
				fix: '게스트는 토큰 없이 진입하도록 두고, 로그인 사용자는 진입 스크립트가 쿠키의 토큰을 읽어 인증하게 했으며, 게스트가 아닌데 토큰이 없으면 로그인으로 돌려보냈습니다.',
				basis: 'code',
				diagram: {
					actors: ['웹 서비스', '쿠키', '진입 스크립트'],
					steps: [
						{ from: 0, to: 1, label: '로그인: 토큰을 쿠키에 저장' },
						{ from: 2, to: 1, label: '가상 오피스 진입: 쿠키에서 토큰 읽기' },
						{ from: 2, to: 0, label: '게스트가 아닌데 토큰이 없으면 로그인으로 이동', tone: 'fix' },
						{ from: 2, to: 1, label: '게스트는 토큰 없이 진입' },
					],
				},
			},
			{
				problem: '계약 관리번호 중복 시 원인을 알 수 없는 실패 알림',
				fix: '서버가 409를 보내면 관리번호 입력 항목에 오류를 표시했습니다. 생성과 수정 모두 같은 방식입니다.',
				basis: 'code',
			},
		],
		checks: [
			'보일러플레이트에 담은 것(린트, 테스트, 배포 설정 등)과 직접 만든 CMS UI 컴포넌트 수는? CMS UI 저장소가 이 환경에 없어 확인하지 못했습니다.',
			'백엔드 개발자들과 협업하며 정한 규칙(API 스펙, 에러 규약 등)이 있나요?',
			'서비스 웹은 단독 개발, 관리자 CMS는 다른 개발자의 기여(공지 페이지 등)가 있어 본문을 이렇게 구분했습니다. CMS에서 본인 몫은 어디까지인가요?',
			'첨부파일 수정 버그를 어떻게 재현하고 고친 뒤 확인했나요?',
			'Unity 빌드를 S3에서 받는 부분은 startup-wing-front/down.sh 로 확인했습니다(버킷은 dev 하나). 이 스크립트와 빌드 포함 설정을 직접 작성했나요?',
			'보일러플레이트·UI 패키지를 화면 개발보다 먼저 만든 이유는 무엇이었나요?',
		],
	},
	{
		slug: 'avatar-studio-performance',
		decisions: [],
		troubles: [
			{
				problem: '편집 화면이 계산하고 3D 뷰는 적용만 하는 구조',
				fix: '3D 뷰는 메시 이름과 텍스처 경로만 받아 적용하므로, 업로드 이미지는 편집 화면에서 기본 텍스처 경로를 덮어쓰는 것으로 반영됩니다.',
				basis: 'code',
				diagram: {
					actors: ['편집 화면', '3D 뷰', '3D 모델'],
					steps: [
						{ from: 0, to: 0, label: '어떤 메시에 어떤 텍스처를 입힐지 계산' },
						{ from: 0, to: 1, label: '메시 이름과 텍스처 경로 전달' },
						{ from: 1, to: 2, label: '모델 불러오기' },
						{ from: 1, to: 2, label: '받은 값대로 대상 메시에 텍스처를 입히고 나머지는 숨김', tone: 'fix' },
						{ from: 0, to: 1, label: '업로드 이미지가 있으면 기본 텍스처 경로를 덮어써 전달', tone: 'fix' },
					],
				},
			},
			{
				problem: '업로드 이미지 반영과 크기·비율 제한',
				fix: '업로드 이미지가 기본 텍스처를 덮어쓰게 하고, 16MB 제한과 정사각형 비율 검사를 거치게 했습니다.',
				basis: 'code',
			},
		],
		checks: [
			'Lighthouse 로 사용자가 측정(확인됨): FCP 3초 이상에서 400~600ms. Suspense 경계 및 CDN 경로 상수화와 FCP 개선의 인과는 확인되지 않았습니다.',
			'외주사에서 인수한 코드에서 가장 위험했던 지점은 무엇이었나요?',
			'lazy App 진입점·JSON 원격 조회는 선행 작성자의 초기 커밋, Suspense 경계는 View3D 의 본인 작업으로 확인됐습니다. 본인이 추가하거나 바꾼 경계는 이 밖에 어디까지인가요?',
			'CDN 호스트 하드코딩과 서버의 CDN URL 전환은 선행 작성자 작업으로 확인했습니다. 본인 몫을 환경 변수 상수화로 한정한 것이 맞나요?',
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
