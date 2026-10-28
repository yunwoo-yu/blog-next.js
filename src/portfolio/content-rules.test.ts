import RESUME from '@/constant/resume';

import { CAREER_DETAIL } from './career-detail';
import { PORTFOLIO_CASES } from './cases';
import { EXHIBITS } from './exhibits';
import { STORIES } from './stories';

/** 화면에 나가는 문장만 모은다(stories 의 checks 는 화면에 나오지 않는 질문이라 제외). */
const publicTexts = () => [
	...RESUME.projects.flatMap(project => project.items.map(item => item.summary)),
	...CAREER_DETAIL.flatMap(career =>
		career.serviceGroups.flatMap(group =>
			group.projects.flatMap(project => [project.title, ...project.details.map(detail => detail.title)]),
		),
	),
	...PORTFOLIO_CASES.flatMap(item => [item.title, item.summary, ...item.keywords]),
	...STORIES.flatMap(story => [
		...story.decisions.flatMap(decision => [
			decision.question,
			...decision.options.flatMap(option => [option.name, option.reason]),
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
		...Object.values(exhibit.phases).flatMap(phases => phases.flatMap(phase => [phase.title, phase.caption])),
		...exhibit.nodes.flatMap(node => [node.label, node.labelBefore ?? '']),
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
