'use client';

import { Button } from '@heroui/button';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@heroui/dropdown';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

interface LocaleSwitcherProps {
	className?: string;
}

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const t = useTranslations('LocaleSwitcher');

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button className={className} size='sm' variant='bordered'>
					{locale === 'zh' ? t('zh') : t('en')}
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label={t('aria')}
				onAction={(key) => {
					router.replace(pathname, { locale: String(key) });
				}}
				selectedKeys={new Set([locale])}
				selectionMode='single'
			>
				{routing.locales.map((loc) => (
					<DropdownItem key={loc}>
						{loc === 'zh' ? t('zh') : t('en')}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
}
