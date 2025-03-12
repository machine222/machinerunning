"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-blue-600">Machine Learning</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[400px]">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/tools/keyword-search"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-600"
                    >
                      <div className="text-sm font-medium leading-none">Big Data Keyword Search</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Find profitable keywords for your products
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/tools/margin-calculator"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-600"
                    >
                      <div className="text-sm font-medium leading-none">Margin Calculator</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Calculate your profit margins easily
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/free-lecture" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-600">
                  0 Won Special Lecture
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/purchase" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-600">
                  Monthly 3000 Achievement Project
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/my-class" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-600">
                  My Class
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden lg:flex gap-4">
          <Button variant="outline" size="sm">
            Login
          </Button>
          <Button size="sm">Sign Up</Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/tools" className="text-lg font-medium hover:text-blue-600" onClick={() => setIsOpen(false)}>
                Tools
              </Link>
              <Link
                href="/free-lecture"
                className="text-lg font-medium hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                0 Won Special Lecture
              </Link>
              <Link
                href="/purchase"
                className="text-lg font-medium hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Monthly 3000 Achievement Project
              </Link>
              <Link
                href="/my-class"
                className="text-lg font-medium hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                My Class
              </Link>
              <div className="flex flex-col gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Login
                </Button>
                <Button onClick={() => setIsOpen(false)}>Sign Up</Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

