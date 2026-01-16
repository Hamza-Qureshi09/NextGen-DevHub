"use client";
import Link from "next/link";
import React, { useState } from "react";
import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./MenuOverlay";

const navLinks = [
	{
		title: "Services",
		path: "#services",
	},
	{
		title: "Projects",
		path: "#projects",
	},
	{
		title: "About",
		path: "#about",
	},
	{
		title: "Contact",
		path: "#contact",
	},
];

const Navbar = () => {
	const [navbarOpen, setNavbarOpen] = useState(false);

	return (
		<nav className="fixed mx-auto border-b border-gray-800 top-0 left-0 right-0 bg-gradient-to-br from-mainBlack to-gray-900 via-mainBlack bg-opacity-100 h-[70px] z-20">
			<div className="flex container flex-wrap items-center justify-between mx-auto px-4 py-2 h-full">
				<Link
					href={"/"}
					className="text-2xl md:text-3xl text-white font-semibold font-Merriweather"
				>
					logo
				</Link>
				<div className="mobile-menu block md:hidden">
					{!navbarOpen ? (
						<button
							onClick={() => setNavbarOpen(true)}
							className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
						>
							<Bars3Icon className="h-5 w-5" />
						</button>
					) : (
						<button
							onClick={() => setNavbarOpen(false)}
							className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
						>
							<XMarkIcon className="h-5 w-5" />
						</button>
					)}
				</div>
				<div className="menu hidden md:block md:w-auto" id="navbar">
					<ul className="flex p-4 md:p-0 md:flex-row md:justify-center md:items-center md:gap-6 mt-0 h-full px-2">
						{navLinks.map((link, index) => (
							<li key={index}>
								<NavLink href={link.path} title={link.title} />
							</li>
						))}
						<Link
							href={``}
							target="_blank"
							className="bg-gradient-to-br from-purple-500 to-rose-500 p-1 rounded-full h-full text-white"
						>
							<span className="block bg-[#121212] hover:bg-transparent rounded-full px-5 py-2 transition-all duration-150 font-Poppins">
								GitHub Profile
							</span>
						</Link>
					</ul>
				</div>
			</div>
			{navbarOpen ? <MenuOverlay links={navLinks} /> : null}
		</nav>
	);
};

export default Navbar;
