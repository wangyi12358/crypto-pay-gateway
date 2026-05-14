'use client';

import { Avatar } from '@heroui/avatar';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@heroui/dropdown';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { Link, usePathname } from '@/i18n/navigation';

const navKeys = [
	{ href: '/admin', key: 'dashboard' as const },
	{ href: '/admin/orders', key: 'orders' as const },
	{ href: '/admin/wallets', key: 'wallets' as const },
	{ href: '/admin/chains', key: 'chains' as const },
	{ href: '/admin/api-keys', key: 'apiKeys' as const },
	{ href: '/admin/settings', key: 'settings' as const },
];

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const tNav = useTranslations('Admin.nav');
	const tBrand = useTranslations('Admin');
	const tProfile = useTranslations('Admin.profile');

	return (
		<div className='min-h-screen'>
			<Navbar isBordered>
				<NavbarBrand>
					<Link className='font-bold text-inherit' href='/admin'>
						{tBrand('brand')}
					</Link>
				</NavbarBrand>

				<NavbarContent className='hidden gap-4 sm:flex'>
					{navKeys.map((item) => (
						<NavbarItem isActive={pathname === item.href} key={item.href}>
							<Link
								className={
									pathname === item.href ? 'text-primary' : 'text-foreground'
								}
								href={item.href}
							>
								{tNav(item.key)}
							</Link>
						</NavbarItem>
					))}
				</NavbarContent>

				<NavbarContent className='gap-2' justify='end'>
					<LocaleSwitcher />
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
							<DropdownItem key='settings'>{tProfile('settings')}</DropdownItem>
							<DropdownItem className='text-danger' key='logout'>
								{tProfile('logout')}
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</NavbarContent>
			</Navbar>

			<main className='container mx-auto max-w-7xl px-4 py-8'>{children}</main>
		</div>
	);
}
