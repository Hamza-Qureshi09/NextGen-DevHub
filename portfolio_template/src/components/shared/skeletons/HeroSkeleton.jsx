"use client";
import React from "react";

const HeroSkeleton = () => {
	return (
		<div className="flex items-center flex-wrap gap-6 sm:gap-1 h-[400px]">
			<div className="flex-grow w-1/2">
				<h3
					className="h-4 bg-gray-200 rounded-full animate-pulse delay-300 transition-all duration-150"
					style={{ width: "40%" }}
				></h3>
				<ul className="mt-6 space-y-3">
					<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-100"></li>
					<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-150"></li>
					<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-200"></li>
					<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-300"></li>
				</ul>
			</div>
			<div className="ml-8 w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] rounded-full bg-gray-200 animate-pulse"></div>
		</div>
	);
};

export default HeroSkeleton;
