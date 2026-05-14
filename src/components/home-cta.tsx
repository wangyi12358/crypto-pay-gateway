'use client';

import { Button } from '@heroui/button';
import Link from 'next/link';

export function HomeCta() {
	return (
		<div className='flex gap-4'>
			<Button as={Link} color='primary' href='/admin' size='lg'>
				管理后台
			</Button>
			<Button
				as={Link}
				href='/api/payments/v1/config'
				size='lg'
				variant='bordered'
			>
				API 文档
			</Button>
		</div>
	);
}
