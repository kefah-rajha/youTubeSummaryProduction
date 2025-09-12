"use client"
import {
  LayoutDashboard,
  Users,
  ClipboardList,

  ChevronRight,
  Brain,
  LucideIcon
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,

} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { usePathname } from "next/navigation";

// Menu items.
interface itemsType {

  title: string
  url: string
  selected: string
  icon: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    selected: string
    url: string
  }[]
}


const items: itemsType[] = [
  {
    title: "DashBoard",
    url: "/dashboard",
    selected: "dashboard",
    icon: LayoutDashboard, // Better icon representing a dashboard
    isActive: true,
  },

  {
    title: "User",
    url: "/dashboard/user",
    selected: "user",
    icon: Users, // Better icon for users/people
  },

  {
    title: "Subscription",
    url: "/dashboard/Subscription",
    selected: "Subscription",
    icon: ClipboardList, // Good for order management
  },

];
const headerNav = {
  title: "SaaS System",
  url: "/",
  icon: Brain,
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const Url = usePathname();
  console.log(Url.includes("inventory"))
  const UrlWithoutDashboard = Url.replace("/dashboard", "")
  console.log(UrlWithoutDashboard)

  return (
    <Sidebar collapsible="icon" {...props} >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild >
              <a href={headerNav.url}>
                <headerNav.icon className="text-orange-400" />
                <span className="text-xl">{headerNav.title}</span>
              </a>
            </SidebarMenuButton >

          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <Collapsible key={item?.title} asChild defaultOpen={item?.isActive ?? false}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={item.title} className={cn(Url === "/dashboard" ?
                    Url === item.url && 'bg-green-300 text-background/80' : UrlWithoutDashboard.includes(item?.selected)
                    && 'bg-green-300 text-background/80')}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <>
                      <CollapsibleTrigger asChild >
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild className={cn(Url.includes(subItem?.selected)
                                && 'bg-green-300 text-background/80')}>
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
