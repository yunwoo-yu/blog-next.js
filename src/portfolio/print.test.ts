import { ARGO_WORKFLOWS_PR_URL, REVERSE_INFINITE_SCROLL_POST_URL, WWW_BASE_URL } from '@/constant';
import RESUME, { formatMonths, getCareerMonths } from '@/constant/resume';

import { PORTFOLIO_CASES } from './cases';
import {
	getPrintContacts,
	getPrintFeatured,
	getPrintOthers,
	getPrintReferences,
	getPrintTroubles,
	getTotalCareerDuration,
	PRINT_FEATURED,
	PRINT_FEATURED_SLUGS,
	PRINT_IDENTITY_CLAIM,
	PRINT_LIMITS,
	PRINT_MAX_DIAGRAM_STEPS,
	PRINT_MAX_TROUBLES,
	PRINT_OTHERS,
	pickPrintTroubles,
	splitSentences,
} from './print';

describe('인쇄 문구 데이터', () => {
	it('대표 사례는 5개이고 모두 실제 사례이며 그 밖의 작업과 겹치지 않는다', () => {
		const slugs = PORTFOLIO_CASES.map(item => item.slug);

		expect(PRINT_FEATURED).toHaveLength(5);
		expect(PRINT_OTHERS).toHaveLength(4);
		expect(new Set([...PRINT_FEATURED_SLUGS, ...PRINT_OTHERS.map(entry => entry.slug)])).toEqual(new Set(slugs));
		expect(getPrintFeatured().map(entry => entry.item.slug)).toEqual([...PRINT_FEATURED_SLUGS]);
		expect(getPrintOthers().map(entry => entry.item.slug)).toEqual(PRINT_OTHERS.map(entry => entry.slug));
	});

	it('대표 사례 순서: 결제와 중복 기부가 연달아 오지 않는다', () => {
		const order = [...PRINT_FEATURED_SLUGS];

		expect(order).toEqual([
			'wellomarket-checkout',
			'wello-responsive-search',
			'admin-session-refresh',
			'donation-duplicate-guard',
			'avatar-studio-performance',
		]);
		expect(Math.abs(order.indexOf('wellomarket-checkout') - order.indexOf('donation-duplicate-guard'))).toBeGreaterThan(
			1,
		);
	});

	it('문구 상한: 한 줄 요약 80자·2문장 이하, 그 밖의 작업 한 구절 90자·제목 45자', () => {
		for (const entry of PRINT_FEATURED) {
			expect(entry.oneLine.trim().length, entry.slug).toBeGreaterThan(0);
			expect(entry.oneLine.length, entry.slug).toBeLessThanOrEqual(PRINT_LIMITS.oneLine);
			expect(splitSentences(entry.oneLine).length, entry.slug).toBeLessThanOrEqual(2);
		}
		for (const { item, line } of getPrintOthers()) {
			expect(line.length, item.slug).toBeLessThanOrEqual(PRINT_LIMITS.otherLine);
			expect(item.title.length, item.slug).toBeLessThanOrEqual(PRINT_LIMITS.otherTitle);
		}
	});

	it('수치는 결과 문장 안의 짧은 괄호로 출처를 밝힌다(고정 규칙)', () => {
		const resultOf = (slug: string) =>
			PORTFOLIO_CASES.find(item => item.slug === slug)!.stages.find(stage => stage.id === 'result')!.text;
		const donationCase = PORTFOLIO_CASES.find(item => item.slug === 'donation-duplicate-guard')!;

		expect(resultOf('wellomarket-checkout')).toMatch(
			/^오픈 후 1개월 동안 결제 금액 관련 CS 문의와 API 에러 로그는 0건이었습니다\./,
		);
		expect(resultOf('wello-responsive-search')).toMatch(
			/^데스크톱 평균 참여 시간이 약 20% 증가했습니다\(GA4, 개편 전후 2주 단순 비교\)\./,
		);
		expect(resultOf('donation-duplicate-guard')).toMatch(
			/^중복 기부 관련 CS 재문의가 약 70% 줄었습니다\(CS 담당자 전언\)\./,
		);
		expect(resultOf('avatar-studio-performance')).toMatch(
			/^FCP가 3초 이상에서 400~600ms로 줄었습니다\(Lighthouse 측정\)\./,
		);
		expect(donationCase.summary).toContain('약 70%');
		expect(donationCase.summary).toContain('(CS 담당자 전언)');
	});

	it('표지 정체성 문장은 정해진 한 문장이다', () => {
		expect(PRINT_IDENTITY_CLAIM).toBe(
			'결제 금액, 검색 조건, 로그인 토큰처럼 화면과 서버의 값이 어긋나기 쉬운 부분을 주로 맡았습니다.',
		);
	});

	it('그 밖의 작업은 합친 챗봇부터 네 행이고 마이데이터는 구현만 기술한다', () => {
		expect(PRINT_OTHERS.map(entry => entry.slug)).toEqual([
			'ai-chatbot-cms',
			'wellobiz-chakra-zod',
			'swing-frontend',
			'mydata-integration',
		]);
		expect(PRINT_OTHERS[0].line).toContain('서버에서 생성');
		expect(PRINT_OTHERS[0].line).toContain('CMS의 OG 편집값을 재배포 없이 반영');
		expect(PRINT_OTHERS[3].line).not.toMatch(/반려|성과|운영|\d/);
		expect(PRINT_OTHERS[3].line).toContain('단계 복원');
		expect(PRINT_OTHERS[3].line).toContain('실패한 기관만 안내');
	});

	it('사례 헤더용 문구에 담당·팀 구성 서술이 없다', () => {
		const texts = [...PRINT_FEATURED.map(entry => entry.oneLine), ...PRINT_OTHERS.map(entry => entry.line)];

		for (const text of texts) expect(text, text).not.toMatch(/담당:|내가 맡은 것|명이 /);
	});

	it('경력 기간은 이력서 경력의 합이다', () => {
		const months = RESUME.careers.map(getCareerMonths);

		expect(RESUME.careers.length).toBeGreaterThan(0);
		expect(getTotalCareerDuration()).toBe(formatMonths(months.reduce((sum, value) => sum + value, 0)));
		expect(months).toEqual([7, 24]);
		expect(getTotalCareerDuration()).toBe('2년 7개월');
	});

	it('개월 수 표기: 31개월은 2년 7개월, 24개월은 2년, 7개월은 7개월', () => {
		expect(formatMonths(31)).toBe('2년 7개월');
		expect(formatMonths(24)).toBe('2년');
		expect(formatMonths(7)).toBe('7개월');
	});
});

