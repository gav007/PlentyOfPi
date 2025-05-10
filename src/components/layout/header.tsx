
"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { navItems } from "@/config/site";
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
      isSubItem && mobile ? "pl-8" : mobile ? "px-3" : "px-3 py-2" // Indent sub-items on mobile
    );
  
    if (item.subItems && mobile) {
      return (
        <div className="flex flex-col">
          <span className={cn(commonClasses, "font-semibold text-foreground/90 flex items-center", mobile ? "px-3" : "")}>
             <NavLinkContent item={item} mobile={mobile} />
          </span>
          <div className="flex flex-col">
            {item.subItems.map((subItem) => (
              <NavLink key={subItem.href} item={subItem} mobile={mobile} isSubItem={true} />
            ))}
          </div>
        </div>
      );
    }
  
    return (
      <Button
        asChild
        variant="link"
        className={cn(commonClasses, mobile ? "" : "px-0")} // remove default button padding for desktop links
        disabled={item.disabled}
        onClick={() => {
          if (!item.disabled && mobile && !item.subItems) { // Close only if not a dropdown parent on mobile
            setMobileMenuOpen(false);
          }
        }}
        aria-current={pathname === item.href && !item.disabled && !item.subItems ? "page" : undefined}
      >
        <Link href={item.disabled || item.subItems ? "#" : item.href}>
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
            <SheetContent side="right" className="w-full max-w-xs p-6 bg-background">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <Logo />
                  <SheetClose asChild>
                     <Button variant="ghost" size="icon" aria-label="Close navigation menu">
                        <X className="h-6 w-6" />
                     </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col space-y-1">
                  {navItems.map((item) => (
                     <NavLink key={item.title} item={item} mobile />
                  ))}
                </nav>
                <div className="mt-auto pt-6">
                    <p className="text-center text-sm text-muted-foreground">© {new Date().getFullYear()} Plenty of π</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
