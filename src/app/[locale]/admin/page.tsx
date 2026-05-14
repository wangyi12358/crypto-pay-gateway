import { Card, CardBody } from '@heroui/card';
import { getTranslations, setRequestLocale } from 'next-intl/server';

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function AdminDashboard({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations('Admin.dashboard');

	return (
		<div>
			<h1 className='mb-6 font-bold text-2xl'>{t('title')}</h1>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card>
					<CardBody>
						<p className='text-default-500 text-sm'>{t('todayOrders')}</p>
						<p className='font-bold text-2xl'>0</p>
					</CardBody>
				</Card>

				<Card>
					<CardBody>
						<p className='text-default-500 text-sm'>{t('todayRevenue')}</p>
						<p className='font-bold text-2xl'>0 USDT</p>
					</CardBody>
				</Card>

				<Card>
					<CardBody>
						<p className='text-default-500 text-sm'>{t('pending')}</p>
						<p className='font-bold text-2xl'>0</p>
					</CardBody>
				</Card>

				<Card>
					<CardBody>
						<p className='text-default-500 text-sm'>{t('totalOrders')}</p>
						<p className='font-bold text-2xl'>0</p>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