describe('문장 나누기', () => {
	it('문장 사이 숫자 속 점으로는 끊지 않는다', () => {
		expect(splitSentences('2026.03 오픈했습니다. 다음 문장입니다.')).toEqual([
			'2026.03 오픈했습니다.',
			'다음 문장입니다.',
		]);
	});
});

describe('인쇄용 구현 포인트·도식 고르기', () => {
	const step = { from: 0, to: 1, label: 'x' };
	const small = { actors: ['a', 'b'], steps: [step, step, step, step] };
	const large = { actors: ['a', 'b'], steps: Array.from({ length: PRINT_MAX_DIAGRAM_STEPS + 1 }, () => step) };

	it('도식은 단계가 적은 첫 번째 것만 남긴다', () => {
		const picked = pickPrintTroubles([
			{ id: 1, diagram: large },
			{ id: 2, diagram: small },
			{ id: 3, diagram: small },
		]);

		expect(picked.map(t => t.id)).toEqual([1, 2]);
		expect(picked.map(t => Boolean(t.diagram))).toEqual([false, true]);
	});

	it('앞쪽에 쓸 도식이 없으면 뒤쪽 도식 있는 문제를 둘째 자리에 올린다', () => {
		const picked = pickPrintTroubles([{ id: 1 }, { id: 2 }, { id: 3, diagram: small }]);

		expect(picked.map(t => t.id)).toEqual([1, 3]);
		expect(picked[1].diagram).toBe(small);
	});

	it('대표 사례마다 구현 포인트 2개 이하, 도식은 5단계 이하로 1개 이하다', () => {
		for (const slug of PRINT_FEATURED_SLUGS) {
			const troubles = getPrintTroubles(slug);
			const diagrams = troubles.flatMap(trouble => (trouble.diagram ? [trouble.diagram] : []));

			expect(troubles.length, slug).toBeLessThanOrEqual(PRINT_MAX_TROUBLES);
			expect(diagrams.length, slug).toBeLessThanOrEqual(1);
			for (const diagram of diagrams) expect(diagram.steps.length, slug).toBeLessThanOrEqual(PRINT_MAX_DIAGRAM_STEPS);
		}
	});
});

describe('연락처', () => {
	it('블로그 주소는 이력서 연락처와 같은 www 주소다', () => {
		expect(getPrintContacts().find(contact => contact.label === '블로그')).toMatchObject({
			value: WWW_BASE_URL,
			href: WWW_BASE_URL,
		});
	});
});

describe('기술 자료 링크', () => {
	it('블로그 글과 Argo PR 을 이력서 원문의 주소·문구로 가리킨다', () => {
		const [blog, pr] = getPrintReferences();

		expect(blog.url).toBe(REVERSE_INFINITE_SCROLL_POST_URL);
		expect(pr.url).toBe(ARGO_WORKFLOWS_PR_URL);
		expect(blog.point).toBe('역방향 무한스크롤 구현 2가지 비교');
		expect(pr.point).toBe('Argo Workflows UI 기여 PR 3건 머지(1건 공동 작성)');
		expect(Object.keys(blog)).not.toContain('pointLabel');
	});
});
