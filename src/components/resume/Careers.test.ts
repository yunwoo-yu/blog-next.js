import RESUME from '@/constant/resume';

import { PROJECT_HIGHLIGHTS } from './Careers';

const projectsByTitle = new Map(
	RESUME.careers
		.flatMap(career => career.serviceGroups.flatMap(group => group.projects))
		.map(project => [project.title, project]),
);

describe('PROJECT_HIGHLIGHTS', () => {
	it('모든 하이라이트 키는 실제 프로젝트 제목과 일치한다', () => {
		for (const title of Object.keys(PROJECT_HIGHLIGHTS)) {
			expect(projectsByTitle.has(title), `존재하지 않는 프로젝트 제목: ${title}`).toBe(true);
		}
	});

	it('모든 하이라이트 문자열은 같은 인덱스의 상세 문장에 존재한다', () => {
		for (const [title, groups] of Object.entries(PROJECT_HIGHLIGHTS)) {
			const details = projectsByTitle.get(title)?.details ?? [];

			groups.forEach((highlights, index) => {
				for (const highlight of highlights) {
					expect(
						details[index]?.title.includes(highlight),
						`[${title}] 상세 ${index}번 문장에 하이라이트가 없음: ${highlight}`,
					).toBe(true);
				}
			});
		}
	});
});
