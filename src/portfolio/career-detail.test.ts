import RESUME from '@/constant/resume';

import { CAREER_DETAIL, getCareerProjects } from './career-detail';
import { findResumeProject, PORTFOLIO_CASES } from './cases';

const detailProjects = CAREER_DETAIL.flatMap(career =>
	career.serviceGroups.flatMap(group =>
		group.projects.map(project => ({ organization: career.organization, service: group.service, project })),
	),
);

/** 포트폴리오 사례가 있는 이력서 항목만(이력서에만 싣는 항목은 상세 원문이 없다). */
const resumeItems = RESUME.projects.flatMap(({ organization, service, items }) =>
	items.filter(item => item.caseSlug).map(item => ({ organization, service, item })),
);

describe('getCareerProjects', () => {
	const project = (title: string, date?: string) => ({ title, date, details: [] });
	const career = (groups: { service: string; projects: ReturnType<typeof project>[] }[]) => ({ serviceGroups: groups });

	it('서비스 구분 없이 종료일 기준 최신순으로 펼친다', () => {
		const result = getCareerProjects(
			career([
				{ service: 'A', projects: [project('a-old', '2025.12 ~ 2026.01'), project('a-new', '2026.02 ~ 2026.05')] },
				{ service: 'B', projects: [project('b-mid', '2026.03')] },
			]),
		);

		expect(result.map(item => item.project.title)).toEqual(['a-new', 'b-mid', 'a-old']);
	});

	it('종료일이 같으면 시작일이 늦은 쪽을 앞에 둔다', () => {
		const result = getCareerProjects(
			career([
				{ service: 'A', projects: [project('long', '2025.01 ~ 2025.08'), project('short', '2025.06 ~ 2025.08')] },
			]),
		);

		expect(result.map(item => item.project.title)).toEqual(['short', 'long']);
	});

	it('날짜가 완전히 같으면 작성 순서를 유지한다', () => {
		const result = getCareerProjects(
			career([
				{ service: 'A', projects: [project('first', '2025.01 ~ 2025.08'), project('second', '2025.01 ~ 2025.08')] },
			]),
		);

		expect(result.map(item => item.project.title)).toEqual(['first', 'second']);
	});

	it('날짜가 없는 프로젝트는 맨 뒤로 보낸다', () => {
		const result = getCareerProjects(
			career([{ service: 'A', projects: [project('undated'), project('dated', '2025.01')] }]),
		);

		expect(result.map(item => item.project.title)).toEqual(['dated', 'undated']);
	});

	it('각 프로젝트에 소속 서비스 정보를 붙인다', () => {
		const result = getCareerProjects({
			serviceGroups: [
				{ service: 'A', serviceUrl: 'https://a.test', serviceDescription: '설명', projects: [project('p', '2025.01')] },
			],
		});

		expect(result[0]).toMatchObject({ service: 'A', serviceUrl: 'https://a.test', serviceDescription: '설명' });
	});
});

describe('포트폴리오 상세 원문과 이력서의 일치', () => {
	it('경력 순서와 조직·기간·재직 정보가 이력서와 같다', () => {
		const pick = ({ organization, position, startDate, endDate }: (typeof RESUME.careers)[number]) => ({
			organization,
			position,
			startDate,
			endDate,
		});

		expect(CAREER_DETAIL.map(pick)).toEqual(RESUME.careers.map(pick));
	});

	it('이력서의 모든 프로젝트 항목이 같은 서비스·제목·기간으로 상세 원문에 있다', () => {
		for (const { organization, service, item } of resumeItems) {
			const found = detailProjects.find(
				entry => entry.organization === organization && entry.service === service && entry.project.title === item.title,
			);

			expect(found, `${organization}/${service}/${item.title}`).toBeDefined();
			expect(found?.project.date, item.title).toBe(item.date);
		}
		expect(detailProjects).toHaveLength(resumeItems.length);
	});

	it('이력서 요약은 상세 원문 전체보다 눈에 띄게 짧다', () => {
		for (const { organization, service, item } of resumeItems) {
			const found = detailProjects.find(
				entry => entry.organization === organization && entry.service === service && entry.project.title === item.title,
			)!;
			const detailLength = found.project.details.reduce((total, detail) => total + detail.title.length, 0);

			expect(item.summary.length, item.title).toBeLessThanOrEqual(detailLength * 0.7);
		}
	});

	it('이력서 항목의 caseSlug 는 같은 프로젝트의 포트폴리오 사례를 가리킨다', () => {
		for (const { item } of resumeItems) {
			const found = PORTFOLIO_CASES.find(entry => entry.slug === item.caseSlug);

			expect(found, item.title).toBeDefined();
			expect(found?.resumeRef.project, item.title).toBe(item.title);
		}
	});

	it('사례 slug 가 없는 이력서 전용 항목은 어느 포트폴리오 사례 제목과도 겹치지 않는다', () => {
		const caseTitles = PORTFOLIO_CASES.map(item => item.resumeRef.project);

		for (const { items } of RESUME.projects) {
			for (const item of items.filter(entry => !entry.caseSlug))
				expect(caseTitles, item.title).not.toContain(item.title);
		}
	});

	it('포트폴리오 사례 본문은 상세 원문에서 온다', () => {
		for (const item of PORTFOLIO_CASES) {
			const { project } = findResumeProject(item.resumeRef);

			expect(
				detailProjects.some(entry => entry.project === project),
				item.slug,
			).toBe(true);
		}
	});
});
