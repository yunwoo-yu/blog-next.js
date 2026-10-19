// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';

import Education from './Education';

describe('학력', () => {
	it('한국방송통신대학교 컴퓨터과학과 재학 중을 보여 준다', () => {
		render(<Education />);

		expect(screen.getByRole('heading', { level: 3, name: '학력' })).toBeInTheDocument();
		expect(screen.getByText('한국방송통신대학교 컴퓨터과학과')).toBeInTheDocument();
		expect(screen.getByText(/재학 중/)).toBeInTheDocument();
	});
});
