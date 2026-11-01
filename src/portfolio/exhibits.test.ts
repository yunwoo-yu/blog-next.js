import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { PORTFOLIO_CASES } from './cases';
import { EXHIBITS, getAllScreens, getExhibit, getExhibitImagePaths, getStageScreen } from './exhibits';

describe('전시 데이터', () => {
	it('사례마다 하나의 전시가 있고 순서가 같다', () => {
		expect(EXHIBITS.map(item => item.slug)).toEqual(PORTFOLIO_CASES.map(item => item.slug));
		expect(new Set(EXHIBITS.map(item => item.slug)).size).toBe(EXHIBITS.length);
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

	it('이력서에 없는 수치를 새로 만들지 않는다', () => {
		const resumeText = PORTFOLIO_CASES.map(item => item.stages.map(stage => stage.text).join(' ')).join(' ');

		for (const exhibit of EXHIBITS) {
			const numbers = exhibit.callouts.outcome.match(/\d[\d~.,]*/g) ?? [];

			for (const number of numbers) expect(resumeText, `${exhibit.slug}: ${number}`).toContain(number);
		}
	});
});
