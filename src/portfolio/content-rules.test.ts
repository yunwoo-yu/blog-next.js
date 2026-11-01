import RESUME from '@/constant/resume';

import { CAREER_DETAIL } from './career-detail';
import { PORTFOLIO_CASES } from './cases';
import { EXAMPLE_SCREENS } from './examples';
import { EXHIBITS } from './exhibits';
import { PORTFOLIO_KEY_RESULTS } from './overview';
import { PRINT_FEATURED, PRINT_GLOSSARY, PRINT_OTHERS } from './print';
import { STORIES } from './stories';

/** 화면에 나가는 문장만 모은다(stories 의 checks 는 화면에 나오지 않는 질문이라 제외). */
const publicTexts = () => [
	...RESUME.projects.flatMap(project => project.items.map(item => item.summary)),
	...CAREER_DETAIL.flatMap(career =>
		career.serviceGroups.flatMap(group =>
			group.projects.flatMap(project => [project.title, ...project.details.map(detail => detail.title)]),
		),
	),
	...PRINT_FEATURED.flatMap(entry => [entry.oneLine, entry.limit]),
	...PRINT_OTHERS.map(entry => entry.line),
	...PRINT_GLOSSARY.map(entry => entry.description),
	...PORTFOLIO_KEY_RESULTS.map(entry => entry.label),
	...PORTFOLIO_CASES.flatMap(item => [item.title, item.summary, ...item.keywords]),
	...STORIES.flatMap(story => [
		...story.decisions.flatMap(decision => [
			decision.question,
			...decision.options.flatMap(option => [option.label, option.name, option.reason]),
		]),
		...story.troubles.flatMap(trouble => [
			trouble.problem,
			trouble.fix,
			trouble.diagram?.caption ?? '',
			...(trouble.diagram?.steps.map(step => step.label) ?? []),
			...(trouble.diagram?.actors ?? []),
		]),
	]),
	...EXHIBITS.flatMap(exhibit => [
		exhibit.headline,
		exhibit.shortTitle,
		...exhibit.ownedParts,
		...Object.values(exhibit.callouts),
	]),
];

/** 마침표·물음표·느낌표·'。' 뒤에 공백이나 끝이 오면 한 문장으로 센다(Next.js, 2026.03 처럼 문장 중간의 점은 세지 않는다). */
const countSentences = (text: string) => text.split(/[.?!。](?=\s|$)/).filter(part => part.trim().length > 0).length;

