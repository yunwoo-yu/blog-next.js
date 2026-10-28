import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { PORTFOLIO_CASES } from './cases';
import {
	clampPhase,
	EXHIBITS,
	getAllScreens,
	getExhibit,
	getExhibitImagePaths,
	getNodeLabel,
	getNodeState,
	getStageScreen,
	getVariantName,
	getVariants,
	PHASE_COUNT,
	VARIANTS,
} from './exhibits';

describe('전시 데이터', () => {
	it('사례마다 하나의 전시가 있고 순서가 같다', () => {
		expect(EXHIBITS.map(item => item.slug)).toEqual(PORTFOLIO_CASES.map(item => item.slug));
		expect(new Set(EXHIBITS.map(item => item.slug)).size).toBe(EXHIBITS.length);
	});

	it('보여 주는 전·후마다 정확히 4단계의 문구와 노드 상태를 가진다', () => {
		for (const exhibit of EXHIBITS) {
			for (const variant of getVariants(exhibit)) {
				expect(exhibit.phases[variant], `${exhibit.slug}/${variant}`).toHaveLength(PHASE_COUNT);
				expect(exhibit.states[variant], `${exhibit.slug}/${variant}`).toHaveLength(PHASE_COUNT);
			}
		}
	});

	it('개선 전이 없는 전시(none)는 before 쪽을 비워 두고 개선 후만 보여 준다', () => {
		const none = EXHIBITS.filter(exhibit => exhibit.beforeKind === 'none');

		expect(none.length).toBeGreaterThan(0);
		for (const exhibit of none) {
			expect(getVariants(exhibit), exhibit.slug).toEqual(['after']);
			expect(exhibit.phases.before, exhibit.slug).toEqual([]);
			expect(exhibit.states.before, exhibit.slug).toEqual([]);
			expect(exhibit.edges.before, exhibit.slug).toEqual([]);
			expect(getVariantName(exhibit, 'after'), exhibit.slug).toBe('구현');
		}
	});

	it('무대 화면은 사례 화면 → 서비스 공개 화면 순으로 고르고 없으면 비운다', () => {
		const search = getExhibit('wello-responsive-search')!;
		const checkout = getExhibit('wellomarket-checkout')!;
		const donation = getExhibit('donation-duplicate-guard')!;

		expect(getStageScreen(search, 'after')).toBe(search.screens.after);
		// 사례 전용 캡처가 있는 사례는 없는 쪽을 서비스 화면으로 채우지 않는다.
		expect(getStageScreen(search, 'before')).toBeUndefined();
		expect(getStageScreen(checkout, 'after')).toBe(checkout.identity);
		expect(getStageScreen(donation, 'after')).toBeUndefined();
	});

	it('상태·간선이 가리키는 노드가 모두 실제로 존재한다', () => {
		for (const exhibit of EXHIBITS) {
			const ids = new Set(exhibit.nodes.map(node => node.id));

			expect(ids.size, exhibit.slug).toBe(exhibit.nodes.length);
			for (const variant of VARIANTS) {
				for (const [from, to] of exhibit.edges[variant]) {
					expect(ids.has(from) && ids.has(to), `${exhibit.slug} edge ${from}-${to}`).toBe(true);
				}
				for (const states of exhibit.states[variant]) {
					for (const id of Object.keys(states)) expect(ids.has(id), `${exhibit.slug} state ${id}`).toBe(true);
				}
			}
		}
	});

	it('같은 계층·열에 두 노드가 겹치지 않는다', () => {
		for (const exhibit of EXHIBITS) {
			const cells = exhibit.nodes.map(node => `${node.layer}:${node.col}`);

			expect(new Set(cells).size, exhibit.slug).toBe(cells.length);
		}
	});

	it('이미지 경로가 모두 public 에 실제 파일로 있고 출처 캡션을 가지고 촬영일은 적지 않는다', () => {
		const paths = getExhibitImagePaths();

		expect(paths.length).toBeGreaterThan(0);
		for (const src of paths) expect(existsSync(join(process.cwd(), 'public', src)), src).toBe(true);
		for (const exhibit of EXHIBITS) {
			for (const screen of getAllScreens(exhibit)) {
				expect(screen.caption.length, screen.src).toBeGreaterThan(0);
				expect(screen.caption, screen.src).not.toMatch(/20\d{2}-\d{2}-\d{2}|촬영/);
				expect(screen.alt.length, screen.src).toBeGreaterThan(10);
			}
		}
	});

	it('공개 캡처가 없는 쪽은 재구성 도식임을 밝힌다', () => {
		for (const exhibit of EXHIBITS) {
			const missing = VARIANTS.some(variant => !exhibit.screens[variant]);

			if (missing && !exhibit.screens.before && !exhibit.screens.after) {
				expect(exhibit.reconstructionNote, exhibit.slug).toMatch(/다시 그린|재구성/);
			}
		}
	});

	it('결과 문구는 근거를 함께 적고 측정하지 않은 값을 측정값처럼 쓰지 않는다', () => {
		for (const exhibit of EXHIBITS) {
			expect(exhibit.callouts.outcomeBasis, exhibit.slug).toMatch(/이력서 기재/);
		}
	});

	it('이력서에 없는 수치를 새로 만들지 않는다', () => {
		const resumeText = PORTFOLIO_CASES.map(item => item.stages.map(stage => stage.text).join(' ')).join(' ');

		for (const exhibit of EXHIBITS) {
			const numbers = exhibit.callouts.outcome.match(/\d[\d~.,]*/g) ?? [];

			for (const number of numbers) expect(resumeText, `${exhibit.slug}: ${number}`).toContain(number);
		}
	});
});

