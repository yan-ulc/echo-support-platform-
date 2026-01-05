"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import {
  CreditCardIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
  Mic,
  PaletteIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const customerSupportItems = [
  {
    title: "Conversations",
    url: "/conversations",
    icon: InboxIcon,
  },
  {
    title: "Knowledge Base",
    url: "/files",
    icon: LibraryBigIcon,
  },
];

const configurationItems = [
  {
    title: "Widget Costumization ",
    url: "/costumizations",
    icon: PaletteIcon,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Voice Assistant",
    url: "/pliugins/vapi",
    icon: Mic,
  },
];
const accountsItems = [
  {
    title: "Plans & Billing",
    url: "/billing",
    icon: CreditCardIcon,
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }
    return pathname === url || pathname.startsWith(`${url}/`);
  };
  return (
    <Sidebar className="group  bg-sidebr-primary-foreground     border-r border-sidebar-border" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <OrganizationSwitcher
                hidePersonal
                skipInvitationScreen
                appearance={{
                  elements: {
                    rootbox: "w-full! h-8!",
                    avatarBox: "size-4! rounded-sm!",
                    organizationSwitcherTrigger:
                      "w-full! justify-start! group-data-[collapsible='icon']:size-8! group-data-[collapsible='icon']:p-2!",
                    organizationPreview:
                      " group-data-[collapsible='icon']:justify-center! gap-2 ",
                    organizationPreviewTextContainer:
                      "group-data-[collapsible='icon']:hidden! text-xs! font-medium! text-sidebar-foreground!",
                    organizationSwitcherTriggerIcon:
                      "group-data-[collapsible='icon']:hidden! ml-auto! text-sidebar-foreground!",
                  },
                }}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* customer support */}
        <SidebarGroup>
          <SidebarGroupLabel>Customer Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customerSupportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "transition-colors ring-sidebar-ring",
                      isActive(item.url)
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground "
                        : "hover:bg-sidebar-accent popover-foreground hover:text-sidebar-accent-foreground text-sidebar-foreground "
                    )}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4 " />
                      <span>{item.title} </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* configuration */}
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configurationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "transition-colors ring-sidebar-ring",
                      isActive(item.url)
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
                    )}
                    tooltip={item.title }
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4 " />
                      <span>{item.title} </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* accounts */}
        <SidebarGroup>
          <SidebarGroupLabel>Accounts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "transition-colors ring-sidebar-ring",
                      isActive(item.url)
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
                    )}
                    tooltip={item.title} 
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4 " />
                      <span>{item.title} </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <UserButton
                  showName
                  appearance={{
                    elements: {
                      rootBox: "w-full! h-8!",
                      userButtonTrigger:
                        "w-full! p-2! flex-items-center! justify-center! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground! group-data-[collapsible='icon']:size-8! group-data-[collapsible='icon']:p-2!",
                      userButtonBox:
                        "w-full! flex-row-reverse! justify-center! gap-2! group-data-[collapsible='icon']:justify-center! text-sidebar-foreground!",
                      userButtonOuterIdentifier:
                        "pl-0! group-data-[collapsible='icon']:hidden!",
                      avatarBox: "size-4! ",
                    },
                  }}
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
