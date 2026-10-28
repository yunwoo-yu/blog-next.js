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
	PRINT_PORTFOLIO_URL,
	PRINT_ROLE,
} from '@/portfolio/print';

import PrintContacts from './PrintContacts';

const joinNames = (names: string[], separator: string) => names.join(separator);

/** 표지: 한 쪽에 정체성·경력·연락처·기술 스택·대표 숫자 2개·대표 사례 목차를 담는다. 꼬리말은 찍지 않는다. */
const PrintCover = () => {
	const careers = getPrintCareers();
	const featured = getPrintFeatured();
	const pages = getPrintPages();
	const organizations = careers.map(career => career.organization);

	return (
		<section data-print-page="cover" aria-labelledby="print-title" className="pf-sheet pf-cover">
			<header>
				<p className="pf-eyebrow">{PRINT_ROLE}</p>
				<h1 id="print-title" className="pf-name">
					{META_AUTHOR_NAME}
				</h1>
				<p className="pf-total">
					총 경력 {getTotalCareerDuration()} · {joinNames(organizations, ' / ')}
				</p>
				<p className="pf-identity">
					{joinNames(organizations, '·')}에서 {RESUME.projects.length}개 서비스의 프론트엔드를 맡았습니다. 결제
					금액·검색 조건·인증 토큰처럼 어긋나기 쉬운 상태의 기준을 한 곳에 두는 일을 해 왔습니다.
				</p>
			</header>

			<div className="pf-cover-grid">
				<section aria-labelledby="print-careers">
					<h2 id="print-careers" className="pf-label">
						경력
					</h2>
					<ul className="pf-careers">
						{careers.map(({ organization, period }) => (
							<li key={organization}>
								<span className="pf-career-org">{organization}</span>
								<span>{period}</span>
							</li>
						))}
					</ul>
				</section>
				<section aria-labelledby="print-contacts">
					<h2 id="print-contacts" className="pf-label">
						연락처
					</h2>
					<PrintContacts />
				</section>
			</div>

			<section aria-labelledby="print-skills" className="pf-cover-block">
				<h2 id="print-skills" className="pf-label">
					기술 스택
				</h2>
				<ul className="pf-skills">
					{getPrintSkills().map(skill => (
						<li key={skill}>{skill}</li>
					))}
				</ul>
			</section>

			<ul className="pf-stats pf-cover-block" aria-label="대표 숫자">
				{PORTFOLIO_KEY_RESULTS.map(result => (
					<li key={result.value} className="pf-stat">
						<p className="pf-stat-tag">{result.tag}</p>
						<p className="pf-stat-value">{result.value}</p>
						<p className="pf-stat-label">{result.label}</p>
					</li>
				))}
			</ul>

			<section aria-labelledby="print-toc" className="pf-cover-block">
				<h2 id="print-toc" className="pf-label">
					대표 사례
				</h2>
				<ol className="pf-toc">
					{featured.map(({ item, tocPhrase }, index) => (
						<li key={item.slug} data-toc-item>
							<span className="pf-toc-num">{index + 1}</span>
							<span className="pf-toc-main">
								<span className="pf-toc-line">
									<span className="pf-toc-title">{item.title}</span>
									<span className="pf-toc-leader" aria-hidden="true" />
									<span className="pf-toc-page">{pages.caseStarts[index]}</span>
								</span>
								<span className="pf-toc-sub">
									{tocPhrase} · {item.organization} · {item.period}
								</span>
							</span>
						</li>
					))}
					<li data-toc-item data-toc-others>
						<span className="pf-toc-num" aria-hidden="true" />
						<span className="pf-toc-main">
							<span className="pf-toc-line">
								<span className="pf-toc-title">그 밖의 작업 {getPrintOthers().length}건</span>
								<span className="pf-toc-leader" aria-hidden="true" />
								<span className="pf-toc-page">{pages.others}</span>
							</span>
						</span>
					</li>
				</ol>
			</section>

			<p className="pf-cover-note">
				수치는 측정·관측·전언으로 출처를 구분해 표기했습니다. 사례 {featured.length + getPrintOthers().length}개 전문:{' '}
				<a href={PRINT_PORTFOLIO_URL}>{PRINT_PORTFOLIO_URL}</a>
			</p>
		</section>
	);
};

export default PrintCover;
