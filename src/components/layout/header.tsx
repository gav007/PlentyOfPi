"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { navItems } from "@/config/site";
import type { NavItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
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

  const NavLink = ({ item, mobile = false }: { item: NavItem, mobile?: boolean }) => (
    <Link
      href={item.href}
      className={cn(
        "transition-colors hover:text-primary",
        pathname === item.href ? "text-primary font-semibold" : "text-foreground/70",
        mobile ? "block py-3 text-lg" : "text-sm font-medium px-3 py-2"
      )}
      onClick={() => mobile && setMobileMenuOpen(false)}
      aria-current={pathname === item.href ? "page" : undefined}
    >
      {item.icon && <item.icon className={cn("mr-2 h-4 w-4 inline-block", mobile ? "h-5 w-5" : "")} />}
      {item.title}
    </Link>
  );

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
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
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
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                     <NavLink key={item.href} item={item} mobile />
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
