"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const AboutSection = () => {
	return (
		<>
			<section
				className="overflow-hidden pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] text-white"
				id="about"
			>
				{/* <h2 className="text-4xl font-bold text-white mb-4 w-full text-center font-Poppins">
					About Me
				</h2> */}
				<div className="container mx-auto">
					<div className="flex flex-wrap items-center justify-between -mx-4">
						<div className="w-full px-4 lg:w-6/12">
							<div className="flex items-center -mx-3 sm:-mx-4">
								<div className="w-full px-3 sm:px-4 xl:w-1/2">
									<div className="py-3 sm:py-4">
										<Image
											src={"/images/hamza5.jpg"}
											alt="project image"
											className="w-full rounded-2xl object-cover lg:block bg-transparent"
											width={300}
											height={300}
											priority
										/>
									</div>
									<div className="py-3 sm:py-4">
										<Image
											src={"/images/medalist.jpg"}
											alt="project image"
											className="w-full rounded-2xl object-cover lg:block bg-transparent"
											width={300}
											height={300}
											priority
										/>
									</div>
								</div>
								<div className="w-full px-3 sm:px-4 xl:w-1/2">
									<div className="relative z-10 my-4">
										<Image
											src={"/images/hamza6.jpg"}
											alt="project image"
											className="w-full rounded-2xl object-cover lg:block bg-transparent"
											width={300}
											height={300}
											priority
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="w-full px-4 lg:w-1/2 xl:w-5/12">
							<div className="mt-10 lg:mt-0">
								<span className="block mb-4 text-lg font-semibold text-primary">
									About Me
								</span>
								<h2 className="mb-5 text-3xl font-bold text-dark dark:text-white sm:text-[40px]/[48px]">
									Make customers happy by giving services.
								</h2>
								<p className="mb-5 text-base text-gray-200 tracking-wide ">
									Details1
								</p>
								<p className="mb-5 text-base text-gray-200">
									Details2
								</p>
								<p className="mb-8 text-base text-gray-200">
									🌟 Details3
								</p>
								<Link
									href="/#contact"
									className="px-8 inline-block py-3 w-full text-center sm:w-fit rounded-full mr-4 bg-gradient-to-br from-purple-500 to-rose-500 hover:bg-slate-200 text-white"
								>
									Hire Me
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default AboutSection;
