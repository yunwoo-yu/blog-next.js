import { ARGO_WORKFLOWS_PR_URL, REVERSE_INFINITE_SCROLL_POST_URL, WWW_BASE_URL } from '@/constant';
import RESUME, { formatMonths, getCareerMonths } from '@/constant/resume';

import { PORTFOLIO_CASES } from './cases';
import {
	EVIDENCE_TAGS,
	getPrintContacts,
	getPrintDecisionRows,
	getPrintFeatured,
	getPrintOthers,
	getPrintPages,
	getPrintReferences,
	getPrintResultSentences,
	getPrintTroubles,
	getTotalCareerDuration,
	PRINT_FEATURED,
	PRINT_FEATURED_SLUGS,
	PRINT_LIMITS,
	PRINT_MAX_DECISIONS,
	PRINT_MAX_DIAGRAM_STEPS,
	PRINT_MAX_TROUBLES,
	PRINT_OTHERS,
	PRINT_PAGES_PER_CASE,
	pickPrintTroubles,
	splitSentences,
} from './print';

describe('인쇄 문구 데이터', () => {
	it('대표 사례는 5개이고 모두 실제 사례이며 그 밖의 작업과 겹치지 않는다', () => {
		const slugs = PORTFOLIO_CASES.map(item => item.slug);

		expect(PRINT_FEATURED).toHaveLength(5);
		expect(PRINT_OTHERS).toHaveLength(5);
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

	it('문구 상한: 한 줄 성과 80자, 한계 120자·2문장 이하, 그 밖의 작업 한 구절 90자·제목 45자', () => {
		for (const entry of PRINT_FEATURED) {
			expect(entry.oneLine.length, entry.slug).toBeLessThanOrEqual(PRINT_LIMITS.oneLine);
			expect(entry.limit.length, entry.slug).toBeLessThanOrEqual(PRINT_LIMITS.limit);
			expect(splitSentences(entry.limit).length, entry.slug).toBeLessThanOrEqual(2);
			expect(entry.tocPhrase.trim().length, entry.slug).toBeGreaterThan(0);
		}
		for (const { item, line } of getPrintOthers()) {
			expect(line.length, item.slug).toBeLessThanOrEqual(PRINT_LIMITS.otherLine);
			expect(item.title.length, item.slug).toBeLessThanOrEqual(PRINT_LIMITS.otherTitle);
		}
	});

	it('숫자 출처 태그는 측정·관측·전언 중 하나이고, 전언은 전언이라고 적는다', () => {
		for (const entry of PRINT_FEATURED) {
			if (entry.evidence) expect(EVIDENCE_TAGS, entry.slug).toContain(entry.evidence.tag);
		}
		const donation = PRINT_FEATURED.find(entry => entry.slug === 'donation-duplicate-guard');
		const donationCase = PORTFOLIO_CASES.find(item => item.slug === 'donation-duplicate-guard');

		expect(donation?.evidence?.tag).toBe('전언');
		expect(donation?.evidence?.text).toContain('전언');
		expect(donationCase?.summary).toContain('약 70%');
		expect(donationCase?.summary).toContain('CS 담당자');
		expect(donation?.limit).toContain('사용자가 선택');
	});

	it('사례 헤더용 문구에 담당·팀 구성 서술이 없다', () => {
		const texts = [
			...PRINT_FEATURED.flatMap(entry => [entry.oneLine, entry.limit, entry.tocPhrase, entry.evidence?.text ?? '']),
			...PRINT_OTHERS.map(entry => entry.line),
		];

		for (const text of texts) expect(text, text).not.toMatch(/담당:|내가 맡은 것|명이 /);
	});

	it('쪽 번호는 표지 1쪽, 사례 2쪽씩, 마지막이 그 밖의 작업이다', () => {
		const pages = getPrintPages();

		expect(pages.caseStarts).toEqual(PRINT_FEATURED.map((_, index) => 2 + index * PRINT_PAGES_PER_CASE));
		expect(pages.others).toBe(1 + PRINT_FEATURED.length * PRINT_PAGES_PER_CASE + 1);
		expect(pages.total).toBe(12);
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

describe('결과 문장 고르기', () => {
	const evidence = { tag: EVIDENCE_TAGS[1], text: '오픈 후 1개월 · 결제 금액 관련 CS 문의·API 에러 로그 0건' };

	it('수치가 이미 나온 문장과 해명 문장은 뺀다', () => {
		const text =
			'2026.03 오픈 후 1개월간 문의가 0건이었습니다. 쿠폰 조합이 늘어도 한 곳에서 정해집니다. 효과를 수치로 잰 값은 없습니다.';

		expect(getPrintResultSentences(text, evidence)).toEqual(['쿠폰 조합이 늘어도 한 곳에서 정해집니다.']);
	});

	it('문장 사이 숫자 속 점으로는 끊지 않는다', () => {
		expect(splitSentences('2026.03 오픈했습니다. 다음 문장입니다.')).toEqual([
			'2026.03 오픈했습니다.',
			'다음 문장입니다.',
		]);
	});

	it('대표 사례 5개 모두 남는 결과 문장이 있고 2문장 이하다', () => {
		for (const { item, evidence: tag } of getPrintFeatured()) {
			const result = item.stages.find(stage => stage.id === 'result');
			const sentences = getPrintResultSentences(result?.text ?? '', tag);

			expect(sentences.length, item.slug).toBeGreaterThan(0);
			expect(sentences.length, item.slug).toBeLessThanOrEqual(2);
		}
	});
});

describe('인쇄용 문제·도식 고르기', () => {
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

	it('대표 사례마다 풀었던 문제 2개 이하, 도식은 5단계 이하로 1개 이하, 판단 행은 2개 이하다', () => {
		for (const slug of PRINT_FEATURED_SLUGS) {
			const troubles = getPrintTroubles(slug);
			const diagrams = troubles.flatMap(trouble => (trouble.diagram ? [trouble.diagram] : []));

			expect(troubles.length, slug).toBeLessThanOrEqual(PRINT_MAX_TROUBLES);
			expect(diagrams.length, slug).toBeLessThanOrEqual(1);
			for (const diagram of diagrams) expect(diagram.steps.length, slug).toBeLessThanOrEqual(PRINT_MAX_DIAGRAM_STEPS);
			expect(getPrintDecisionRows(slug).length, slug).toBeLessThanOrEqual(PRINT_MAX_DECISIONS);
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
		expect(pr.point).toContain('PR');
	});
});
