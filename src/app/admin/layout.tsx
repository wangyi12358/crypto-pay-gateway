'use client';

import { Avatar } from '@heroui/avatar';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@heroui/dropdown';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
	{ href: '/admin', label: '仪表盘' },
	{ href: '/admin/orders', label: '订单' },
	{ href: '/admin/wallets', label: '钱包' },
	{ href: '/admin/chains', label: '链配置' },
	{ href: '/admin/api-keys', label: 'API 密钥' },
	{ href: '/admin/settings', label: '设置' },
];

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	return (
		<div className='min-h-screen'>
			<Navbar isBordered>
				<NavbarBrand>
					<Link className='font-bold text-inherit' href='/admin'>
						Crypto Pay
					</Link>
				</NavbarBrand>

				<NavbarContent className='hidden gap-4 sm:flex'>
					{navItems.map((item) => (
						<NavbarItem isActive={pathname === item.href} key={item.href}>
							<Link
								className={
									pathname === item.href ? 'text-primary' : 'text-foreground'
								}
								href={item.href}
							>
								{item.label}
							</Link>
						</NavbarItem>
					))}
				</NavbarContent>

				<NavbarContent justify='end'>
					<Dropdown placement='bottom-end'>
						<DropdownTrigger>
							<Avatar
								as='button'
								className='transition-transform'
								isBordered
								name='Admin'
								size='sm'
							/>
						</DropdownTrigger>
						<DropdownMenu aria-label='Profile Actions'>
							<DropdownItem key='settings'>设置</DropdownItem>
							<DropdownItem className='text-danger' key='logout'>
								退出登录
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</NavbarContent>
			</Navbar>

			<main className='container mx-auto max-w-7xl px-4 py-8'>{children}</main>
		</div>
	);
}
