import HomePage from "@/components/HomePage/HomePage";
import Footer from "@/components/HomePage/_Components/Footer";
import Navbar from "@/components/HomePage/_Components/Navbar";
import { Metadata } from "@/components/Meta/MetaInformation";
export const metadata = Metadata

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col justify-center items-center w-full bg-mainBlack">
			<Navbar />
			<section className="w-full">
				<HomePage />
			</section>
			<Footer />
		</main>
	);
}
