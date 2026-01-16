"use client";
import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import Link from "next/link";

const HeroSection = () => {
	return (
		<section className="h-max">
			<div className="flex flex-col sm:flex-row items-center gap-2 font-Lato lg:pt-10 pb-1 ">
				<motion.div
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					className="col-span-8 place-self-center text-center sm:text-left justify-self-start"
				>
					<h1 className="text-white mb-4 text-4xl sm:text-5xl lg:text-6xl lg:leading-[1.2] leading-[1.1] font-extrabold">
						<span className="font-Lato text-white bg-clip-text bg-gradient-to-r from-purple-500 to-rose-500">
							Hello, I&apos;m
							<br />
							Hamza Qureshi a
						</span>
						<br></br>
						<TypeAnimation
							sequence={[
								"Full Stack Developer", // "Web Developer",
								1000,
								"React Native Expert",
								1000,
								"Design Alchemist", // "UI/UX Designer",
								1000,
							]}
							wrapper="span"
							speed={50}
							repeat={Infinity}
						/>
					</h1>
					<p className="text-[#ADB7BE] text-base sm:text-lg mb-6 lg:text-xl font-Figtree">
						Passionate Full Stack Developer | MERN Stack | Next.js | Redux |
						GraphQL | Innovative Solutions | Gold Medalist.
					</p>
					<div className="font-Figtree">
						<Link
							href="/#contact"
							className="px-6 inline-block py-3 w-full sm:w-fit rounded-full mr-4 bg-gradient-to-br from-purple-500 to-rose-500 hover:bg-slate-200 text-white"
						>
							Hire Me
						</Link>
						<Link
							target="_blank"
							href="drive link"
							className="px-1 inline-block py-1 w-full sm:w-fit rounded-full bg-gradient-to-br from-purple-500 to-rose-500 hover:bg-slate-800 text-white mt-3"
						>
							<span className="block bg-[#121212] hover:bg-slate-800 rounded-full px-5 py-2">
								Download CV
							</span>
						</Link>
					</div>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					className="col-span-4 place-self-center mt-4 lg:mt-0"
				>
					<div className="rounded-full bg-[#181818] w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] relative overflow-hidden ml-2">
						<Image
							// src="/images/hero-image.png"
							src="/images/"
							alt="your image"
							className="w-full h-full rounded-full object-cover "
							width={300}
							height={300}
							priority
						/>
					</div>
				</motion.div>
			</div>
			{/* branding here */}
			<motion.div
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				// className="col-span-4 place-self-center mt-4 lg:mt-0"
			>
				<div className="flex flex-col justify-center items-center sm:justify-start sm:items-start mt-4">
					<h3 className="text-[#ADB7BE] text-base sm:text-lg mb-4 font-Figtree">
						Some of the Clients are <span className="sm:hidden">...</span>
						<span className="hidden sm:inline">
							&nbsp;&nbsp;&nbsp;&nbsp; ----
						</span>
					</h3>
					{/* brand image here */}
					<div className="flex flex-row justify-start items-start h-20 gap-2">
						<Image
							src="/images/brands/"
							alt=" image"
							className="w-max max-w-[150px] h-full object-contain"
							width={300}
							height={300}
							priority
						/>
						<Image
							src="/images/brands/"
							alt=" image"
							className="w-max max-w-[150px] h-full object-contain"
							width={300}
							height={300}
							priority
						/>
					</div>
				</div>
			</motion.div>
		</section>
	);
};

export default HeroSection;