describe('전시 헬퍼', () => {
	it('단계를 0~3 으로 고정한다', () => {
		expect(clampPhase(-3)).toBe(0);
		expect(clampPhase(9)).toBe(3);
		expect(clampPhase(1.9)).toBe(1);
		expect(clampPhase(Number.NaN)).toBe(0);
	});

	it('상태가 없는 노드는 idle 이고, 개선 전 이름이 따로 있으면 그것을 쓴다', () => {
		const admin = getExhibit('admin-session-refresh')!;
		const recover = admin.nodes.find(node => node.id === 'recover')!;

		expect(getNodeState(admin, 'after', 0, 'relogin')).toBe('idle');
		expect(getNodeLabel(recover, 'before')).toBe('401 처리 없음');
		expect(getNodeLabel(recover, 'after')).toBe('401 복구 (갱신 후 재시도)');
	});

	it('어드민: 개선 전에는 복구 없이 다시 로그인으로 이어지고, 개선 후에는 refresh 로 가는 간선이 공유 단계 하나뿐이다', () => {
		const admin = getExhibit('admin-session-refresh')!;

		expect(admin.edges.before).toEqual(expect.arrayContaining([['recover', 'relogin']]));
		expect(admin.edges.before.some(([, to]) => to === 'refresh')).toBe(false);
		expect(admin.edges.after.filter(([, to]) => to === 'refresh')).toEqual([['share', 'refresh']]);
		expect(admin.edges.after.some(([from, to]) => [from, to].some(id => id === 'relogin'))).toBe(false);
	});

	it('결제: 개선 후 PG 로 가는 간선은 서버 API 뿐이다', () => {
		const checkout = getExhibit('wellomarket-checkout')!;

		expect(checkout.edges.after.filter(([, to]) => to === 'pg')).toEqual([['api', 'pg']]);
		expect(checkout.edges.before.filter(([, to]) => to === 'pg')).toEqual([['calc', 'pg']]);
	});
});

describe('전·후 이름', () => {
	it('가상 비교(결제)는 개선 전이라 부르지 않고 조건문으로 쓴다', () => {
		const checkout = getExhibit('wellomarket-checkout')!;

		expect(checkout.beforeKind).toBe('scenario');
		expect(getVariantName(checkout, 'before')).toBe('위험 시나리오');
		expect(getVariantName(checkout, 'after')).toBe('개선 후');
		for (const phase of checkout.phases.before) expect(phase.caption).toMatch(/가정|수 있습니다/);
		expect(getVariantName(getExhibit('admin-session-refresh')!, 'before')).toBe('개선 전');
	});
});
