import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import { hasLocale } from 'next-intl';
import { Providers } from '@/components/providers/heroui';
import { ThemeProvider } from '@/components/providers/theme';
import { routing } from '@/i18n/routing';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Crypto Pay Gateway',
	description: 'Open Source Multi-chain Crypto Payment Gateway',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headerList = await headers();
	const headerLocale = headerList.get('x-next-intl-locale');
	const lang = hasLocale(routing.locales, headerLocale)
		? headerLocale
		: routing.defaultLocale;

	return (
		<html
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
			lang={lang}
			suppressHydrationWarning
		>
			<body className='flex min-h-full flex-col'>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					disableTransitionOnChange
					enableSystem
				>
					<Providers>{children}</Providers>
				</ThemeProvider>
			</body>
		</html>
	);
}
