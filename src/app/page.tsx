import { HomeCta } from '@/components/home-cta';

export default function Home() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center'>
			<div className='container flex flex-col items-center justify-center gap-4 px-4 py-16'>
				<h1 className='font-extrabold text-5xl tracking-tight sm:text-[5rem]'>
					Crypto <span className='text-primary'>Pay</span> Gateway
				</h1>
				<p className='text-default-500 text-xl'>开源多链加密货币支付网关</p>
				<HomeCta />
			</div>
		</div>
	);
}
