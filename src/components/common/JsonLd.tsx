interface JsonLdProps {
	data: Record<string, unknown>;
}

/** 검색엔진용 구조화 데이터. 값은 전부 빌드 타임의 자체 콘텐츠라 외부 입력이 섞이지 않는다. */
const JsonLd = ({ data }: JsonLdProps) => (
	<script
		type="application/ld+json"
		// biome-ignore lint/security/noDangerouslySetInnerHtml: ld+json은 스크립트 태그 안에 직렬화해 넣는 것이 표준 방식이다
		dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
	/>
);

export default JsonLd;
