
"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { navItems } from "@/config/site"; // Corrected import path
import type { NavItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/ui/logo";

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavLinkContent = ({ item, mobile = false }: { item: NavItem, mobile?: boolean }) => (
    <>
      {item.icon && <item.icon className={cn("mr-2 h-4 w-4 inline-block", mobile ? "h-5 w-5" : "")} />}
      {item.title}
      {item.subItems && !mobile && <ChevronDown className="ml-1 h-4 w-4" />}
    </>
  );

  const NavLink = ({ item, mobile = false, isSubItem = false }: { item: NavItem, mobile?: boolean, isSubItem?: boolean }) => {
    const commonClasses = cn(
      "transition-colors hover:text-primary",
      (pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/")) && !item.disabled && !item.subItems ? "text-primary font-semibold" : "text-foreground/70",
      item.disabled && "cursor-not-allowed opacity-50 hover:text-foreground/70",
      mobile ? "block w-full justify-start py-3 text-lg" : "text-sm font-medium",
      isSubItem && mobile ? "pl-8" : mobile ? "px-3" : "px-3 py-2"
    );
  
    // For mobile, if it has subItems, render them directly below the parent, not as a nested interactive element
    if (item.subItems && mobile) {
      return (
        <div className="flex flex-col">
          {/* Parent item - not a link itself if it has subItems on mobile */}
          <span className={cn(commonClasses, "font-semibold text-foreground/90 flex items-center", mobile ? "px-3 py-2" : "")}>
             <NavLinkContent item={item} mobile={mobile} />
             {item.subItems && <ChevronDown className="ml-auto h-5 w-5 transform transition-transform group-data-[state=open]:rotate-180" />}
          </span>
          {/* Sub-items rendered as links */}
          <div className="flex flex-col pl-4 border-l border-muted ml-3">
            {item.subItems.map((subItem) => (
              <NavLink key={subItem.href} item={subItem} mobile={mobile} isSubItem={true} />
            ))}
          </div>
        </div>
      );
    }
  
    // For desktop dropdowns or non-dropdown links on mobile
    return (
      <Button
        asChild
        variant="link"
        className={cn(commonClasses, mobile ? "" : "px-0")}
        disabled={item.disabled}
        onClick={() => {
          // Close mobile menu if it's a direct link (not a parent of subItems handled above)
          if (!item.disabled && mobile && !item.subItems) { 
            setMobileMenuOpen(false);
          }
        }}
        aria-current={pathname === item.href && !item.disabled && !item.subItems ? "page" : undefined}
      >
        <Link href={item.disabled || (item.subItems && !mobile) ? "#" : item.href}>
           <NavLinkContent item={item} mobile={mobile} />
        </Link>
      </Button>
    );
  };


  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
        isScrolled ? "bg-background/95 shadow-md backdrop-blur-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) =>
            item.subItems ? (
              <DropdownMenu key={item.title}>
                <DropdownMenuTrigger asChild>
                  <Button variant="link" className={cn(
                     "transition-colors hover:text-primary text-sm font-medium px-3 py-2 flex items-center",
                     // Check if current path starts with any of the subItems' href
                     item.subItems.some(sub => pathname.startsWith(sub.href) && sub.href !== "/") ? "text-primary font-semibold" : "text-foreground/70",
                     item.disabled && "cursor-not-allowed opacity-50"
                  )} disabled={item.disabled}>
                    <NavLinkContent item={item} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-background border shadow-lg rounded-md">
                  {item.subItems.map((subItem) => (
                    <DropdownMenuItem key={subItem.href} asChild className={cn(
                      "cursor-pointer hover:bg-accent focus:bg-accent",
                      pathname === subItem.href && !subItem.disabled ? "bg-accent text-primary font-semibold" : "",
                      subItem.disabled && "cursor-not-allowed opacity-50"
                    )} disabled={subItem.disabled}>
                      <Link href={subItem.disabled ? "#" : subItem.href} className="flex items-center w-full px-2 py-1.5">
                        {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                        {subItem.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NavLink key={item.href} item={item} />
            )
          )}
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs p-0 bg-background flex flex-col">
              <div className="flex items-center justify-between mb-2 p-4 border-b">
                  <Logo />
                  <SheetClose asChild>
                     <Button variant="ghost" size="icon" aria-label="Close navigation menu">
                        <X className="h-6 w-6" />
                     </Button>
                  </SheetClose>
                </div>
              <nav className="flex-grow flex flex-col space-y-1 p-4 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink key={item.title} item={item} mobile />
                ))}
              </nav>
              <div className="p-4 border-t mt-auto">
                  <p className="text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Plenty of π</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
