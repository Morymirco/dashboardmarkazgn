"use client"

import { cn } from "@/lib/utils"
import {
  BookOpen,
  Calendar,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Users,
  Loader2,
  UserCog,
  Heart,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "./auth-provider"
import { useState } from "react"
import { Button } from "./ui/button"
import { Logo } from "@/components/ui/logo"

const routes = [
  {
    label: "Tableau de bord",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-primary",
  },
  {
    label: "Centres",
    icon: Home,
    href: "/dashboard/centres",
    color: "text-primary",
  },
  {
    label: "Événements",
    icon: Calendar,
    href: "/dashboard/evenements",
    color: "text-primary",
  },
  {
    label: "Dons",
    icon: Heart,
    href: "/dashboard/dons",
    color: "text-primary",
  },
  {
    label: "Utilisateurs",
    icon: Users,
    href: "/dashboard/utilisateurs",
    color: "text-primary",
  },
  {
    label: "Blog",
    icon: BookOpen,
    href: "/dashboard/blog",
    color: "text-primary",
  },
  {
    label: "Messages",
    icon: MessageSquare,
    href: "/dashboard/messages",
    color: "text-primary",
  },
  {
    label: "Profil",
    icon: UserCog,
    href: "/dashboard/profil",
    color: "text-primary",
  },
  {
    label: "Paramètres",
    icon: Settings,
    href: "/dashboard/parametres",
    color: "text-primary",
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      router.push("/auth/logout")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size={32} />
          <span className="text-xl font-bold">MarkazGN</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
              <SidebarMenuButton asChild isActive={pathname === route.href} tooltip={route.label}>
                <Link href={route.href} className="flex items-center">
                  <route.icon className={cn("mr-2 h-5 w-5", route.color)} />
                  <span>{route.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    {user && user.image ? (
                      <AvatarImage src={user.image} alt={`${user.firstname} ${user.lastname}`} />
                    ) : (
                      <AvatarImage src="/placeholder.svg" alt="Avatar" />
                    )}
                    <AvatarFallback>{user ? `${user.firstname[0]}${user.lastname[0]}` : "AD"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user ? `${user.firstname} ${user.lastname}` : "Admin"}</p>
                    <p className="text-xs text-muted-foreground">{user ? user.email : "admin@markazgn.org"}</p>
                  </div>
                </div>
                <ModeToggle />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                onClick={handleLogout}
                className="flex w-full items-center text-destructive"
                variant="ghost"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Déconnexion...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-5 w-5" />
                    <span>Déconnexion</span>
                  </>
                )}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
