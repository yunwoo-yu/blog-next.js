import { getPrintOthers, getPrintReferences, PRINT_PORTFOLIO_URL } from '@/portfolio/print';

import PrintContacts from './PrintContacts';

/** 마지막 쪽: 대표 사례 밖의 작업 표, 기술 자료 링크, 연락처. */
const PrintOthers = () => {
	const others = getPrintOthers();

	return (
		<section
			data-print-page="others"
			data-print-others
			aria-labelledby="print-others-title"
			className="pf-sheet pf-sheet-break">
			<h2 id="print-others-title" className="pf-others-title">
				그 밖의 작업
			</h2>
			<table className="pf-others">
				<caption className="sr-only">대표 사례 밖에서 한 작업 {others.length}건</caption>
				<thead>
					<tr>
						<th scope="col">회사</th>
						<th scope="col">기간</th>
						<th scope="col">작업</th>
						<th scope="col">핵심</th>
					</tr>
				</thead>
				<tbody>
					{others.map(({ item, line }) => (
						<tr key={item.slug} data-other-item={item.slug}>
							<td>{item.organization}</td>
							<td>{item.period}</td>
							<th scope="row">{item.title}</th>
							<td>{line}</td>
						</tr>
					))}
				</tbody>
			</table>

			<section className="pf-block pf-keep" aria-labelledby="print-refs-title">
				<h3 id="print-refs-title">더 확인할 수 있는 기술 자료</h3>
				<ul className="pf-refs">
					{getPrintReferences().map(ref => (
						<li key={ref.url}>
							<p>
								<span className="pf-contact-label">{ref.label}</span>
								<a href={ref.url}>{ref.url}</a>
							</p>
							<p className="pf-ref-point">이 글에서 확인할 판단: {ref.point}</p>
						</li>
					))}
				</ul>
			</section>

			<section className="pf-block pf-keep" aria-labelledby="print-contact-title">
				<h3 id="print-contact-title">연락처</h3>
				<PrintContacts />
				<p className="pf-portfolio-url">
					<span className="pf-contact-label">웹 포트폴리오</span>
					<a href={PRINT_PORTFOLIO_URL}>{PRINT_PORTFOLIO_URL}</a>
				</p>
			</section>
		</section>
	);
};

export default PrintOthers;
