import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { getCaseCover } from '@/portfolio/covers';
import type { ServiceScreen } from '@/portfolio/exhibits';
import { cn } from '@/utils/utils';

/** 포트폴리오 공용 조각. 모두 서버 컴포넌트라 클라이언트 번들을 늘리지 않는다. */

export const FOCUS_RING =
	'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pf-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white';

/** 파랑 면 버튼의 공통 색(흰 글자). 호버는 한 단계 진한 파랑. */
export const PRIMARY_BUTTON_CLASS = 'bg-pf-blue-700 text-white hover:bg-[#1957c2]';

/** 본문 크기의 링크. 파랑 500 은 본문 크기에서 대비가 모자라 700 을 쓰고 밑줄로 링크임을 드러낸다. */
export const TEXT_LINK_CLASS = 'font-medium text-pf-blue-700 underline underline-offset-4 hover:no-underline';

/** 본문 컬럼. 단일 열, 최대 720px, 가운데 정렬. */
export const Column = ({ children, className }: { children: ReactNode; className?: string }) => (
	<div className={cn('mx-auto w-full max-w-[720px] px-5 sm:px-6', className)}>{children}</div>
);

interface SectionTitleProps {
	id: string;
	children: ReactNode;
	className?: string;
}

export const SectionTitle = ({ id, children, className }: SectionTitleProps) => (
	<h3
		id={id}
		className={cn(
			'break-keep text-[22px] font-bold leading-[1.4] tracking-[-0.02em] text-pf-gray-900 md:text-[24px]',
			className,
		)}>
		{children}
	</h3>
);

/** 목록 위의 소제목과 개수. */
export const ListHeader = ({ title, count, id }: { title: string; count?: number; id?: string }) => (
	<h4 id={id} className="flex items-baseline gap-1.5 pb-2 pt-6 text-[17px] font-bold text-pf-gray-900">
		{title}
		{count !== undefined && (
			<span className="text-[15px] font-normal text-pf-gray-600">
				<span className="sr-only">, </span>
				{count}
				<span className="sr-only">개</span>
			</span>
		)}
	</h4>
);

/** 56px 둥근 썸네일. 공개 화면 캡처가 없으면 사례별 아이콘 면. 제목이 옆에 있으므로 장식으로 둔다. */
export const Thumbnail = ({ screen, slug }: { screen?: ServiceScreen; slug?: string }) => {
	const cover = slug ? getCaseCover(slug) : undefined;
	const Icon = cover?.icon;

	return (
		<span
			aria-hidden="true"
			className={cn(
				'relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-pf-line',
				screen || !cover ? 'bg-pf-gray-100' : cover.tone,
			)}>
			{screen ? (
				<Image src={screen.src} alt="" fill sizes="56px" className="object-cover object-left-top" />
			) : (
				Icon && <Icon size={26} strokeWidth={2} />
			)}
		</span>
	);
};

interface ListRowProps {
	title: ReactNode;
	description?: ReactNode;
	/** 있으면 행 전체가 링크가 되고 오른쪽에 > 화살표가 붙는다. */
	href?: string;
	leading?: ReactNode;
	/** 제목 아래 추가 줄. 링크가 없는 행에서만 쓴다(링크 안에 링크를 넣지 않는다). */
	extra?: ReactNode;
}

/** 토스식 목록 한 줄: 제목 한 줄 + 회색 보조 한 줄. */
export const ListRow = ({ title, description, href, leading, extra }: ListRowProps) => {
	const body = (
		<>
			{leading}
			<span className="min-w-0 flex-1">
				<span className="block break-keep text-[17px] font-bold leading-[1.45] text-pf-gray-900">{title}</span>
				{description && (
					<span className="mt-0.5 block break-keep text-[14px] leading-[1.5] text-pf-gray-700">{description}</span>
				)}
				{extra}
			</span>
			{href && (
				<ChevronRight
					aria-hidden="true"
					size={20}
					className="shrink-0 text-pf-gray-400 transition-transform duration-200 ease-in-out group-hover:translate-x-0.5"
				/>
			)}
		</>
	);

	return (
		<li>
			{href ? (
				<Link
					href={href}
					className={cn(
						'group -mx-3 flex min-h-[72px] items-center gap-4 rounded-2xl px-3 py-3 transition-colors duration-200 ease-in-out hover:bg-pf-gray-50 active:bg-pf-gray-100',
						FOCUS_RING,
					)}>
					{body}
				</Link>
			) : (
				<div className="flex min-h-[64px] items-center gap-4 py-3">{body}</div>
			)}
		</li>
	);
};
