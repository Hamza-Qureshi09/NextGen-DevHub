import React from "react";
import NavLink from "./NavLink";

const MenuOverlay = ({ links }) => {
	return (
		<ul className="flex flex-col gap-1 py-4 items-center bg-gradient-to-tr from-mainBlack to-gray-900 via-mainBlack px-4 border-b border-gray-700 md:hidden">
			{links.map((link, index) => (
				<li key={index} className="w-full hover:scale-[1.02] bg-gradient-to-l from-mainBlack to-gray-900 via-mainBlack transition-all duration-200">
					<NavLink href={link.path} title={link.title} />
				</li>
			))}
		</ul>
	);
};

export default MenuOverlay;
