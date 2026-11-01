import { Link2, Search } from 'lucide-react';

import type { ExampleScreen } from '@/portfolio/examples';
import { cn } from '@/utils/utils';

import { Marked } from './parts';
import type { ExampleTheme } from './theme';

type Data = Extract<ExampleScreen, { kind: 'search-url' }>['data'];

/** 통합검색: 왼쪽 검색어 칸·필터 칩, 오른쪽 결과 목록. 주소 줄과 같은 조건(검색어·고른 정렬)을 같은 강조 테두리로 묶는다. */
const SearchUrl = ({ t, data }: { t: ExampleTheme; data: Data }) => (
	<div className={t.split}>
		<div className="grid content-start gap-[0.5em]">
			<div className={cn('flex items-center gap-[0.4em] rounded-[0.5em] px-[0.6em] py-[0.3em]', t.box)}>
				<Search className={cn('size-[1.1em] shrink-0', t.muted)} />
				<Marked t={t}>{data.query}</Marked>
			</div>
			<div className="flex flex-wrap gap-[0.35em]">
				{data.chips.map(chip =>
					chip.selected ? (
						<Marked key={chip.label} t={t} className="rounded-full px-[0.7em] py-[0.1em] font-bold">
							{chip.label}
						</Marked>
					) : (
						<span key={chip.label} className={cn('rounded-full px-[0.7em] py-[0.1em]', t.box, t.muted)}>
							{chip.label}
						</span>
					),
				)}
			</div>
			<p className={cn('flex items-center gap-[0.3em] font-bold', t.accentText)}>
				<Link2 className="size-[1.1em] shrink-0" />
				{data.note}
			</p>
		</div>
		<ul className={cn('content-start divide-y self-start rounded-[0.5em] px-[0.7em]', t.box, t.rule)}>
			{data.results.map(result => (
				<li key={result.title} className={cn('flex gap-[0.6em] py-[0.25em]', t.rule)}>
					<span className={t.muted}>{result.type}</span>
					<span className={cn('font-bold', t.strong)}>{result.title}</span>
				</li>
			))}
		</ul>
	</div>
);

export default SearchUrl;
