"use client";

import type { MouseEvent } from "react";

import useObserverToc from "@/hooks/useObserverToc";
import type { HeadingTypes } from "@/types/common.types";
import { cn } from "@/utils/utils";

interface TitleIndexProps {
  headerNavigationList?: HeadingTypes[];
}

const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  const id = e.currentTarget.getAttribute("href")?.slice(1);

  if (!id) return;

  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const Toc = ({ headerNavigationList }: TitleIndexProps) => {
  const { activeIds } = useObserverToc();

  return (
    <ul className="mx-auto mt-10 flex max-h-[calc(80vh-10rem)] max-w-3xl flex-col gap-1 overflow-y-scroll rounded-lg bg-secondary p-5 text-gray-500 scrollbar-hide dark:text-gray-300">
      <li className="text-lg font-semibold text-foreground">목차</li>
      {headerNavigationList?.map(({ text, href, children }, index) => (
        <li key={text}>
          <a
            href={href}
            onClick={handleAnchorClick}
            className={cn(
              "scroll-mt-28 list-none text-sm transition hover:text-destructive",
              activeIds.includes(href) && "text-destructive",
            )}
          >
            {index + 1}. {text}
          </a>
          {children?.length ? (
            <ul>
              {children.map((heading) => (
                <li key={heading.text} className="indent-2">
                  <a
                    href={heading.href}
                    onClick={handleAnchorClick}
                    className={cn(
                      "scroll-mt-28 list-none text-xs transition hover:text-destructive",
                      activeIds.includes(heading.href) && "text-destructive",
                    )}
                  >
                    - {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
};

export default Toc;
