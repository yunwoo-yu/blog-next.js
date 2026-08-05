'use client';

import { Search, X } from 'lucide-react';

interface PostSearchProps {
	value: string;
	onChange: (value: string) => void;
	resultCount: number;
}

const PostSearch = ({ value, onChange, resultCount }: PostSearchProps) => {
	return (
		<div className="relative">
			<label htmlFor="post-search" className="sr-only">
				글 검색
			</label>
			<Search
				aria-hidden
				className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
			/>
			<input
				id="post-search"
				type="search"
				value={value}
				onChange={event => onChange(event.target.value)}
				placeholder="제목, 설명, 태그로 검색"
				autoComplete="off"
				className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-9 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-destructive focus-visible:ring-1 focus-visible:ring-destructive"
			/>
			{value ? (
				<button
					type="button"
					aria-label="검색어 지우기"
					onClick={() => onChange('')}
					className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground transition hover:bg-muted hover:text-foreground">
					<X aria-hidden className="size-4" />
				</button>
			) : null}
			<p aria-live="polite" className="sr-only">
				{value ? `검색 결과 ${resultCount}개` : ''}
			</p>
		</div>
	);
};

export default PostSearch;
