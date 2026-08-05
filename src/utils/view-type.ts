export type ViewType = 'list' | 'card';

/**
 * localStorage가 아니라 쿠키에 둔다.
 * 목록 페이지는 요청 시점에 렌더되므로 서버가 쿠키를 읽어 첫 화면부터 올바른 뷰로 그릴 수 있다.
 * localStorage였다면 서버가 알 수 없어 리스트 뷰가 한 번 그려졌다가 카드 뷰로 바뀐다.
 */
export const VIEW_TYPE_COOKIE = 'blog-view-type';

export const VIEW_TYPE_MAX_AGE = 60 * 60 * 24 * 365;

export const parseViewType = (value?: string | null): ViewType => (value === 'card' ? 'card' : 'list');
