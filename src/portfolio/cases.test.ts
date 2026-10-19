import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import RESUME from '@/constant/resume';
import { getCategoryList } from '@/utils/post-utils';

import { CAREER_DETAIL, getCareerProjects } from './career-detail';
import { buildCasePath, findResumeProject, getAdjacentCases, getPortfolioCase, PORTFOLIO_CASES } from './cases';
import { getPortfolioExperience, PORTFOLIO_SECTIONS } from './overview';

const projectText = (slug: string) => {
	const item = PORTFOLIO_CASES.find(c => c.slug === slug)!;
	const { project } = findResumeProject(item.resumeRef);

	return [project.title, ...project.details.map(detail => detail.title)].join(' ');
};

describe('포트폴리오 케이스 데이터', () => {
	it('이력서의 경력 프로젝트를 빠짐없이 사례로 가진다', () => {
		const resumeTitles = RESUME.projects.flatMap(project => project.items.map(item => item.title));
		const caseTitles = PORTFOLIO_CASES.map(item => findResumeProject(item.resumeRef).project.title);

		expect([...caseTitles].sort()).toEqual([...resumeTitles].sort());
	});

	it('사례는 경력 순서대로, 경력 안에서는 프로젝트 최신순이다', () => {
		const expected = CAREER_DETAIL.flatMap(career =>
			getCareerProjects(career).map(({ service, project }) => `${career.organization}/${service}/${project.title}`),
		);
		const actual = PORTFOLIO_CASES.map(
			({ organization, service, resumeRef }) => `${organization}/${service}/${resumeRef.project}`,
		);

		expect(actual).toEqual(expected);
	});

	it('slug 는 URL 에 안전하고 중복되지 않는다', () => {
		const slugs = PORTFOLIO_CASES.map(item => item.slug);

		expect(new Set(slugs).size).toBe(slugs.length);
		for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
	});

	it('모든 사례는 이력서의 실제 프로젝트를 가리키고 기간·문제·기여·결과를 그대로 가져온다', () => {
		for (const item of PORTFOLIO_CASES) {
			const { career, project } = findResumeProject(item.resumeRef);

			expect(item.organization).toBe(career.organization);
			expect(item.period).toBe(project.date);
			expect(item.stages.map(stage => stage.label)).toEqual(['문제', '기여', '결과']);
			expect(item.stages.map(stage => stage.text)).toEqual(project.details.map(detail => detail.title));
		}
	});

	it('사례 제목과 요약, 키워드가 비어 있지 않다', () => {
		for (const item of PORTFOLIO_CASES) {
			expect(item.title.trim(), item.slug).not.toBe('');
			expect(item.summary.trim(), item.slug).not.toBe('');
			expect(item.keywords.length, item.slug).toBeGreaterThan(0);
		}
	});

	it('큐레이션 키워드는 모두 이력서 본문에 실제로 나온다', () => {
		for (const item of PORTFOLIO_CASES) {
			for (const keyword of item.keywords) {
				expect(projectText(item.slug).includes(keyword), `[${item.slug}] 본문에 없는 키워드: ${keyword}`).toBe(true);
			}
		}
	});

	it('퇴사 사유 문구는 사례 데이터에 담기지 않는다', () => {
		expect(JSON.stringify(PORTFOLIO_CASES)).not.toContain('권고사직');
	});

	it('없는 이력서 프로젝트를 참조하면 던진다', () => {
		expect(() => findResumeProject({ organization: '웰로', service: 'Wello', project: '없는 프로젝트' })).toThrow();
	});

	it('slug 로 사례를 찾고 이웃 사례를 돌려준다', () => {
		const [first, second] = PORTFOLIO_CASES;

		expect(getPortfolioCase(first.slug)).toBe(first);
		expect(getPortfolioCase('missing')).toBeUndefined();
		expect(buildCasePath(first.slug)).toBe(`/portfolio/${first.slug}`);
		expect(getAdjacentCases(first.slug)).toEqual({ prev: undefined, next: second });
		expect(getAdjacentCases('missing')).toEqual({ prev: undefined, next: undefined });
	});
});

