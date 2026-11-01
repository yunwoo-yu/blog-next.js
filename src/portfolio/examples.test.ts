import { PORTFOLIO_CASES } from './cases';
import {
	EXAMPLE_DOMAIN,
	EXAMPLE_FORBIDDEN_TERMS,
	EXAMPLE_ILLUSTRATIVE_NOTE,
	EXAMPLE_NOTICE,
	EXAMPLE_SCREENS,
	type ExampleScreen,
	getExampleScreen,
} from './examples';

/** 예시 하나에서 화면·보조기기로 나가는 모든 문자열(slug·kind 같은 식별자는 뺀다). */
const collectTexts = (example: ExampleScreen) => {
	const texts: string[] = [];
	const walk = (value: unknown) => {
		if (typeof value === 'string') texts.push(value);
		else if (Array.isArray(value)) value.forEach(walk);
		else if (value && typeof value === 'object') Object.values(value).forEach(walk);
	};

	walk([example.title, example.alt, example.caption, example.data]);

	return texts;
};

const findForbidden = (text: string) =>
	EXAMPLE_FORBIDDEN_TERMS.filter(term =>
		/[A-Za-z]/.test(term) ? text.toLowerCase().includes(term.toLowerCase()) : text.includes(term),
	);

describe('예시 화면 데이터', () => {
	it('모든 사례에 예시가 정확히 하나씩 있고, 없는 사례를 가리키지 않는다', () => {
		const slugs = EXAMPLE_SCREENS.map(example => example.slug);
		const caseSlugs = PORTFOLIO_CASES.map(item => item.slug);

		expect(new Set(slugs).size).toBe(slugs.length);
		expect([...slugs].sort()).toEqual([...caseSlugs].sort());
		for (const slug of caseSlugs) expect(getExampleScreen(slug)?.slug, slug).toBe(slug);
	});

	it('표기 문구가 정해진 문장이고, 모든 예시에 제목·alt·한 줄 caption 이 있다', () => {
		expect(EXAMPLE_NOTICE).toBe(
			'예시 화면 · 개념을 보여 주기 위해 새로 만든 가상의 화면이며 실제 서비스 화면이 아닙니다',
		);
		for (const example of EXAMPLE_SCREENS) {
			expect(example.title.trim(), example.slug).not.toBe('');
			expect(example.alt.trim().length, example.slug).toBeGreaterThan(20);
			expect(example.caption.trim(), example.slug).not.toBe('');
			expect(example.caption, example.slug).not.toContain('\n');
		}
	});

	it('사례가 실제 화면에 있었다고 말하지 않는 설명용 요소를 그린 예시는 caption 에 그 사실을 적는다', () => {
		expect(EXAMPLE_ILLUSTRATIVE_NOTE).toBe('강조 표시와 안내 문구는 설명을 위한 것입니다.');
		for (const slug of ['admin-session-refresh', 'mydata-integration', 'ai-chatbot-cms'])
			expect(getExampleScreen(slug)?.caption.endsWith(` ${EXAMPLE_ILLUSTRATIVE_NOTE}`), slug).toBe(true);
	});

	it('특정 서비스 어투(~어요)를 흉내 내지 않고 "~입니다"·명사형으로 쓴다', () => {
		for (const example of EXAMPLE_SCREENS) {
			for (const text of collectTexts(example))
				expect(text, `${example.slug}: ${text}`).not.toMatch(/[어아해]요(?=[\s.?!"]|$)/);
		}
	});

	it('kind 는 사례마다 다르다(사례별 작은 레이아웃)', () => {
		const kinds = EXAMPLE_SCREENS.map(example => example.kind);

		expect(new Set(kinds).size).toBe(kinds.length);
	});

	it('실제 서비스·회사·제품·기관 이름이 데이터·alt·caption 어디에도 없다', () => {
		// 검사기가 실제로 잡는지 먼저 확인한다(빈 검사로 통과하지 않게).
		expect(findForbidden('웰로 앱과 wello, 토스 결제')).toEqual(['웰로', 'Wello', '토스']);
		for (const example of EXAMPLE_SCREENS) {
			for (const text of collectTexts(example)) expect(findForbidden(text), `${example.slug}: ${text}`).toEqual([]);
		}
	});

	it('주소·이메일은 예약 도메인만, 전화번호·외부 이미지·실제 링크는 없다', () => {
		for (const example of EXAMPLE_SCREENS) {
			expect(example.data.address.split('/')[0].endsWith(`.${EXAMPLE_DOMAIN}`), example.slug).toBe(true);
			for (const text of collectTexts(example)) {
				expect(text, example.slug).not.toMatch(/https?:\/\//);
				expect(text, example.slug).not.toMatch(/\.(png|jpe?g|gif|webp|svg)\b/i);
				expect(text, example.slug).not.toMatch(/\d{2,3}-\d{3,4}-\d{4}/);
				// 이메일·호스트처럼 보이는 값은 예약 도메인 아래여야 한다(완성되지 않은 hong@example 같은 오류 예시는 허용).
				for (const host of text.match(/[\w-]+(?:\.[\w-]+)+\.(?:com|net|kr|io|co|org|test)\b/g) ?? [])
					expect(host.endsWith(`.${EXAMPLE_DOMAIN}`), `${example.slug}: ${host}`).toBe(true);
			}
			for (const mark of example.data.marks ?? []) expect(example.data.address, example.slug).toContain(mark);
		}
	});
});