describe('포트폴리오 본문 규칙', () => {
	it('상세 원문의 강조 문구는 같은 문단 안에 그대로 들어 있다', () => {
		for (const career of CAREER_DETAIL) {
			for (const group of career.serviceGroups) {
				for (const project of group.projects) {
					for (const detail of project.details) {
						for (const highlight of detail.highlights) {
							expect(detail.title.includes(highlight), `[${project.title}] 본문에 없는 강조 문구: ${highlight}`).toBe(
								true,
							);
						}
					}
				}
			}
		}
	});

	it('화살표(→)를 쓰지 않는다', () => {
		for (const text of publicTexts()) expect(text, text).not.toContain('→');
	});

	it('확인된 정정에 어긋나는 표현이 없다', () => {
		const banned = [
			/사이트맵/,
			/P091/,
			/27개 API/,
			/16개 라우트/,
			/프론트엔드 전 영역/,
			/Unity WebGL 개발(을|은) (구축|담당했)/,
			/FE\/BE 병렬/,
		];

		for (const text of publicTexts()) {
			for (const pattern of banned) expect(text, `${pattern}`).not.toMatch(pattern);
		}
	});

	it('통합 챗봇에서 본인 몫이 작거나 근거 없는 영역(프롬프트·모델 설정·비용 통계·광고 정책)을 공개 문구에 쓰지 않는다', () => {
		const story = STORIES.find(story => story.slug === 'ai-chatbot-cms')!;
		// 화면에 나가는 모든 글: 공통 공개 문구 + 사례 단계 본문 + 예시 화면(데이터·alt·caption).
		const texts = [
			...publicTexts(),
			...PORTFOLIO_CASES.flatMap(item => item.stages.map(stage => stage.text)),
			...EXAMPLE_SCREENS.map(example => JSON.stringify(example)),
		];

		expect(story.checks.join(' ')).toMatch(/프롬프트·모델 설정·비용 통계·광고 정책은 본인 몫이 작거나 근거가 없어/);
		for (const text of texts) expect(text, text).not.toMatch(/프롬프트 설정|모델 설정|비용 통계|광고 정책/);
	});

	it('Suspense 는 경계를 둔 사실로만 서술하고 FCP 수치와 인과를 붙이지 않는다', () => {
		const avatar = RESUME.projects
			.flatMap(project => project.items)
			.find(item => item.caseSlug === 'avatar-studio-performance')!;

		expect(avatar.summary).toBe(
			'인수한 WebGL 아바타 서비스의 3D 뷰에 Suspense 경계를 두고 CDN 자산 경로를 환경 변수 상수로 정리했습니다. 첫 콘텐츠 표시(FCP)는 3초 이상에서 400~600ms로 줄었습니다(Lighthouse 측정).',
		);
		expect(avatar.summary.length).toBeLessThanOrEqual(130);
		expect(PRINT_GLOSSARY.find(entry => entry.term === 'Suspense')?.description).toBe(
			'화면 일부의 로딩을 나눠 다루는 React 기능',
		);
		for (const text of publicTexts()) {
			expect(text, text).not.toMatch(/로딩 경계|3D 뷰의 로딩을|Suspense[^.]*로 (개선|단축)/);
		}
	});

	it('FCP는 확인된 Lighthouse 측정으로 쓰고 Suspense·CDN과의 인과는 제한한다', () => {
		const avatar = STORIES.find(story => story.slug === 'avatar-studio-performance')!;

		expect(avatar.checks.join(' ')).toContain('Lighthouse 로 사용자가 측정(확인됨)');
		expect(avatar.checks.join(' ')).not.toContain('측정 원자료를 찾지 못했습니다');
		expect(avatar.decisions[0].options[0].reason).toContain('인과는 확인하지 못했습니다');
		expect(avatar.troubles[0].diagram?.steps.map(step => step.label).join(' ')).toContain('효과 미확인');
		expect(avatar.decisions[0].options.find(option => option.name.includes('CDN'))?.reason).toContain(
			'인과는 확인하지 못했습니다',
		);
		for (const text of publicTexts()) {
			expect(text, text).not.toMatch(
				/FCP[^.]*이력서 기재|(?:FCP|400~600ms)[^.]*(?:원자료|(?:측정(?:값| 결과)?|수치)[^.]*(?:확인 못|확인하지 못))/,
			);
		}
	});

	it('마이데이터는 구현 사실만 쓰고 심사·운영 성과나 성과 수치를 주장하지 않는다', () => {
		const item = PORTFOLIO_CASES.find(item => item.slug === 'mydata-integration')!;
		const resume = RESUME.projects.flatMap(project => project.items).find(entry => entry.caseSlug === item.slug);
		const exhibit = EXHIBITS.find(exhibit => exhibit.slug === item.slug)!;
		const story = STORIES.find(story => story.slug === item.slug)!;
		const print = PRINT_OTHERS.find(entry => entry.slug === item.slug)!;
		const texts = [
			resume!.summary,
			item.summary,
			...item.stages.map(stage => stage.text),
			JSON.stringify(exhibit),
			JSON.stringify(story.decisions),
			JSON.stringify(story.troubles),
			print.line,
		];

		for (const text of texts) {
			expect(text, text).not.toMatch(/반려|심사|성과|운영|출시|달성|증가|감소|개선|\d[\d.,~]*\s*(?:%|건|ms|초)/);
		}
		for (const text of [item.stages[2].text, exhibit.callouts.outcome, print.line]) {
			expect(text).toContain('복원');
			expect(text).toMatch(/실패한 (항목|기관)만 안내/);
		}
		expect(story.checks.join(' ')).not.toContain('반려');
		for (const text of publicTexts()) expect(text, text).not.toContain('반려');
	});

	it('통합 챗봇 용어 풀이는 상세 화면의 첫 등장에 한 번씩만 둔다', () => {
		const item = PORTFOLIO_CASES.find(item => item.slug === 'ai-chatbot-cms')!;
		const story = STORIES.find(story => story.slug === item.slug)!;
		const text = [
			item.summary,
			item.stages[0].text,
			item.stages[1].text,
			JSON.stringify(story.decisions),
			JSON.stringify(story.troubles),
			item.stages[2].text,
		].join(' ');

		for (const term of [
			'메타데이터',
			'Open Graph',
			'CMS',
			'CSR',
			'SSR',
			'스트림',
			'폴링',
			'벡터 스토어',
			'App Router',
			'generateMetadata',
		]) {
			expect(text.indexOf(`${term}(`), term).toBe(text.indexOf(term));
			expect(text.split(`${term}(`).length - 1, term).toBe(1);
		}
	});

	it('Swing 결과에서 사용자 웹 단독 개발과 CMS 프론트엔드 개발을 구분한다', () => {
		const result = PORTFOLIO_CASES.find(item => item.slug === 'swing-frontend')!.stages.find(
			stage => stage.id === 'result',
		)!;

		expect(result.text).toContain(
			'사용자 웹은 단독 개발하고 관리자 CMS 프론트엔드도 개발해, 인증부터 가상 오피스 진입까지 연결했습니다.',
		);
		for (const text of publicTexts()) expect(text, text).not.toMatch(/한 명|CMS[^.]*단독/);
	});

	it('과장하는 수식어를 쓰지 않는다', () => {
		for (const text of publicTexts()) expect(text, text).not.toMatch(/안정적으로|효율적으로|견고한/);
	});

	it('트러블에 코드 스니펫을 싣지 않는다', () => {
		for (const story of STORIES) {
			for (const trouble of story.troubles) expect('code' in trouble, `${story.slug}: ${trouble.problem}`).toBe(false);
		}
	});

	it('회사 코드의 식별자·내부 이름이 화면 문장에 나오지 않는다', () => {
		const banned = [
			/useDonationDuplicateCheck|getActionsForStatus|totalPaymentPrice|NICEPAY|epayNo/,
			/usePolicyFilter|useIntegratedSearchFilter|zodResolverLoose|tryRefreshTokens|GeneralContracts/,
			/View3D|NewItemEditorPage|DesktopPageShell|useNexBe|useStep\b|getMetaTags|getTalker/,
			/I00[1-7]|authCode|newTalker|isInitialLoadRef|keysArray|cdnLists|_retry|textDelta|run\.completed/,
			/\[code\]|layout\.tsx|merchantOrderId|PAYMENT_REDIRECTED_KEY|sessionStorage|localStorage/,
			/\?step=|isSubmit|isStream|before-complete|latest-complete|checkingToken|loginUrl|beforeOrderId/,
		];

		for (const text of publicTexts()) {
			for (const pattern of banned) expect(text, `${pattern}`).not.toMatch(pattern);
		}
	});

	it('도식의 참여자는 2~4명이고 단계의 from/to 는 참여자 범위 안이다', () => {
		for (const story of STORIES) {
			for (const trouble of story.troubles) {
				const { diagram } = trouble;
				if (!diagram) continue;

				expect(diagram.actors.length, story.slug).toBeGreaterThanOrEqual(2);
				expect(diagram.actors.length, story.slug).toBeLessThanOrEqual(4);
				expect(diagram.steps.length, story.slug).toBeGreaterThan(0);
				for (const step of diagram.steps) {
					for (const index of [step.from, step.to]) {
						expect(Number.isInteger(index), `${story.slug}: ${step.label}`).toBe(true);
						expect(index, `${story.slug}: ${step.label}`).toBeGreaterThanOrEqual(0);
						expect(index, `${story.slug}: ${step.label}`).toBeLessThan(diagram.actors.length);
					}
					expect(step.label.trim().length, story.slug).toBeGreaterThan(0);
				}
			}
		}
	});

	it('모든 판단 옵션의 라벨은 비어 있지 않은 12자 이하이며 한 결정 안에서 겹치지 않는다', () => {
		for (const story of STORIES) {
			for (const decision of story.decisions) {
				const labels = decision.options.map(option => option.label);

				for (const label of labels) {
					expect(label.trim().length, `${story.slug}: ${decision.question}`).toBeGreaterThan(0);
					expect(label.length, `${story.slug}: ${label}`).toBeLessThanOrEqual(12);
				}
				expect(new Set(labels).size, `${story.slug}: ${decision.question}`).toBe(labels.length);
			}
		}
	});

	it('버린 안(rejected)에는 이유가 비어 있지 않게 적는다', () => {
		for (const story of STORIES) {
			for (const decision of story.decisions) {
				for (const option of decision.options.filter(item => item.verdict === 'rejected'))
					expect(option.reason.trim().length, `${story.slug}: ${option.name}`).toBeGreaterThan(0);
			}
		}
	});

	it('사례마다 도식이 붙은 트러블이 1~2개이고 도식은 4~6단계다', () => {
		for (const story of STORIES) {
			const diagrams = story.troubles.flatMap(trouble => (trouble.diagram ? [trouble.diagram] : []));

			expect(diagrams.length, story.slug).toBeGreaterThanOrEqual(1);
			expect(diagrams.length, story.slug).toBeLessThanOrEqual(2);
			for (const diagram of diagrams) {
				expect(diagram.steps.length, story.slug).toBeGreaterThanOrEqual(4);
				expect(diagram.steps.length, story.slug).toBeLessThanOrEqual(6);
			}
		}
	});

	it('분량 상한: 트러블 3개·판단 2개 이하, 판단 이유 1문장, 트러블 문제·해결 2문장 이하', () => {
		for (const story of STORIES) {
			expect(story.troubles.length, story.slug).toBeLessThanOrEqual(3);
			expect(story.decisions.length, story.slug).toBeLessThanOrEqual(2);
			for (const decision of story.decisions) {
				for (const option of decision.options)
					expect(countSentences(option.reason), `${story.slug}: ${option.name}`).toBe(1);
			}
			for (const trouble of story.troubles) {
				expect(countSentences(trouble.problem), `${story.slug}: ${trouble.problem}`).toBeLessThanOrEqual(2);
				expect(countSentences(trouble.fix), `${story.slug}: ${trouble.fix}`).toBeLessThanOrEqual(2);
			}
		}
	});

	it('상세 원문 분량 상한: 문제 3문장, 해결 4문장(문단 2개), 결과 2문장 이하', () => {
		const limits = [3, 4, 2];

		for (const career of CAREER_DETAIL) {
			for (const group of career.serviceGroups) {
				for (const project of group.projects) {
					project.details.forEach((detail, index) => {
						expect(countSentences(detail.title), `${project.title} [${index}]`).toBeLessThanOrEqual(limits[index]);
						expect(detail.title.split('\n\n').length, `${project.title} [${index}]`).toBeLessThanOrEqual(2);
					});
				}
			}
		}
	});

	it('상세 원문의 문단은 빈 줄로 나누고 한 문단은 세 문장을 넘지 않는다', () => {
		for (const career of CAREER_DETAIL) {
			for (const group of career.serviceGroups) {
				for (const project of group.projects) {
					for (const detail of project.details) {
						for (const paragraph of detail.title.split('\n\n')) {
							const sentences = paragraph.split(/\.\s+/).filter(Boolean);

							expect(paragraph.trim().length, project.title).toBeGreaterThan(0);
							expect(sentences.length, `${project.title}: ${paragraph}`).toBeLessThanOrEqual(3);
						}
					}
				}
			}
		}
	});
});
