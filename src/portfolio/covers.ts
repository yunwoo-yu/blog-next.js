import type { LucideIcon } from 'lucide-react';
import {
	Bot,
	Boxes,
	CreditCard,
	Gauge,
	Globe,
	HeartHandshake,
	KeyRound,
	Layers,
	Search,
	ShieldCheck,
} from 'lucide-react';

/** 공개 화면이 없는 사례에 쓰는 생성형 표지. 실제 화면처럼 보이지 않도록 아이콘과 색 면만 쓴다. */
export interface CaseCoverStyle {
	icon: LucideIcon;
	/** 표지 면과 아이콘 색 (Tailwind 클래스 전체를 적어 정적 추출되게 한다) */
	tone: string;
}

const BLUE = 'bg-pf-blue-50 text-pf-blue-700';
const MINT = 'bg-pf-tone-mint-bg text-pf-tone-mint-fg';
const VIOLET = 'bg-pf-tone-violet-bg text-pf-tone-violet-fg';
const AMBER = 'bg-pf-tone-amber-bg text-pf-tone-amber-fg';
const ROSE = 'bg-pf-tone-rose-bg text-pf-tone-rose-fg';
const SLATE = 'bg-pf-tone-slate-bg text-pf-tone-slate-fg';

export const CASE_COVERS: Record<string, CaseCoverStyle> = {
	'wellomarket-checkout': { icon: CreditCard, tone: BLUE },
	'wello-responsive-search': { icon: Search, tone: SLATE },
	'donation-duplicate-guard': { icon: HeartHandshake, tone: ROSE },
	'mydata-integration': { icon: ShieldCheck, tone: MINT },
	'wellobiz-chakra-zod': { icon: Layers, tone: VIOLET },
	'admin-session-refresh': { icon: KeyRound, tone: AMBER },
	'ai-chatbot-cms': { icon: Bot, tone: VIOLET },
	'ai-chatbot-ssr': { icon: Globe, tone: BLUE },
	'swing-frontend': { icon: Boxes, tone: MINT },
	'avatar-studio-performance': { icon: Gauge, tone: AMBER },
};

export const getCaseCover = (slug: string): CaseCoverStyle => CASE_COVERS[slug] ?? { icon: Layers, tone: SLATE };
