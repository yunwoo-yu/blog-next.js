'use client';

import { useMemo, useRef } from 'react';

import AdSlot from '@/components/common/AdSlot';
import { Button } from '@/components/ui/button';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import useMediaQuery, { DESKTOP_QUERY } from '@/hooks/useMediaQuery';
import usePostListParams from '@/hooks/usePostListParams';
import useViewTypesTab from '@/hooks/useViewTypesTab';
import type { PostListTypes } from '@/types/common.types';
import { getPaginationRange } from '@/utils/pagination';
import { filterPostsByQuery } from '@/utils/search';
import { cn } from '@/utils/utils';
import type { ViewType } from '@/utils/view-type';

import Pagination from './Pagination';
import PostCardType from './PostCardType';
import PostListType from './PostListType';
import PostSearch from './PostSearch';
import ViewToggle from './ViewToggle';

interface BlogPostsProps {
	posts: PostListTypes[];
	/** 서버가 searchParams·쿠키에서 읽어 넘긴 값. 첫 렌더가 실제 상태와 일치하게 만든다. */
	initialQuery?: string;
	initialPage?: number;
	initialViewType?: ViewType;
}

/** 첫 화면에 보이는 썸네일만 우선 로드한다. 전부 priority면 LCP 경쟁이 붙는다. */
const PRIORITY_IMAGE_COUNT = 4;

const BlogPosts = ({ posts, initialQuery = '', initialPage = 1, initialViewType = 'list' }: BlogPostsProps) => {
	const { viewType, onChangeViewType } = useViewTypesTab(initialViewType);
	// 검색어와 페이지는 URL이 들고 있다. 글을 열었다 돌아와도 보던 자리가 유지되고 링크 공유도 된다.
	const {
		query,
		page: requestedPage,
		setQuery,
		setPage,
	} = usePostListParams({ query: initialQuery, page: initialPage });
	const listTopRef = useRef<HTMLDivElement>(null);

	const filteredPosts = useMemo(() => filterPostsByQuery(posts, query), [posts, query]);
	const { page, totalPages, start, end } = getPaginationRange(filteredPosts.length, requestedPage);

	// 데스크톱은 페이지네이션, 모바일은 무한 스크롤.
	// 서버는 뷰포트를 모르므로 두 모드가 같은 지점(start)에서 시작하게 맞춰 첫 HTML이 양쪽 모두에 맞게 한다.
	const isDesktop = useMediaQuery(DESKTOP_QUERY);
	const infinite = useInfiniteScroll({
		totalCount: filteredPosts.length - start,
		enabled: !isDesktop,
		resetKey: `${query}:${page}`,
	});

	const visiblePosts = isDesktop
		? filteredPosts.slice(start, end)
		: filteredPosts.slice(start, start + infinite.visibleCount);

	const onChangePage = (next: number) => {
		setPage(Math.min(Math.max(1, next), totalPages));
		listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	return (
		<section className="min-w-0 flex-1">
			<div ref={listTopRef} className="scroll-mt-32" />
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="sm:max-w-xs sm:flex-1">
					<PostSearch value={query} onChange={setQuery} resultCount={filteredPosts.length} />
				</div>
				<ViewToggle viewType={viewType} onChangeViewType={onChangeViewType} />
			</div>

			{filteredPosts.length ? (
				<ul
					className={cn(
						'w-full pt-5',
						viewType === 'list' ? 'flex flex-col' : 'grid gap-5 sm:grid-cols-1 md:grid-cols-2',
					)}>
					{visiblePosts.map((post, index) =>
						viewType === 'list' ? (
							<PostListType
								key={`${post.category}/${post.slug}`}
								data={post.frontmatter}
								category={post.category}
								slug={post.slug}
								priority={index < PRIORITY_IMAGE_COUNT}
							/>
						) : (
							<PostCardType
								key={`${post.category}/${post.slug}`}
								data={post.frontmatter}
								category={post.category}
								slug={post.slug}
								priority={index < PRIORITY_IMAGE_COUNT}
							/>
						),
					)}
				</ul>
			) : (
				<div className="mt-5 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-20 text-center">
					<p className="text-base font-medium text-foreground">
						{query ? `'${query}'에 대한 결과가 없어요` : '아직 등록된 글이 없어요'}
					</p>
					<p className="text-sm text-muted-foreground">
						{query ? '다른 키워드로 찾아보세요.' : '다른 카테고리를 둘러보세요.'}
					</p>
					{query ? (
						<Button variant="outline" className="mt-2" onClick={() => setQuery('')}>
							검색 초기화
						</Button>
					) : null}
				</div>
			)}

			{/*
			 * 두 컨트롤을 모두 그려두고 CSS 미디어 쿼리로 가른다.
			 * JS(useMediaQuery)로 분기하면 서버는 항상 모바일로 렌더하므로,
			 * 데스크톱 방문자에게 "글 더 보기" 버튼이 한 번 그려졌다가 페이지네이션으로 바뀐다.
			 * CSS는 첫 페인트에 이미 적용되어 그 깜빡임이 없다.
			 */}
			{filteredPosts.length > 0 ? (
				<>
					<div className="hidden md:block">
						<p aria-live="polite" className="mt-8 text-center text-sm text-muted-foreground">
							{page} / {totalPages} 페이지 · 총 {filteredPosts.length}개
						</p>
						<Pagination page={page} totalPages={totalPages} onChangePage={onChangePage} />
					</div>
					<div className="md:hidden">
						<p aria-live="polite" className="mt-8 text-center text-sm text-muted-foreground">
							{filteredPosts.length}개 중 {start + visiblePosts.length}개
						</p>
						{infinite.hasMore ? (
							// 스크롤이 닿으면 자동으로 이어붙이되, 버튼도 남겨 키보드/스크린리더에서도 다음 페이지로 갈 수 있게 한다.
							<div ref={infinite.sentinelRef} className="mt-3 flex justify-center">
								<Button variant="outline" onClick={infinite.loadMore}>
									글 더 보기
								</Button>
							</div>
						) : null}
					</div>
				</>
			) : null}

			<AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_POST_LIST} className="mt-16" />
		</section>
	);
};

export default BlogPosts;
