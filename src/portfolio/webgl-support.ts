/**
 * 브라우저에서 WebGL2 컨텍스트를 만들 수 있는지 확인한다. three 의 WebGLRenderer 가 WebGL2 만 요청하므로
 * WebGL1 만 되는 기기는 지원하지 않는 것으로 본다. hydration 이후 클라이언트에서만 호출한다.
 */
export const detectWebGL = (): boolean => {
	if (typeof document === 'undefined') return false;

	const canvas = document.createElement('canvas');

	try {
		const gl = canvas.getContext('webgl2');
		if (!gl) return false;

		// 확인용 컨텍스트가 GPU 자원을 쥐고 있지 않도록 바로 반납한다.
		gl.getExtension('WEBGL_lose_context')?.loseContext();

		return true;
	} catch {
		return false;
	} finally {
		canvas.width = 0;
		canvas.height = 0;
	}
};
