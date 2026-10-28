import { META_AUTHOR_NAME } from '@/constant';
import RESUME from '@/constant/resume';
import { PORTFOLIO_KEY_RESULTS } from '@/portfolio/overview';
import {
	getPrintCareers,
	getPrintFeatured,
	getPrintOthers,
	getPrintPages,
	getPrintSkills,
	getTotalCareerDuration,
	PRINT_IDENTITY_CLAIM,
	PRINT_PORTFOLIO_URL,
	PRINT_ROLE,
} from '@/portfolio/print';

import PrintContacts from './PrintContacts';
import { PrintLabel, PrintSheet } from './PrintParts';

const TOC_ITEM_CLASS = 'flex gap-[2mm] break-inside-avoid border-t-[0.5pt] border-print-rule py-[2mm]';
const TOC_NUM_CLASS = 'w-[8mm] flex-none text-[11pt] font-bold tabular-nums text-print-accent';
const TOC_PAGE_CLASS = 'text-[10.5pt] font-bold tabular-nums text-print-ink';

const joinNames = (names: string[], separator: string) => names.join(separator);

/** 표지: 한 쪽에 정체성·경력·연락처·기술 스택·대표 숫자 2개·대표 사례 목차를 담는다. 꼬리말은 찍지 않는다. */
const PrintCover = () => {
	const careers = getPrintCareers();
	const featured = getPrintFeatured();
	const pages = getPrintPages();
	const organizations = careers.map(career => career.organization);

	return (
		<PrintSheet
			data-print-page="cover"
			aria-labelledby="print-title"
			breakBefore={false}
			className="flex flex-col [&>*]:shrink-0">
			<header className="border-b-[0.75pt] border-print-ink pb-[7mm]">
				<p className="text-[10pt] font-bold text-print-accent">{PRINT_ROLE}</p>
				<h1
					id="print-title"
					className="mt-[2mm] text-[32pt] font-extrabold leading-[1.2] tracking-[-0.02em] text-print-ink">
					{META_AUTHOR_NAME}
				</h1>
				<p className="text-[11pt] text-print-ink">
					총 경력 {getTotalCareerDuration()} · {joinNames(organizations, ' / ')}
				</p>
				<p className="max-w-[160mm] text-[11pt]">
					{joinNames(organizations, '·')}에서 {RESUME.projects.length}개 서비스의 프론트엔드를 맡았습니다.{' '}
					{PRINT_IDENTITY_CLAIM}
				</p>
			</header>

			<div className="mt-[7mm] grid grid-cols-2 gap-[10mm]">
				<section aria-labelledby="print-careers">
					<PrintLabel id="print-careers">경력</PrintLabel>
					<ul>
						{careers.map(({ organization, period }) => (
							<li key={organization} className="mb-[2mm] flex flex-col">
								<span className="text-[11pt] font-bold text-print-ink">{organization}</span>
								<span>{period}</span>
							</li>
						))}
					</ul>
				</section>
				<section aria-labelledby="print-contacts">
					<PrintLabel id="print-contacts">연락처</PrintLabel>
					<PrintContacts />
				</section>
			</div>

			<section aria-labelledby="print-skills" className="mt-[7mm]">
				<PrintLabel id="print-skills">기술 스택</PrintLabel>
				<ul className="flex flex-wrap gap-[1.5mm]">
					{getPrintSkills().map(skill => (
						<li
							key={skill}
							className="rounded-[1mm] border-[0.75pt] border-print-ink-3 bg-print-fill px-[2.5mm] py-[0.5mm] text-[9pt] font-bold text-print-ink">
							{skill}
						</li>
					))}
				</ul>
			</section>

			<ul className="mt-[6mm] grid grid-cols-2 gap-[5mm]" aria-label="대표 숫자">
				{PORTFOLIO_KEY_RESULTS.map(result => (
					<li key={result.value} className="border-[1pt] border-print-ink px-[5mm] py-[4mm]">
						<p className="text-[9pt] font-bold text-print-accent">{result.tag}</p>
						<p className="mt-[1mm] text-[26pt] font-bold text-print-ink">{result.value}</p>
						<p className="mt-[1mm] text-[9pt]">{result.label}</p>
					</li>
				))}
			</ul>

			<section aria-labelledby="print-toc" className="mt-[7mm]">
				<PrintLabel id="print-toc">대표 사례</PrintLabel>
				<ol>
					{featured.map(({ item, tocPhrase }, index) => (
						<li key={item.slug} data-toc-item className={TOC_ITEM_CLASS}>
							<span className={TOC_NUM_CLASS}>{index + 1}</span>
							<span className="min-w-0 flex-1">
								<span className="flex items-baseline">
									<span className="text-[10.5pt] font-bold text-print-ink">{item.title}</span>
									<span
										className="mx-[2mm] min-w-[6mm] flex-1 border-b-[1pt] border-dotted border-print-ink-3"
										aria-hidden="true"
									/>
									<span data-toc-page className={TOC_PAGE_CLASS}>
										{pages.caseStarts[index]}
									</span>
								</span>
								<span className="block text-[9pt] text-print-ink-3">
									{tocPhrase} · {item.organization} · {item.period}
								</span>
							</span>
						</li>
					))}
					<li data-toc-item data-toc-others className={TOC_ITEM_CLASS}>
						<span className={TOC_NUM_CLASS} aria-hidden="true" />
						<span className="min-w-0 flex-1">
							<span className="flex items-baseline">
								<span className="text-[10.5pt] font-bold text-print-ink">그 밖의 작업 {getPrintOthers().length}건</span>
								<span
									className="mx-[2mm] min-w-[6mm] flex-1 border-b-[1pt] border-dotted border-print-ink-3"
									aria-hidden="true"
								/>
								<span data-toc-page className={TOC_PAGE_CLASS}>
									{pages.others}
								</span>
							</span>
						</span>
					</li>
				</ol>
			</section>

			<p className="mt-auto text-[8.5pt] text-print-ink-3">
				수치는 측정·관측·전언으로 출처를 구분해 표기했습니다. 사례 {featured.length + getPrintOthers().length}개 전문:{' '}
				<a href={PRINT_PORTFOLIO_URL}>{PRINT_PORTFOLIO_URL}</a>
			</p>
		</PrintSheet>
	);
};

export default PrintCover;
