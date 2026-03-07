"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { NavMain } from "@/MedTrack/components/nav-main";
import { NavUser } from "@/MedTrack/components/nav-user";
import { BookPlus, MousePointer2, BookUser } from "lucide-react";
import Link from "next/link";
import { useAuthenticatedUser } from "@/MedTrack/hooks/useAuthenticatedUser";
import gsap from "gsap";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/MedTrack/components/ui/sidebar";

const navMain = [
  {
    title: "Medical history",
    url: "/dashboard/medhistory",
    icon: BookPlus,
  },
  {
    title: "Family",
    url: "/dashboard/family",
    icon: BookUser,
  },
  {
    title: "Doctor's Access",
    url: "/dashboard/docAccess",
    icon: MousePointer2,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthenticatedUser();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate sidebar items on mount
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current.querySelectorAll(".sidebar-item"),
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" },
      );
    }
  }, []);

  const userData = {
    name: user?.name || "Patient",
    email: user?.phin || "—",
    avatar: "/avatars/shadcn.jpg",
  };

  return (
    <Sidebar ref={sidebarRef} collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="sidebar-item">
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <IconInnerShadowTop className="w-5 h-5" />
                <span className="text-base font-semibold">Med Track.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="sidebar-item">
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
