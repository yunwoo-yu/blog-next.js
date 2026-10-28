import { PRINT_FOOTER_LABEL } from '@/portfolio/print';

/** 꼬리말 왼쪽 문구(표지는 없음). 첫 쪽 규칙은 이 뒤에 와야 이긴다. CSS 파일이 아니라 상수에서 만들어, 이름이 바뀌어도 한 곳만 고치게 한다. */
const PrintPageStyle = () => (
	<style>{`@page pf-print { @bottom-left { content: ${JSON.stringify(PRINT_FOOTER_LABEL)}; } } @page pf-print:first { @bottom-left { content: none; } }`}</style>
);

export default PrintPageStyle;
