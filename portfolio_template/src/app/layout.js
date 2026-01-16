import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "@/components/Meta/MetaInformation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	...Metadata,
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${inter.className} scroll-smooth scrollbarwork`}>{children}</body>
		</html>
	);
}
