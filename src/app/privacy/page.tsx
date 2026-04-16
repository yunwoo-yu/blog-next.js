import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: '개인정보처리방침',
	description: 'Ycow Dev Blog 개인정보처리방침',
	robots: { index: true, follow: true },
};

const LAST_UPDATED = '2026년 4월 17일';

const PrivacyPage = () => {
	return (
		<section className="mx-auto max-w-3xl px-5 py-20">
			<div className="prose max-w-none dark:prose-invert">
				<h1>개인정보처리방침</h1>
				<p className="text-sm">최종 업데이트: {LAST_UPDATED}</p>
				<p>
					Ycow Dev Blog(<a href="https://ycow-dev.com">https://ycow-dev.com</a>, 이하 &ldquo;본 사이트&rdquo;)는
					이용자의 개인정보를 소중히 다루며, 「개인정보 보호법」등 관련 법령을 준수합니다. 본 방침은 본 사이트가
					이용자의 정보를 어떻게 수집·이용·보호하는지 안내합니다.
				</p>

				<h2>1. 수집하는 개인정보 항목</h2>
				<p>본 사이트는 별도의 회원가입 절차를 두지 않으며, 서비스 이용 과정에서 다음 항목이 자동 수집될 수 있습니다.</p>
				<ul>
					<li>접속 로그: IP 주소, 브라우저 종류, 운영체제, 접속 일시, 방문 페이지</li>
					<li>기기 및 이용 정보: 화면 해상도, 언어 설정, 리퍼러</li>
					<li>쿠키 기반 광고·분석 데이터</li>
					<li>댓글 작성 시: GitHub 계정 프로필(아이디, 아바타) — Giscus 연동을 통해 수집</li>
				</ul>

				<h2>2. 개인정보의 이용 목적</h2>
				<ul>
					<li>콘텐츠 제공 및 서비스 품질 개선</li>
					<li>접속 통계, 성능 분석, 오류 모니터링</li>
					<li>Google AdSense를 통한 광고 게재 및 맞춤 광고 제공</li>
					<li>댓글 기능 운영</li>
				</ul>

				<h2>3. 개인정보의 보유 및 이용 기간</h2>
				<p>
					수집된 정보는 수집 목적 달성 시 또는 관련 법령에서 정한 기간 동안만 보관하며, 목적 달성 후 지체 없이
					파기합니다. 광고 및 분석용 쿠키는 각 서비스 제공자의 정책에 따라 일정 기간 보관됩니다.
				</p>

				<h2>4. 쿠키(Cookie)의 사용</h2>
				<p>
					본 사이트는 이용자 경험 향상, 광고 게재, 이용 통계 분석을 위해 쿠키를 사용합니다. 쿠키는 이용자의 브라우저에
					저장되는 작은 텍스트 파일이며, 브라우저 설정을 통해 차단할 수 있습니다.
				</p>

				<h3>4-1. Google AdSense</h3>
				<p>
					Google을 포함한 제3자 공급업체는 쿠키를 사용하여 이용자의 본 사이트 및 기타 사이트 방문 정보를 기반으로 광고를
					게재합니다. Google은 DART 쿠키를 사용하여 이용자의 본 사이트 방문 이력을 바탕으로 광고를 표시할 수 있습니다.
				</p>
				<p>이용자는 아래 페이지에서 맞춤 광고를 비활성화하거나 제3자 쿠키 사용을 거부할 수 있습니다.</p>
				<ul>
					<li>
						Google 광고 설정:{' '}
						<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
							https://www.google.com/settings/ads
						</a>
					</li>
					<li>
						제3자 공급업체 쿠키 opt-out:{' '}
						<a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">
							https://www.aboutads.info
						</a>
					</li>
					<li>
						Network Advertising Initiative opt-out:{' '}
						<a href="https://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer">
							https://optout.networkadvertising.org
						</a>
					</li>
				</ul>

				<h3>4-2. 분석 도구</h3>
				<p>
					본 사이트는 Vercel Analytics 및 Vercel Speed Insights를 통해 익명화된 방문 통계와 웹 성능 데이터를 수집합니다.
				</p>

				<h2>5. 개인정보의 제3자 제공 및 위탁</h2>
				<p>
					본 사이트는 이용자의 동의 없이 개인정보를 제3자에게 판매·양도하지 않습니다. 다만, 서비스 운영을 위해 아래
					사업자에게 처리가 위탁되며, 각 사업자의 개인정보처리방침이 함께 적용됩니다.
				</p>
				<ul>
					<li>
						Google LLC — 광고(AdSense) 및 사이트 인증.{' '}
						<a href="https://policies.google.com/privacy?hl=ko" target="_blank" rel="noopener noreferrer">
							Google 개인정보처리방침
						</a>
					</li>
					<li>
						Vercel Inc. — 호스팅, 분석(Analytics), 성능 측정(Speed Insights).{' '}
						<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
							Vercel Privacy Policy
						</a>
					</li>
					<li>
						GitHub, Inc. — 댓글 시스템(Giscus).{' '}
						<a
							href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
							target="_blank"
							rel="noopener noreferrer">
							GitHub Privacy Statement
						</a>
					</li>
				</ul>

				<h2>6. 이용자의 권리</h2>
				<ul>
					<li>개인정보 열람·정정·삭제 요청</li>
					<li>맞춤 광고 거부(위 4-1 링크 참조)</li>
					<li>브라우저 설정을 통한 쿠키 저장 거부</li>
				</ul>
				<p>요청은 아래 연락처로 접수해 주시기 바랍니다.</p>

				<h2>7. 개인정보 보호책임자</h2>
				<ul>
					<li>성명: 유윤우</li>
					<li>
						이메일: <a href="mailto:skypnal12@gmail.com">skypnal12@gmail.com</a>
					</li>
				</ul>

				<h2>8. 개정 이력</h2>
				<ul>
					<li>2026-04-17: 최초 작성</li>
				</ul>
			</div>
		</section>
	);
};

export default PrivacyPage;
