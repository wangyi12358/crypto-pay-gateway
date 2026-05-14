"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar"
import { Button } from "@heroui/button"
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown"
import { Avatar } from "@heroui/avatar"

const navItems = [
  { href: "/admin", label: "仪表盘" },
  { href: "/admin/orders", label: "订单" },
  { href: "/admin/wallets", label: "钱包" },
  { href: "/admin/chains", label: "链配置" },
  { href: "/admin/api-keys", label: "API 密钥" },
  { href: "/admin/settings", label: "设置" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen">
      <Navbar isBordered>
        <NavbarBrand>
          <Link href="/admin" className="font-bold text-inherit">
            Crypto Pay
          </Link>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4">
          {navItems.map((item) => (
            <NavbarItem key={item.href} isActive={pathname === item.href}>
              <Link
                href={item.href}
                className={pathname === item.href ? "text-primary" : "text-foreground"}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                name="Admin"
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions">
              <DropdownItem key="settings">设置</DropdownItem>
              <DropdownItem key="logout" className="text-danger">
                退出登录
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        {children}
      </main>
    </div>
  )
}
