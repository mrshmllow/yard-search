import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";

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

			</body>
		</html>
	);
}
