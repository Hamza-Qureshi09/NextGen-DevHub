import Link from "next/link";
import Image from "next/image";
import React from "react";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
	return (
		// bg-gradient-to-tr from-mainBlack to-gray-900 via-mainBlack 
		<footer className="footer border z-10 border-t-[#33353F] border-l-transparent border-r-transparent text-white px-12 py-4 font-Figtree w-full h-max">
			<div className="p-2 sm:px-12 sm:py-1 flex flex-row justify-center sm:justify-between items-center flex-wrap">
				<span className=" h-28">
					<Image
						src={"image"}
						alt="hamza qureshi"
						width={500}
						height={100}
						className=" w-max h-full object-cover invert"
					/>
				</span>
				<p className="text-slate-600">
					<span>@{new Date().getFullYear()} All rights reserved.</span>
					<span className="socials flex flex-row justify-center items-center sm:justify-start gap-2 text-white mt-2">
						<Link target="_blank" href="github link">
							<FaGithub className="text-xl" />
						</Link>
						<Link
							target="_blank"
							href="linkedin link"
						>
							<FaLinkedin className="text-xl" />
						</Link>
						<Link
							target="_blank"
							href="fb link"
						>
							<FaFacebook className="text-xl" />
						</Link>
					</span>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
