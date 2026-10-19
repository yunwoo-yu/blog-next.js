// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';

import RESUME, { getSkills } from '@/constant/resume';

import Skills from './Skills';

describe('기술 스택', () => {
	it('쓰는 기술을 중복 없이 한 번씩 배지로 보여 준다', () => {
		render(<Skills />);

		const badges = screen.getAllByRole('listitem').map(item => item.textContent);

		expect(badges).toEqual(getSkills(RESUME.careers));
		expect(new Set(badges.map(badge => badge?.toLowerCase())).size).toBe(badges.length);
	});
});
