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
		position: '웹 프론트엔드 개발자 (팀원)',
		period: '2023.08 ~ 재직 중 (1년 9개월)',
		projects: [
			{
				title: 'AI Talker',
				description:
					'OpenAI의 Assistant API를 활용한 챗봇 웹 서비스와 개인용 챗봇 커스텀을 진행할 수 있는 어드민 서비스를 개발했습니다. Next.js로 서비스를 리뉴얼하며 전체 UI, 프로젝트 설계를 진행했고, 서비스의 코어 기능인 채팅, 미니 블로그 페이지를 담당하여 개발하고 있습니다.',
				date: '2024.12 ~ 진행 중',
				skills: ['Next.js', 'Nest.js', 'React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'zustand'],
				links: [{ title: '링크', url: 'https://www.aitalker.co.kr/aitalker' }],
				achievements: [
					{
						title: 'SSE 방식을 활용한 스트리밍 채팅 기능 개발',
						children: [
							{ title: '일관적이지 않은 Markdown 메세지를 HTML로 개선하여 일관적인 UX 제공' },
							{
								title: '채팅 페이지 역방향 무한스크롤 UI 구현',
								links: [
									{
										title: '관련 글',
										url: 'https://www.ycow-dev.com/blog/posts/next/reverse_infinite_scroll',
									},
								],
							},
						],
					},
					{
						title: '전체 UI 리뉴얼 및 Next.js 개발 환경 구축 및 마이그레이션',
						links: [
							{
								title: '리뉴얼 전',
								url: 'https://tarot.mirrordays.com',
							},
							{
								title: '리뉴얼 후',
								url: 'https://www.aitalker.co.kr/tarot',
							},
						],
					},
					{
						title: '유저별 동적 메타 태그를 적용하여, 맞춤형 SEO 최적화 및 개인화된 서비스 제공',
					},
					{
						title: 'ios Safari 브라우저 가상키보드 이슈 해결',
						links: [
							{
								title: '관련 글',
								url: 'https://www.ycow-dev.com/blog/posts/issues/ios_virtual_keyboards',
							},
						],
					},
				],
			},
			{
				title: 'AI Survey',
				date: '2024.08 ~ 2024.11',
				description:
					'OpenAI의 Assistant API를 활용한 서비스 개발 MVP 프로젝트로 AI와의 대화를 통해 원하는 설문지를 생성하고 설문을 진행할 수 있는 서비스를 개발 및 유지보수를 담당하고 있습니다.',
				skills: ['React', 'Nest.js', 'TypeScript', 'SCSS'],
				achievements: [
					{
						title:
							'AI(GPT-4o)와의 대화를 통해 원하는 설문을 자동 생성하는 MVP 서비스를 혼자서 기획·개발하여, AI 기반 서비스의 시장성과 기술적 가능성을 빠르게 검증',
					},
					{
						title:
							'프론트엔드(React) 전 영역과 서버(Nest.js)에서 OpenAI API 연동 및 스트리밍 채팅, 설문 데이터 생성 등 핵심 기능을 직접 구현',
					},
				],
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
