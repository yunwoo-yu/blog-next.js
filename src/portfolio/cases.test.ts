import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import RESUME from '@/constant/resume';
import { getCategoryList } from '@/utils/post-utils';

import { CAREER_DETAIL, getCareerProjects } from './career-detail';
import { buildCasePath, findResumeProject, getAdjacentCases, getPortfolioCase, PORTFOLIO_CASES } from './cases';
import { getPortfolioExperience, PORTFOLIO_KEY_RESULTS } from './overview';

/** 이력서에만 있어야 하는 퇴사 사유 전체. */
const EXIT_REASONS = RESUME.careers.flatMap(career => career.exitReason ?? []);

const projectText = (slug: string) => {
	const item = PORTFOLIO_CASES.find(c => c.slug === slug)!;
	const { project } = findResumeProject(item.resumeRef);

	return [project.title, ...project.details.map(detail => detail.title)].join(' ');
};

describe('포트폴리오 케이스 데이터', () => {
	it('이력서의 경력 프로젝트를 빠짐없이 사례로 가진다', () => {
		const resumeTitles = RESUME.projects.flatMap(project =>
			project.items.filter(item => item.caseSlug).map(item => item.title),
		);
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
		expect(EXIT_REASONS.length).toBeGreaterThan(0);
		for (const reason of EXIT_REASONS) expect(JSON.stringify(PORTFOLIO_CASES)).not.toContain(reason);
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
		for (const reason of EXIT_REASONS) expect(JSON.stringify(experience)).not.toContain(reason);
	});

	it('핵심 숫자는 연결된 사례의 이력서 원문(career-detail.ts)에 그대로 나온다', () => {
		expect(PORTFOLIO_KEY_RESULTS.map(result => result.value)).toEqual(['0건', '400~600ms']);
		for (const result of PORTFOLIO_KEY_RESULTS) {
			const item = getPortfolioCase(result.slug);

			expect(item, result.slug).toBeDefined();
			const text = projectText(result.slug);

			expect(text.includes(result.value), `[${result.slug}] 원문에 없는 수치: ${result.value}`).toBe(true);
			// 설명에 붙은 보조 수치(1개월·3초)도 원문에 있어야 한다.
			for (const number of result.label.match(/\d[\d~.,]*\S?/g) ?? []) {
				expect(text.includes(number), `[${result.slug}] 원문에 없는 수치: ${number}`).toBe(true);
			}
		}
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
	const HEAVY = /ServiceSceneCanvas|@react-three|from 'three'|from "three"|import\('three'\)/;

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

	it('포트폴리오 소스도 3D(three·@react-three)를 전혀 참조하지 않는다', () => {
		const portfolioFiles = ['app/portfolio', 'components/portfolio', 'portfolio'].flatMap(path =>
			walk(join(SRC, path)),
		);

		expect(portfolioFiles.length).toBeGreaterThan(0);
		for (const file of portfolioFiles) expect(readFileSync(file, 'utf8'), file).not.toMatch(HEAVY);
	});

	it('portfolio.css 는 portfolio layout 에서만 불러온다', () => {
		const importers = walk(SRC).filter(file => /portfolio\.css/.test(readFileSync(file, 'utf8')));

		expect(importers.map(file => file.slice(SRC.length + 1))).toEqual(['app/portfolio/layout.tsx']);
	});
});

describe('클라이언트 번들과 이력서 원문의 분리', () => {
	const ROOT = process.cwd();
	const SRC = join(ROOT, 'src');
	/** 포트폴리오 전용 클라이언트 컴포넌트 위치. 아이콘 패키지 금지는 여기에만 적용한다. */
	const PORTFOLIO_ROOTS = ['components/portfolio', 'app/portfolio'].map(path => join(SRC, path));
	/** 클라이언트 번들에 실리면 안 되는 서버 전용 데이터·아이콘 모듈. */
	const FORBIDDEN_FILES = [
		'constant/resume',
		'portfolio/print',
		'portfolio/stories',
		'portfolio/career-detail',
		'portfolio/covers',
	];
	const FORBIDDEN_PACKAGES = ['lucide-react'];

	const walk = (dir: string): string[] =>
		readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
			const full = join(dir, entry.name);
			if (entry.isDirectory()) return walk(full);
			return /\.tsx?$/.test(entry.name) && !/\.test\./.test(entry.name) ? [full] : [];
		});

	const IMPORT_PATTERN = /(?:^|\n)\s*(?:import|export)\s+(?!type\s)(?:[^'";]*?\sfrom\s+)?['"]([^'"]+)['"]/g;
	const DYNAMIC_IMPORT_PATTERN = /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g;

	/** 정적 import·export-from 과 동적 import() 의 모듈 지정자를 모두 모은다. */
	const collectSpecifiers = (source: string) =>
		[...source.matchAll(IMPORT_PATTERN), ...source.matchAll(DYNAMIC_IMPORT_PATTERN)].map(match => match[1]);

	/** 모듈 지정자를 src 안의 실제 파일로 푼다. 패키지(외부)는 undefined. */
	const resolveLocal = (from: string, specifier: string) => {
		const base = specifier.startsWith('@/')
			? join(SRC, specifier.slice(2))
			: specifier.startsWith('.')
				? join(dirname(from), specifier)
				: undefined;

		if (!base) return undefined;

		return ['.ts', '.tsx', '/index.ts', '/index.tsx']
			.map(ext => `${base}${ext}`)
			.find(candidate => existsSync(candidate));
	};

	/** 시작 파일에서 import 사슬을 재귀로 따라가 도달하는 모든 로컬 파일과 외부 패키지를 모은다. */
	const reach = (entry: string) => {
		const files = new Set<string>();
		const packages = new Set<string>();
		const stack = [entry];

		while (stack.length > 0) {
			const file = stack.pop()!;

			if (files.has(file)) continue;
			files.add(file);
			for (const specifier of collectSpecifiers(readFileSync(file, 'utf8'))) {
				const local = resolveLocal(file, specifier);

				if (local) stack.push(local);
				else if (!specifier.startsWith('.') && !specifier.startsWith('@/')) packages.add(specifier);
			}
		}

		return { files, packages };
	};

	const isClientFile = (file: string) => /^\s*['"]use client['"]/.test(readFileSync(file, 'utf8'));

	/** src 전체의 클라이언트 컴포넌트. Header 같은 공용 컴포넌트가 포트폴리오 데이터에 닿는 경우도 잡는다. */
	const clientFiles = () => walk(SRC).filter(isClientFile);
	const isPortfolioFile = (file: string) => PORTFOLIO_ROOTS.some(root => file.startsWith(root));

	it('src 전체에서 클라이언트 컴포넌트를 찾는다(검사가 빈 채로 통과하지 않는다)', () => {
		const names = clientFiles().map(file => file.slice(SRC.length + 1));

		expect(names).toEqual(
			expect.arrayContaining(['components/portfolio/PrintButton.tsx', 'components/common/Header.tsx']),
		);
	});

	it('동적 import() 도 사슬로 인식한다', () => {
		expect(collectSpecifiers("const load = () => import('@/constant/resume');\nimport a from './a';")).toEqual([
			'./a',
			'@/constant/resume',
		]);
	});

	it('클라이언트 컴포넌트의 import 사슬은 이력서 원문·사례 데이터·아이콘에 닿지 않는다', () => {
		for (const file of clientFiles()) {
			const { files, packages } = reach(file);
			const relative = [...files].map(item =>
				item
					.slice(SRC.length + 1)
					.replace(/\.tsx?$/, '')
					.replace(/\/index$/, ''),
			);

			for (const forbidden of FORBIDDEN_FILES) expect(relative, `${file}: ${forbidden}`).not.toContain(forbidden);
			if (isPortfolioFile(file)) {
				for (const forbidden of FORBIDDEN_PACKAGES)
					expect([...packages], `${file}: ${forbidden}`).not.toContain(forbidden);
			}
		}
	});

	it('사슬 추적이 실제로 동작한다: 서버 컴포넌트 ui.tsx 는 covers 와 lucide-react 에 닿는다', () => {
		const { files, packages } = reach(join(SRC, 'components/portfolio/ui.tsx'));

		expect([...files].some(file => file.endsWith('portfolio/covers.ts'))).toBe(true);
		expect([...packages]).toContain('lucide-react');
	});

	it('links.ts 는 이력서 원문을 가져오지 않는다', () => {
		expect(readFileSync(join(ROOT, 'src/portfolio/links.ts'), 'utf8')).not.toMatch(/from\s+'@\/constant\/resume'/);
	});
});
