import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
	icons: { icon: "/favicon.ico" },
	title: "Tiago's Terminal",
	description: "Tiago Gabriel Pereira's portfolio in a command line interface",
};

const JetBrainsMonoLight = localFont({
	src: "../fonts/JetBrainsMono-Light.ttf",
	preload: true,
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className={JetBrainsMonoLight.className} lang="en">
			<body className="w-dvw h-dvh flex flex-col items-center justify-center text-l text-foreground bg-websiteBackground ">
				{children}
			</body>
		</html>
	);
}
