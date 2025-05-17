import { ResumeItemProps } from '@/components/resume/ResumeItem';
import { ResumeLinkProps } from '@/components/resume/ResumeLink';

export type Project = {
	title: string;
	description: string;
	date?: string;
	skills: string[];
	achievements: ResumeItemProps[];
	links?: ResumeLinkProps[];
	period?: string;
	teamSize?: number;
	role?: string;
};

export type Careers = {
	organization: string;
	position: string;
	period: string;
	location?: string;
	projects: Project[];
};

export type Resume = {
	careers: Careers[];
	education?: ResumeItemProps[];
	skills?: Record<string, string[]>;
};

const CAREERS: Careers[] = [
	{
		organization: '(주) 살린',
		position: 'I Lab | 웹 프론트엔드 개발자 (팀원)',
		period: '2023.08 ~ 재직 중 (1년 9개월)',
		projects: [
			{
				title: 'AI Talker',
				description: '프로젝트 1 설명',
				date: '',
				skills: ['React', 'TypeScript', 'Next.js'],
				achievements: [
					{
						title: '주요 업무 1',
					},
					{
						title: '주요 업무 2',
					},
				],
			},
			{
				title: '프로젝트 2',
				description: '프로젝트 2 설명',
				skills: ['Vue.js', 'JavaScript'],
				achievements: [{ title: '주요 업무 1' }, { title: '주요 업무 2' }],
			},
		],
	},
	{
		organization: '(주) 블루베이션',
		position: '웹 애플리케이션 개발',
		period: '2022.04 ~ 2022.07 (4개월)',
		projects: [
			{
				title: '프로젝트 1',
				description: '프로젝트 1 설명',
				skills: ['React', 'JavaScript'],
				achievements: [{ title: '주요 업무 1' }, { title: '주요 업무 2' }],
			},
			{
				title: '프로젝트 2',
				description: '프로젝트 2 설명',
				skills: ['Angular', 'TypeScript'],
				achievements: [{ title: '주요 업무 1' }, { title: '주요 업무 2' }],
			},
		],
	},
];

const RESUME: Resume = {
	careers: CAREERS,
};

export default RESUME;
