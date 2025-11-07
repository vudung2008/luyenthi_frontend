"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  LayoutDashboard
} from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { useAuthStore } from "@/stores/useAuthStore"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, classes } = useAuthStore();

  const data = {
    user: {
      name: (user?.firstName + ' ' + user?.lastName),
      alias: (`${user?.firstName[0] ?? ""}${user?.lastName[0] ?? ""}`),
      email: user?.email ?? "",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Dashboard",
        logo: LayoutDashboard,
        tab: 'dashboard',
        desc: "Hello"
      },
      {
        name: "Create Class",
        tab: 'create',
        logo: GalleryVerticalEnd,
        desc: "World",
      },
    ],
    projects: (classes ?? []).map((cls) => ({
      name: cls.class.name,
      description: cls.class.description ?? "",
      id: cls.info.classId,
    })),
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser userr={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
