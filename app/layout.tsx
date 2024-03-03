import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import { HeartIcon } from "@heroicons/react/24/solid";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter"
});

const rocGrotesk = localFont({
	src: "./Roc Grotesk Bold.ttf",
	display: 'swap',
	variable: "--font-roc-grotesk"
});

export const metadata: Metadata = {
	title: "yard-search",
	description: "search transcripts of the yard",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.variable} ${rocGrotesk.variable} font-sans bg-black text-white flex justify-center mx-auto flex-col place-items-center pb-4 gap-4`}>
				{children}

				<footer className="border-t border-t-gray-500 py-4 text-center text-gray-200 flex flex-col place-items-center gap-2 w-full ">
					<p className="font-roc-grotesk">Created by <a href="https://jerma.fans/" className="underline hover:text-white decoration-dotted decoration-from-font">marshmallow</a>.</p>

					<p>Data from youtube and some videos transcoded locally through whisper.</p>

					<a className="underline hover:text-white decoration-dotted decoration-from-font" href="https://github.com/mrshmllow/yard-search">View Source</a>

					<a aria-label="Sponsor me" href="https://github.com/sponsors/mrshmllow" className="hover:text-white"><HeartIcon className="w-8 h-8" /></a>
				</footer>
			</body>
		</html>
	);
}
