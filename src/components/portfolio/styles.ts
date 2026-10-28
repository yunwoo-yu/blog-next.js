/**
 * 포트폴리오 공용 스타일 상수. 컴포넌트와 아이콘을 가져오지 않는 순수 문자열 파일이다.
 * 클라이언트 컴포넌트(PrintButton 등)도 쓰므로 여기에 데이터·아이콘 import 를 넣지 않는다(번들 분리 테스트가 지킨다).
 */

export const FOCUS_RING =
	'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pf-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white';

/** 파랑 면 버튼의 공통 색(흰 글자). 호버는 한 단계 진한 파랑. */
export const PRIMARY_BUTTON_CLASS = 'bg-pf-blue-700 text-white hover:bg-pf-blue-800';

/** 본문 크기의 링크. 파랑 500 은 본문 크기에서 대비가 모자라 700 을 쓰고 밑줄로 링크임을 드러낸다. */
export const TEXT_LINK_CLASS = 'font-medium text-pf-blue-700 underline underline-offset-4 hover:no-underline';
