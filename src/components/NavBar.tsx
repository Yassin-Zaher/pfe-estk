"use client";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button, buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { UserButton, useAuth } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link as I18NLink } from "@/navigation";
import { useRouter } from "next/navigation";

const Navbar = ({ lang }) => {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { toast } = useToast();

  const isAdmin =
    userId !== undefined && userId === process.env.NEXT_PUBLIC_ADMIN_ID;

  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <a href="/" className="flex z-40 font-semibold">
            Tex<span className="text-green-600">prints</span>
          </a>

          <div className="h-full flex items-center space-x-4">
            {userId ? (
              <>
                {isAdmin ? (
                  <Link
                    href="/dashboard/stats"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    Dashboard ✨
                  </Link>
                ) : (
                  <Link
                    href="/myorders"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    Dashboard ✨
                  </Link>
                )}

                <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Upload image
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
                <a
                  href="/user/dashboard"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Create Design
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </a>

                <div className="h-8 w-px bg-zinc-200 hidden sm:block" />
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <>
                  <Link
                    href="/configure/upload"
                    className={buttonVariants({
                      size: "sm",
                      className: "hidden sm:flex items-center gap-1",
                    })}
                  >
                    Upload image
                    <ArrowRight className="ml-1.5 h-5 w-5" />
                  </Link>

                  <div className="h-8 w-px bg-zinc-200 hidden sm:block cursor-pointer text-sm hover:bg-gray-100" />
                  <Link
                    href="/sign-in"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    Login
                  </Link>
                </>
              </>
            )}

            <LanguageDropdown lang={lang} />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export function LanguageDropdown({ lang }) {
  const [position, setPosition] = useState(lang);
  /* const router = useRouter()
  const { pid } = router */

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{position}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <I18NLink href="/" locale="en">
            <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
          </I18NLink>
          <I18NLink href="/" locale="es">
            <DropdownMenuRadioItem value="es">Espaniol</DropdownMenuRadioItem>
          </I18NLink>
          <I18NLink href="/" locale="fr">
            <DropdownMenuRadioItem value="fr">Français </DropdownMenuRadioItem>
          </I18NLink>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Navbar;
