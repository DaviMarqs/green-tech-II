import {
  Archive,
  Banknote,
  Bolt,
  CircleQuestionMark,
  LogOut,
  ShoppingCart,
  Wallet,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Comprar",
    url: "#",
    icon: ShoppingCart,
  },
  {
    title: "Vender",
    url: "#",
    icon: Banknote,
  },
  {
    title: "Meus pedidos",
    url: "#",
    icon: Archive,
  },
  {
    title: "Carteira",
    url: "#",
    icon: Wallet,
  },
  {
    title: "Suporte",
    url: "#",
    icon: CircleQuestionMark,
  },
  {
    title: "Configurações",
    url: "#",
    icon: Bolt,
  },
];

const footerItems = [
  {
    title: "Sair",
    url: "#",
    icon: LogOut,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="mt-2 px-2">
          <SidebarGroupLabel className="mt-4">
            <a href="/dashboard">
              <img src="./logo-greentech.svg" alt="Logo - Dashboard" />
            </a>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-3">
            <SidebarMenu className="mt-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="text-gray-600">
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-green-100 transition-colors duration-100"
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter className="mt-auto px-2">
          <SidebarMenu>
            {footerItems.map((item) => (
              <SidebarMenuItem key={item.title} className="text-gray-600">
                <SidebarMenuButton
                  asChild
                  className="hover:bg-red-100 transition-colors duration-100"
                >
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
