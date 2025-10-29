import { ShoppingCart, Banknote, Archive, Wallet, CircleQuestionMark, Bolt } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
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
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel><img src="./public/logo-greentech.svg" alt="" /></SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="ml-2">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
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
            </SidebarContent>
        </Sidebar>
    )
}