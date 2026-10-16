/**
 * 사례별 "판단과 트러블슈팅" 데이터.
 * basis 가 resume 인 문장은 이력서 본문에 있는 사실을 풀어 쓴 것이다.
 * basis 가 draft 인 문장은 작성자 확인 전의 초안이라 운영 빌드에서는 렌더하지 않는다(isVisible).
 * 확인이 끝나면 basis 를 resume 으로 바꾼다. 확인할 질문은 checks 에 남긴다.
 */

export type Basis = 'resume' | 'draft';

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

export interface Trouble {
	/** 풀어야 했던 문제. 이력서에 적힌 요구·제약만 쓴다. */
	problem: string;
	fix: string;
	basis: Basis;
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
							'쿠폰·포인트 사용 내역만 API에 넘기고, API가 확정한 금액만 NICEPAY에 전달해 기준을 한 곳으로 모았습니다.',
						basis: 'resume',
					},
					{
						name: '화면이 계산한 금액을 그대로 전달',
						verdict: 'rejected',
						reason: '화면과 서버의 계산 결과가 다르면 PG 승인 금액 불일치로 이어집니다.',
						basis: 'resume',
					},
					{
						name: '화면이 계산하고 서버는 검증만',
						verdict: 'rejected',
						reason: '[확인 필요] 이 방식을 검토했는지, 버린 이유가 무엇인지 작성자 확인 전 초안입니다.',
						basis: 'draft',
					},
				],
			},
			{
				question: '주문·취소·반품·환불 상태를 어떻게 다룰 것인가',
				options: [
					{
						name: '하나의 주문 상태 흐름으로 연결',
						verdict: 'chosen',
						reason: '사용자 화면과 운영 어드민이 같은 주문 상태를 기준으로 동작하게 했습니다.',
						basis: 'resume',
					},
				],
			},
		],
		troubles: [
			{
				problem: '재고 소진·주문 만료·인증 실패가 발생해도 사용자가 다음 행동을 알 수 있어야 했습니다.',
				fix: '인증 결과는 사용자 취소·통신 실패 등 원인별로 안내하고, 재고 오류는 장바구니에서 다시 고르도록 연결했습니다.',
				basis: 'resume',
			},
		],
		checks: [
			'화면 계산 + 서버 검증 방식은 검토했나요? 검토했다면 버린 이유는?',
			'결제 승인 금액 불일치를 실제로 겪었거나 QA에서 재현한 적이 있나요? (없으면 시나리오로 유지)',
			'주문 상태는 몇 가지였고, 상태 전이에서 가장 까다로웠던 부분은?',
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
						reason: '검색어·카테고리·필터가 공유·새로고침·뒤로가기 뒤에도 복원됩니다.',
						basis: 'resume',
					},
					{
						name: '컴포넌트 안의 로컬 상태',
						verdict: 'rejected',
						reason: 'URL에 없으면 공유·새로고침·뒤로가기로 같은 검색 결과를 다시 볼 수 없습니다.',
						basis: 'resume',
					},
				],
			},
			{
				question: 'PC 사이드바와 모바일 드로어의 필터를 어떻게 만들 것인가',
				options: [
					{
						name: '같은 상태 로직을 공유',
						verdict: 'chosen',
						reason: '화면 모양만 다르고 필터 상태는 하나라서 PC와 모바일의 결과가 어긋나지 않습니다.',
						basis: 'resume',
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
					'PC에서도 600px 고정폭 모바일 화면이 노출됐고, 정책·답례품·동네소식·기부사업은 각 메뉴에 흩어져 있었습니다.',
				fix: '주요 화면을 PC 레이아웃으로 확장하고 카테고리별로 찾는 통합검색을 두어 서비스별로 따로 찾던 흐름을 한 화면으로 모았습니다.',
				basis: 'resume',
			},
		],
		checks: [
			'URL 동기화에서 가장 까다로웠던 지점(뒤로가기 히스토리 쌓임, 디바운스, SSR 초기값 등)은?',
			'PC 레이아웃 확장에서 반응형 기준점(breakpoint)과 컴포넌트 재사용 방식은?',
			'GA4 20% 증가 외에 검색 사용률·이탈률 같은 보조 지표가 있나요?',
			'검색어 변경만 push이고 필터는 replace인 이유는? 뒤로가기가 필터 단위가 아니라 검색어 단위로 동작하는 것이 의도인가요?',
			'정책 필터(usePolicyFilter)와 나머지 카테고리(useIntegratedSearchFilter)가 훅 두 개로 갈려 URL 쓰기 로직이 중복되는데 통합하지 않은 이유는?',
			'변하지 않은 값을 다시 선택하면 pendingRef가 남아 이후 URL 변경을 덮어쓸 수 있는데 확인했나요?',
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
						reason: '외부 이동 직전에 납부 식별값을 저장해 두고, 돌아오면 서버에 조회해 실제 완료 여부를 판별합니다.',
						basis: 'resume',
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
							'페이지 진입 때 이미 정산했더라도, 결제 버튼을 누르면 정산을 마친 뒤 최신 완료 이력을 다시 조회해 있으면 지자체와 금액을 보여 주고 사용자가 확인한 뒤 진행 여부를 선택하게 합니다.',
						basis: 'resume',
					},
					{
						name: '진입 시점의 상태만 믿고 결제',
						verdict: 'rejected',
						reason:
							'외부 화면에서 납부가 끝난 뒤 반영이 늦으면 진입 때 본 상태가 최신이 아닐 수 있어 같은 기부를 다시 시도할 수 있습니다.',
						basis: 'resume',
					},
				],
			},
		],
		troubles: [
			{
				problem:
					'앱·웹뷰를 벗어난 뒤에는 Wello가 진행 상태를 즉시 알기 어렵고, 납부 완료 반영이 늦으면 같은 기부를 다시 시도할 수 있었습니다.',
				fix: '진입 시 정산, 결제 시점의 최신 완료 이력 재조회, 복귀 시 납부 식별값 조회로 서버 상태를 기준으로 중복 기부를 재확인하게 했습니다.',
				basis: 'resume',
			},
		],
		checks: [
			'외부 지로 화면과 Wello 사이에서 상태가 어긋난 실제 사례나 문의가 있었나요? (문제를 알게 된 계기)',
			'앱·KB·토스 웹뷰와 일반 웹에서 복귀 방식이 달랐다면 어떤 차이를 어떻게 흡수했나요? (토스는 returnUrl 없이 화면 복귀 감지에 의존)',
			'정산·재조회가 실패하면 모달 없이 결제로 넘어가는 동작은 의도한 것인가요? 서버 측 중복 차단(멱등 키)은 검토했나요?',
			'결제 버튼을 연타하면 납부 식별값이 두 번 발급될 수 있는데, 서버에서 어떻게 막나요?',
			'CS 재문의 70% 감소는 어떤 기준(기간, CS 채널, 비교 대상)으로 확인했나요?',
		],
	},
	{
		slug: 'mydata-integration',
		decisions: [
			{
				question: '긴 연동 흐름의 중간값을 어디에 둘 것인가',
				options: [
					{
						name: '세션 스토리지에 단계별로 저장·정리',
						verdict: 'chosen',
						reason:
							'새로고침과 외부 인증 이후에도 흐름이 이어지도록 연동 중간값을 단계별로 저장하고, 끝나면 정리합니다.',
						basis: 'resume',
					},
					{
						name: '컴포넌트 메모리 상태만 사용',
						verdict: 'rejected',
						reason: '새로고침이나 외부 인증으로 화면이 다시 열리면 중간값이 사라져 흐름이 끊깁니다.',
						basis: 'resume',
					},
				],
			},
			{
				question: '일괄 철회에서 일부가 실패하면 어떻게 할 것인가',
				options: [
					{
						name: '기관 요청을 병렬 처리하고 실패한 항목만 안내',
						verdict: 'chosen',
						reason: '일부 실패에도 나머지 처리가 유지되고, 사용자는 실패한 항목만 다시 시도할 수 있습니다.',
						basis: 'resume',
					},
					{
						name: '하나라도 실패하면 전체를 실패로 처리',
						verdict: 'rejected',
						reason: '[확인 필요] 이 방식을 검토했는지 작성자 확인 전 초안입니다.',
						basis: 'draft',
					},
				],
			},
		],
		troubles: [
			{
				problem:
					'본인인증부터 약관 동의, 전송요구, 전자서명, 재동의, 철회, 전송 이력까지 긴 규제성 흐름이 새로고침과 외부 인증 이후에도 이어져야 했습니다.',
				fix: '본인인증 SDK의 스크립트 로딩과 콜백 순서를 커스텀 훅으로 감싸고, 연동 중간값은 세션 스토리지에 단계별로 저장·정리했습니다.',
				basis: 'resume',
			},
			{
				problem: 'KHIS·KOSCOM·NICE의 서로 다른 절차를 하나의 사용자 여정으로 연결해야 했습니다.',
				fix: '기관별 인증·동의·전송요구·전자서명 화면을 구현하고, 분야별 연동 여부를 기준으로 직접 접근을 차단했습니다.',
				basis: 'resume',
			},
		],
		checks: [
			'일괄 철회에서 일부 실패를 허용하고 실패한 항목만 안내하기로 한 이유는? 전체 롤백 같은 대안은 검토했나요?',
			'세션 스토리지 정리 시점(성공·실패·이탈)을 어떻게 정했고, 민감 정보가 남지 않도록 어떤 점을 지켰나요?',
			'규제 요건 때문에 UX를 양보한 지점이 있었나요?',
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
							'Modal·Alert·Table 등은 공통 디자인 시스템의 Modal·Button 조합으로, 캐러셀은 Embla Carousel로, 스와이프는 브라우저 Pointer Events 직접 구현으로 바꿨습니다.',
						basis: 'resume',
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
						name: '값을 그대로 보내야 하는 폼의 스키마를 느슨한 객체로 변경',
						verdict: 'chosen',
						reason:
							'선언하지 않은 필드가 제출 데이터에서 빠지지 않아, API 응답 전체를 폼 값으로 쓰는 화면에서도 값이 유지됩니다.',
						basis: 'resume',
					},
					{
						name: '모든 필드를 스키마에 선언',
						verdict: 'rejected',
						reason: '[확인 필요] 이 방식을 검토했는지, 버린 이유가 무엇인지 작성자 확인 전 초안입니다.',
						basis: 'draft',
					},
				],
			},
			{
				question: '폼 라이브러리 연결부를 어떻게 통일할 것인가',
				options: [
					{
						name: '입력·출력 타입이 다른 스키마도 받는 어댑터를 직접 작성',
						verdict: 'chosen',
						reason:
							'transform으로 입력과 출력 타입이 달라지는 스키마도 받을 수 있게, 스키마를 제약 없이 받아 검증 오류를 폼 라이브러리의 오류 형식으로 변환합니다.',
						basis: 'resume',
					},
					{
						name: '공식 resolver 패키지 사용',
						verdict: 'rejected',
						reason:
							'[확인 필요] 이 방식을 검토했는지, 버린 이유(버전·타입 제약 등)가 무엇인지 작성자 확인 전 초안입니다.',
						basis: 'draft',
					},
				],
			},
		],
		troubles: [
			{
				problem:
					'Chakra UI 기반 공통 컴포넌트와 yup 검증, 여러 서드파티 UI 라이브러리가 섞여 있어 모노레포의 다른 앱과 UI·검증 방식이 갈려 있었습니다.',
				fix: '컴포넌트와 서드파티 라이브러리를 공통 디자인 시스템과 단순한 구현으로 바꾸고, 검증은 Zod 하나로 통일했습니다.',
				basis: 'resume',
			},
			{
				problem: 'Zod가 스키마에 선언되지 않은 필드를 제출 데이터에서 제거했습니다.',
				fix: '값을 그대로 보내야 하는 폼의 스키마를 느슨한 객체로 바꿔 필드가 빠지지 않게 했습니다.',
				basis: 'resume',
			},
		],
		checks: [
			'Chakra와 Emotion 런타임을 걷어낸 뒤 번들 크기(First Load JS)나 렌더링 성능이 달라졌나요? 측정했다면 전후 값을 이력서 결과에 쓸 수 있습니다.',
			'느슨한 객체(looseObject)는 어느 화면에서 왜 필요했나요? 선언하지 않은 필드까지 제출될 때의 위험(과다 전송, 검증 우회)은 어떻게 봤나요? 폼 연결 어댑터 자체는 필드 제거를 막지 않는다는 점도 설명할 수 있어야 합니다.',
			'기본 resolver 대신 직접 만든 이유는 무엇인가요? (의존성 버전, 타입 제약) 타입 안전성을 잃는 대가는 어떻게 봤나요?',
			'같은 항목에 오류가 여러 개일 때 마지막 오류가 표시되는 한계를 알고 있나요?',
			'일괄 전환 대신 어댑터를 둔 점진 전환을 검토했나요? wello-biz에는 테스트가 없는데 회귀는 어떻게 확인했나요?',
		],
	},
	{
		slug: 'admin-session-refresh',
		decisions: [
			{
				question: '동시에 401을 받은 요청이 토큰 갱신을 어떻게 나눠 쓸 것인가',
				options: [
					{
						name: '진행 중인 refresh Promise를 공유해 첫 요청만 갱신',
						verdict: 'chosen',
						reason: '첫 요청만 refresh를 호출하고 나머지는 같은 결과를 기다립니다.',
						basis: 'resume',
					},
					{
						name: '요청마다 각자 refresh 호출',
						verdict: 'rejected',
						reason:
							'갱신용 토큰은 한 번 쓰면 무효가 되어, 동시에 거절된 요청이 각자 갱신하면 첫 요청만 성공하고 나머지는 만료로 처리돼 로그아웃됩니다.',
						basis: 'resume',
					},
				],
			},
			{
				question: '다른 탭·프레임이 먼저 갱신한 경우를 어떻게 다룰 것인가',
				options: [
					{
						name: '실패한 요청의 토큰과 쿠키 토큰을 비교',
						verdict: 'chosen',
						reason: '쿠키 토큰이 다르면 다른 앱이 이미 갱신한 것으로 보고 refresh 없이 쿠키의 토큰으로 재시도합니다.',
						basis: 'resume',
					},
					{
						name: '항상 refresh부터 호출',
						verdict: 'rejected',
						reason:
							'갱신용 토큰은 한 번 쓰면 무효가 되므로, 다른 탭이 이미 갱신했다면 같은 토큰으로 또 갱신하는 것은 실패합니다.',
						basis: 'resume',
					},
				],
			},
			{
				question: '웰로·웰로비즈 어드민의 로그인 쿠키를 어떻게 나눌 것인가',
				options: [
					{
						name: '접속 도메인별로 쿠키 범위를 분리',
						verdict: 'chosen',
						reason:
							'쿠키는 접속 도메인별로 분리하고, 상위 도메인에 남은 기존 쿠키는 옮기고 지워 두 어드민의 로그인이 서로 덮어쓰지 않게 했습니다.',
						basis: 'resume',
					},
					{
						name: '상위 도메인에 같은 이름으로 공유',
						verdict: 'rejected',
						reason:
							'웰로·웰로비즈 어드민을 각각 로그인해 함께 켜면 같은 이름의 쿠키가 서로의 로그인 정보를 덮어썼습니다.',
						basis: 'resume',
					},
				],
			},
		],
		troubles: [
			{
				problem: 'logout 요청이 401을 받으면 갱신 → 재시도 → 다시 401이 반복될 수 있습니다.',
				fix: 'logout 요청은 복구 대상에서 빼 무한 반복을 막았습니다.',
				basis: 'resume',
			},
		],
		checks: [
			'이전 증상은 "자동 갱신이 없어 직접 다시 로그인"이고, "refresh 중복"은 갱신을 만들 때 막아야 했던 동시성 위험입니다. 둘을 섞어 말하지 않도록 순서(증상 → 설계 이유)를 정리했나요?',
			'탭 2개에서 한쪽이 로그아웃되던 원인을 어떻게 설명하나요? (쿠키는 탭끼리 공유되지만 토큰은 탭 메모리에도 따로 있습니다)',
			'쿠키 범위를 바꾸면 이미 로그인한 사용자의 기존 쿠키는 어떻게 되나요? (옮기고 지우는 한 번짜리 이동 처리)',
			'갱신용 토큰이 한 번 쓰면 무효가 되는 건 서버 정책인가요? 두 번째 갱신이 실패했을 때 서버는 어떻게 응답하고, 클라이언트는 그걸 어떻게 처리하나요?',
			'Vue 쪽에는 쿠키 토큰 비교가 없습니다. iframe 안이라 같은 쿠키를 읽어서 필요 없다고 본 건가요, 아니면 시간상 빠진 건가요?',
			'refresh 자체가 실패하면(refresh 토큰 만료) 운영자는 어떤 경험을 하나요? 입력 중이던 내용은 어떻게 되나요?',
			'재시도하는 요청이 생성·수정처럼 두 번 실행되면 안 되는 요청이면 어떻게 되나요?',
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
							'AI 설문 MVP에서 검증한 스트림 처리·응답 상태 관리 패턴을 적용해 OpenAI Assistants의 답변을 대화 화면에 순차로 반영했습니다.',
						basis: 'resume',
					},
					{
						name: '답변이 끝난 뒤 한 번에 표시',
						verdict: 'rejected',
						reason: '답변 생성 시간을 빈 화면으로 기다리게 됩니다.',
						basis: 'resume',
					},
				],
			},
			{
				question: '이전 대화를 불러올 때 읽던 위치를 어떻게 유지할 것인가',
				options: [
					{
						name: '추가된 높이만큼 스크롤 위치를 보정',
						verdict: 'chosen',
						reason: '이전 대화가 위에 붙어도 사용자가 읽던 지점이 그대로 유지됩니다.',
						basis: 'resume',
					},
				],
			},
		],
		troubles: [
			{
				problem: '긴 대화 이력을 불러와도 사용자가 읽던 위치를 유지해야 했습니다.',
				fix: '이전 대화를 불러올 때 추가된 높이만큼 스크롤 위치를 보정했습니다. 관련 글에 과정을 정리했습니다.',
				basis: 'resume',
			},
		],
		checks: [
			'AI 설문 MVP에서 스트림 패턴을 검증한 경험을 구체적으로 설명해 줄 수 있나요?',
			'스트림 중 오류·중단·재시도는 어떻게 처리했나요?',
			'CMS에서 가장 설계가 어려웠던 화면과 이유는?',
		],
	},
	{
		slug: 'ai-chatbot-ssr',
		decisions: [
			{
				question: '고객사별 정보를 검색 엔진에 어떻게 전달할 것인가',
				options: [
					{
						name: 'Next.js 15 App Router로 서버에서 메타데이터·Open Graph 생성',
						verdict: 'chosen',
						reason:
							'고객사 코드로 조회한 설정을 서버에서 반영해, 검색 엔진과 링크 미리보기가 고객사별 정보를 받습니다.',
						basis: 'resume',
					},
					{
						name: 'CSR 유지 + 코드에 직접 반영',
						verdict: 'rejected',
						reason:
							'신규 고객사가 추가될 때마다 메타데이터와 검색 노출 경로를 코드에 직접 반영해야 해 확장에 불리합니다.',
						basis: 'resume',
					},
				],
			},
			{
				question: '사이트맵은 무엇을 기준으로 만들 것인가',
				options: [
					{
						name: '고객사 코드 목록 API를 기준으로 생성',
						verdict: 'chosen',
						reason: '새 고객사가 추가되면 검색 경로가 자동으로 포함됩니다.',
						basis: 'resume',
					},
				],
			},
		],
		troubles: [
			{
				problem: 'CSR 구조에서는 검색 엔진과 링크 미리보기에 고객사별 정보를 안정적으로 전달하기 어려웠습니다.',
				fix: '서버에서 조회한 고객사 설정으로 제목·설명·다국어 Open Graph와 사이트맵을 만들었습니다.',
				basis: 'resume',
			},
		],
		checks: [
			'전환 전후에 검색 노출·링크 미리보기를 어떻게 확인했나요? (캡처, Search Console 등)',
			'CSR에서 SSR로 옮기며 가장 까다로웠던 부분(인증, 클라이언트 전용 코드 등)은?',
			'고객사 설정 조회를 어떻게 캐시했나요?',
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
						reason:
							'사용자 웹용 Webpack 5, CMS용 Vite 보일러플레이트와 CMS UI 패키지를 먼저 만들고 두 앱에 같은 방식으로 적용해 화면별 설정과 반복 UI를 일정하게 유지했습니다.',
						basis: 'resume',
					},
					{
						name: '화면부터 바로 개발',
						verdict: 'rejected',
						reason:
							'[확인 필요] 기반 작업을 먼저 한 이유(시간 비용 대비 기대 효과)가 무엇이었는지 작성자 확인 전 초안입니다.',
						basis: 'draft',
					},
				],
			},
			{
				question: 'Unity WebGL 자산을 어떻게 가져올 것인가',
				options: [
					{
						name: '환경별 S3 경로에서 받아 빌드에 포함',
						verdict: 'chosen',
						reason: 'Unity 자산을 환경별 경로로 관리해 개발·운영 환경이 같은 방식으로 동작합니다.',
						basis: 'resume',
					},
				],
			},
		],
		troubles: [
			{
				problem: '웹 서비스의 인증과 Unity WebGL 가상 오피스 진입을 하나의 흐름으로 이어야 했습니다.',
				fix: '웹 토큰을 가상 오피스 진입 과정에 연결해 인증부터 진입까지 하나의 흐름으로 완성했습니다.',
				basis: 'resume',
			},
		],
		checks: [
			'웹 토큰을 Unity로 넘기는 방식(쿼리, postMessage, 쿠키 등)은 무엇이었나요?',
			'보일러플레이트에 담은 것(린트, 테스트, 배포 설정 등)과 직접 만든 CMS UI 컴포넌트 수는?',
			'2인 팀에서 백엔드와 협업하며 정한 규칙(API 스펙, 에러 규약 등)이 있나요?',
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
						name: '역할별 컴포넌트·훅으로 분리',
						verdict: 'chosen',
						reason: '신규 기능이 기존 렌더링 로직에 직접 의존하지 않게 변경 경계를 나눴습니다.',
						basis: 'resume',
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
			},
		],
		checks: [
			'병목을 찾을 때 쓴 도구와 과정(번들 분석, Network 탭 등)은? 개선 전후 Lighthouse 캡처가 남아 있나요?',
			'외주사에서 인수한 코드에서 가장 위험했던 지점은 무엇이었나요?',
			'공개 가능한 아바타 스튜디오 화면이나 녹화가 있나요? (3D 전시에 실제 화면을 쓰고 싶습니다)',
		],
	},
];

/** 운영 빌드에서는 확인이 끝난(resume) 항목만 보인다. 개발·테스트에서는 초안도 보인다. */
export const isVisible = (basis: Basis, env: string | undefined = process.env.NODE_ENV) =>
	basis === 'resume' || env !== 'production';

export const getStory = (slug: string) => STORIES.find(item => item.slug === slug);