describe('포트폴리오 개요 데이터', () => {
	it('경력은 이력서에서 파생되고 퇴사 사유를 싣지 않는다', () => {
		const experience = getPortfolioExperience();

		expect(experience.map(career => career.organization)).toEqual(RESUME.careers.map(career => career.organization));
		expect(JSON.stringify(experience)).not.toContain('권고사직');
	});

	it('섹션 id 는 중복되지 않는다', () => {
		const ids = PORTFOLIO_SECTIONS.map(section => section.id);

		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('블로그 콘텐츠와의 분리', () => {
	it('포트폴리오 콘텐츠는 src/mdx 밖에 있어 카테고리에 잡히지 않는다', async () => {
		const { categoryNameList } = await getCategoryList();

		expect(categoryNameList.map(category => category.label)).not.toContain('portfolio');
		expect(existsSync(join(process.cwd(), 'src/mdx/portfolio'))).toBe(false);
	});
});

describe('블로그·루트 번들과의 분리', () => {
	const SRC = join(process.cwd(), 'src');
	const HEAVY = /ServiceSceneCanvas|@react-three|from 'three'|from "three"/;

	const walk = (dir: string): string[] =>
		readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
			const full = join(dir, entry.name);
			if (entry.isDirectory()) return walk(full);
			return /\.(ts|tsx)$/.test(entry.name) && !/\.test\./.test(entry.name) ? [full] : [];
		});

	it('포트폴리오 밖의 소스는 3D 캔버스·three 를 참조하지 않는다', () => {
		const portfolioRoots = ['app/portfolio', 'components/portfolio', 'portfolio'].map(path => join(SRC, path));
		const outside = walk(SRC).filter(file => !portfolioRoots.some(root => file.startsWith(root)));

		expect(outside.length).toBeGreaterThan(0);
		for (const file of outside) expect(readFileSync(file, 'utf8'), file).not.toMatch(HEAVY);
	});

	it('포트폴리오 안에서도 3D 캔버스는 로더의 동적 import 한 곳에서만 값으로 불러온다', () => {
		const importers = walk(join(SRC, 'components/portfolio')).filter(
			file => !/ServiceScene/.test(file) && /ServiceSceneCanvas/.test(readFileSync(file, 'utf8')),
		);

		expect(importers.map(file => file.split('/').pop())).toEqual(['ServiceStage.tsx']);
		const source = readFileSync(importers[0], 'utf8');
		expect(source).toMatch(/import\('\.\/ServiceSceneCanvas'\)/);
		expect(source).not.toMatch(/^import [^t].*ServiceSceneCanvas/m);
	});

	it('portfolio.css 는 portfolio layout 에서만 불러온다', () => {
		const importers = walk(SRC).filter(file => /portfolio\.css/.test(readFileSync(file, 'utf8')));

		expect(importers.map(file => file.slice(SRC.length + 1))).toEqual(['app/portfolio/layout.tsx']);
	});
});

describe('클라이언트 번들과 이력서 원문의 분리', () => {
	const read = (file: string) => readFileSync(join(process.cwd(), file), 'utf8');

	it('클라이언트 컴포넌트가 가져오는 모듈은 이력서 원문과 사례 데이터를 가져오지 않는다', () => {
		const clientFiles = readdirSync(join(process.cwd(), 'src/components/portfolio'))
			.filter(file => file.endsWith('.tsx') && !file.includes('.test.'))
			.filter(file => read(`src/components/portfolio/${file}`).trimStart().startsWith("'use client'"));

		expect(clientFiles.length).toBeGreaterThan(0);
		for (const file of clientFiles) {
			const source = read(`src/components/portfolio/${file}`);

			expect(source, file).not.toMatch(
				/from\s+'@\/constant\/resume'|from\s+'@\/portfolio\/(cases|overview|career-detail)'/,
			);
		}
		expect(read('src/portfolio/links.ts')).not.toMatch(/from\s+'@\/constant\/resume'/);
	});
});
