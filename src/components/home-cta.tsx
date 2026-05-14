'use client';

import { Button } from '@heroui/button';
import NextLink from 'next/link';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function HomeCta() {
	const t = useTranslations('HomeCta');

	return (
		<div className='flex gap-4'>
			<Button as={Link} color='primary' href='/admin' size='lg'>
				{t('admin')}
			</Button>
			<Button
				as={NextLink}
				href='/api/payments/v1/config'
				size='lg'
				variant='bordered'
			>
				{t('apiDocs')}
			</Button>
		</div>
	);
}
