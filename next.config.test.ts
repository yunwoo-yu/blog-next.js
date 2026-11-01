import nextConfig from './next.config.mjs';

describe('포트폴리오 영구 리다이렉트', () => {
	it('공개된 SSR 사례 URL을 통합 챗봇 사례로 308 이동한다', async () => {
		expect(await nextConfig.redirects!()).toContainEqual({
			source: '/portfolio/ai-chatbot-ssr',
			destination: '/portfolio/ai-chatbot-cms',
			statusCode: 308,
		});
	});
});
