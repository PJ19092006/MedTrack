"use client";

import Link from "next/link";
import { Button } from "@/MedTrack/components/ui/button";
import { Avatar, AvatarFallback } from "@/MedTrack/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/MedTrack/components/ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

type Props = {
  showSearch?: boolean;
  search?: string;
  onSearchChange?: (v: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
};

export function ClinicHeader({
  showSearch,
  search,
  onSearchChange,
  onSubmit,
}: Props) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3">
        {/* LEFT SIDE  */}
        <Link
          href="/clinic"
          className="text-xl font-semibold tracking-tight text-blue-500 shrink-0"
        >
          Clinic<span className="text-foreground">Search</span>
        </Link>

        {/* SEARCH INPUT */}
        {showSearch && (
          <form
            onSubmit={onSubmit}
            className="relative flex items-center w-full max-w-3xl px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 hover:shadow-md focus-within:shadow-md transition-shadow bg-background"
          >
            <FontAwesomeIcon
              icon={faSearch}
              className="text-gray-400 mr-3 h-[16px] w-[16px]"
            />
            <input
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search patients authorization code"
              className="flex-grow outline-none bg-transparent text-sm"
            />
          </form>
        )}

        {/* RIGHT SIDE */}
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" className="rounded-full">
            <Link href="/clinic/patients">Patients</Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>CL</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Clinic Profile</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/clinic/profile">View profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="h-px w-full bg-border" />
    </header>
  );
}
