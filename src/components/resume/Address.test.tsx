// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';

import Address from './Address';

describe('연락처', () => {
	it('이메일·깃허브·블로그만 보여 주고 포트폴리오 링크는 싣지 않는다', () => {
		render(<Address />);

		expect(screen.getAllByRole('link').map(link => link.textContent)).toEqual([
			'skypnal12@gmail.com',
			'https://github.com/yunwoo-yu',
			'https://www.ycow-dev.com',
		]);
		expect(document.body.textContent).not.toContain('포트폴리오');
	});
});
