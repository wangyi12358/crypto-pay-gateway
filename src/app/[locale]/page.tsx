import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HomeCta } from '@/components/home-cta';
import { LocaleSwitcher } from '@/components/locale-switcher';

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations('Home');

	return (
		<div className='flex min-h-screen flex-col items-center justify-center'>
			<div className='absolute end-4 top-4'>
				<LocaleSwitcher />
			</div>
			<div className='container flex flex-col items-center justify-center gap-4 px-4 py-16'>
				<h1 className='font-extrabold text-5xl tracking-tight sm:text-[5rem]'>
					{t('titleLead')}{' '}
					<span className='text-primary'>{t('titleAccent')}</span>{' '}
					{t('titleTrail')}
				</h1>
				<p className='text-default-500 text-xl'>{t('tagline')}</p>
				<HomeCta />
			</div>
		</div>
	);
}
