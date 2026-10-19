import RESUME, { type Careers, compareRecent, getCareerPeriod, getProjectRange, getServicePeriod } from './resume';

const createCareer = (overrides: Partial<Careers> = {}): Careers => ({
	organization: '',
	position: '',
	description: '',
	techStack: [],
	...overrides,
});

describe('getCareerPeriod', () => {
	it('period가 있으면 그대로 반환한다', () => {
		const career = createCareer({ period: '2023.01 ~ 2023.06' });

		expect(getCareerPeriod(career)).toEqual({
			text: '2023.01 ~ 2023.06',
			duration: '',
			isOngoing: false,
		});
	});

	it('startDate가 없으면 빈 값을 반환한다', () => {
		const career = createCareer();

		expect(getCareerPeriod(career)).toEqual({
			text: '',
			duration: '',
			isOngoing: false,
		});
	});

	it('endDate가 없으면 재직 중으로 표시한다', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-04-01'));

		const career = createCareer({ startDate: '2025.01' });
		const result = getCareerPeriod(career);

		expect(result.isOngoing).toBe(true);
		expect(result.text).toBe('2025.01 ~ 재직 중');
		expect(result.duration).toBe('1년 3개월');

		vi.useRealTimers();
	});

	it('연+월 기간을 계산한다', () => {
		const career = createCareer({ startDate: '2023.01', endDate: '2024.03' });

		expect(getCareerPeriod(career)).toEqual({
			text: '2023.01 ~ 2024.03',
			duration: '1년 2개월',
			isOngoing: false,
		});
	});

	it('정확히 연 단위면 개월을 생략한다', () => {
		const career = createCareer({ startDate: '2023.01', endDate: '2025.01' });

		expect(getCareerPeriod(career).duration).toBe('2년');
	});

	it('1년 미만이면 개월만 표시한다', () => {
		const career = createCareer({ startDate: '2025.01', endDate: '2025.05' });

		expect(getCareerPeriod(career).duration).toBe('4개월');
	});

	it('일 단위 종료일을 그대로 표시하고 월 기준 기간을 계산한다', () => {
		const career = createCareer({ startDate: '2025.11', endDate: '2026.06.15' });

		expect(getCareerPeriod(career)).toEqual({
			text: '2025.11 ~ 2026.06.15',
			duration: '7개월',
			isOngoing: false,
		});
	});
});

describe('프로젝트 날짜 helper', () => {
	it('시작~종료와 단일 월을 [시작, 종료]로 나눈다', () => {
		expect(getProjectRange('2025.12 ~ 2026.01')).toEqual(['2025.12', '2026.01']);
		expect(getProjectRange('2026.04')).toEqual(['2026.04', '2026.04']);
		expect(getProjectRange(undefined)).toEqual(['', '']);
	});

	it('종료일 → 시작일 순으로 최신이 앞에 오고 날짜 없는 쪽이 뒤로 간다', () => {
		const ranges = [
			getProjectRange('2025.01 ~ 2025.08'),
			getProjectRange(undefined),
			getProjectRange('2025.06 ~ 2025.08'),
			getProjectRange('2026.03'),
		];

		expect([...ranges].sort(compareRecent)).toEqual([
			['2026.03', '2026.03'],
			['2025.06', '2025.08'],
			['2025.01', '2025.08'],
			['', ''],
		]);
	});

	it('서비스 기간은 가장 이른 시작부터 가장 늦은 종료까지다', () => {
		const item = (date: string) => ({ title: date, caseSlug: 'x', date, summary: '', highlights: [] });

		expect(getServicePeriod({ items: [item('2026.02 ~ 2026.05'), item('2025.12 ~ 2026.01'), item('2026.04')] })).toBe(
			'2025.12 ~ 2026.05',
		);
		expect(getServicePeriod({ items: [item('2026.03')] })).toBe('2026.03');
	});
});

describe('이력서 프로젝트 데이터', () => {
	const items = RESUME.projects.flatMap(project => project.items);

	it('서비스는 최신 작업 순이고 서비스 안의 항목도 최신순이다', () => {
		const ranges = RESUME.projects.map(project => getProjectRange(getServicePeriod(project)));

		expect(ranges, '서비스 순서').toEqual([...ranges].sort(compareRecent));
		for (const project of RESUME.projects) {
			const itemRanges = project.items.map(item => getProjectRange(item.date));

			expect(itemRanges, project.service).toEqual([...itemRanges].sort(compareRecent));
		}
	});

	it('프로젝트는 모두 실제 경력의 조직에 속하고 제목이 겹치지 않는다', () => {
		const organizations = RESUME.careers.map(career => career.organization);

		for (const project of RESUME.projects) expect(organizations, project.service).toContain(project.organization);
		expect(new Set(items.map(item => item.title)).size).toBe(items.length);
	});

	it('서비스마다 역할과 사용 기술이 있고 항목은 포트폴리오 사례 slug 를 가진다', () => {
		for (const project of RESUME.projects) {
			expect(project.role.length, project.service).toBeGreaterThan(0);
			expect(project.techStack.length, project.service).toBeGreaterThan(0);
			for (const item of project.items) expect(item.caseSlug, item.title).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
		}
	});

	it('성과는 짧게 압축하고, 작업량 수치(개수·줄 수)는 성과로도 이력서 문구로도 쓰지 않는다', () => {
		for (const item of items) {
			if (item.outcome) {
				expect(item.outcome.value.length, item.title).toBeLessThanOrEqual(16);
				expect(item.outcome.value, `${item.title}: 작업량 수치는 성과가 아닙니다`).not.toMatch(/\d[\d,]*\s*(개|줄)/);
			}
			expect(item.summary, `${item.title}: 작업량 수치는 포트폴리오 상세에 둡니다`).not.toMatch(
				/\d[\d,]*\s*(개 (파일|API|라우트)|줄)/,
			);
		}
	});

	it('작업 요약에는 결과 수치를 섞지 않는다(성과 칸에만 둔다)', () => {
		for (const item of items) expect(item.summary, item.title).not.toMatch(/\d\s*%|\d\s*ms|0건|\d\s*초/);
	});

	it('각 항목은 1~2줄 요약이고 강조 문구 1~2개가 요약에 실제로 들어 있다', () => {
		for (const item of items) {
			expect(item.summary.length, item.title).toBeLessThanOrEqual(200);
			expect(item.highlights.length, item.title).toBeGreaterThanOrEqual(1);
			expect(item.highlights.length, item.title).toBeLessThanOrEqual(2);
			for (const highlight of item.highlights) {
				expect(item.summary.includes(highlight), `[${item.title}] 요약에 없는 강조 문구: ${highlight}`).toBe(true);
			}
		}
	});
});
