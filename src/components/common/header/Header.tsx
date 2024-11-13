"use client";

import {
  NavigationMenu,
  navigationMenuTriggerStyle,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import Link from "next/link";
import React from "react";
import { ModeToggle } from "../mode-toggle/ModeToggle";
import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "../../icons/icons";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import useScrollDirection from "@/hooks/useScrollDirection";

const NAVIGATION_LIST = [
  {
    href: "/",
    label: "🦊",
  },

  {
    href: "/blog/posts",
    label: "Posting",
  },
  {
    href: "/about",
    label: "About",
  },
];

const Header = () => {
  const pathname = usePathname();
  const showHeader = useScrollDirection();

  return (
    <header
      className={cn(
        showHeader ? "translate-y-[0px]" : "translate-y-[-77px]",
        "fixed top-0 left-0 w-full p-5 border-b border-gray-300 transition-transform duration-200 ease-in-out dark:bg-[rgba(0,0,0,0.5)] bg-[rgba(255,255,255,0.5)] backdrop-blur-sm"
      )}
    >
      <NavigationMenu className="justify-between max-w-7xl mx-auto">
        <NavigationMenuList>
          {NAVIGATION_LIST.map((item) => (
            <NavigationMenuItem
              key={item.label}
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === item.href && "bg-muted"
              )}
            >
              <Link href={item.href}>{item.label}</Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
        <ul className="flex gap-4">
          <li>
            <ModeToggle />
          </li>
          <li>
            <Button variant="outline" size="icon">
              <Link href={"https://github.com/yunwoo-yu"} target="_blank">
                <GitHubIcon />
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="outline" size="icon">
              <Link
                href={"https://www.linkedin.com/in/yunwoo-yu-65095b263"}
                target="_blank"
              >
                <LinkedInIcon />
              </Link>
            </Button>
          </li>
        </ul>
      </NavigationMenu>
    </header>
  );
};

export default Header;
