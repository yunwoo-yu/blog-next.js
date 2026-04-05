import { type Careers, getCareerPeriod, getCareerPeriodText } from './resume';

const createCareer = (overrides: Partial<Careers> = {}): Careers => ({
	organization: '',
	position: '',
	description: '',
	highlights: [],
	techStack: [],
	serviceGroups: [],
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
});

describe('getCareerPeriodText', () => {
	it('duration이 있으면 괄호로 붙인다', () => {
		const career = createCareer({ startDate: '2023.01', endDate: '2024.03' });

		expect(getCareerPeriodText(career)).toBe('2023.01 ~ 2024.03 (1년 2개월)');
	});

	it('duration이 없으면 text만 반환한다', () => {
		const career = createCareer({ period: '2023.01 ~ 2023.06' });

		expect(getCareerPeriodText(career)).toBe('2023.01 ~ 2023.06');
	});
});
