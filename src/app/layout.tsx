import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/providers/heroui';
import { ThemeProvider } from '@/components/providers/theme';
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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
			lang='en'
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
