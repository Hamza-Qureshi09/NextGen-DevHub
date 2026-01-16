"use client";
import React from "react";

const ProjectSkeleton = () => {
	const card_Common_Style =
		"max-w-md sm:max-w-sm min-w-[260px] overflow-hidden shadow-lg bg-[#181818] p-4 rounded-md min-h-[450px] max-h-max hover:scale-[1.02] cursor-pointer transition-all duration-200";
	return (
		<div className="flex flex-row justify-center items-center gap-6 flex-wrap py-2 px-2 w-full h-full">
			<div className={card_Common_Style}>
				<div className="w-full h-48 bg-gray-300 animate-pulse"></div>
				<div className="px-4 py-2">
					<div className="pt-4 pb-2 flex flex-row justify-start items-center flex-wrap gap-2">
						<span className="inline-block h-10 w-20 bg-gray-200 text-gray-800 rounded-md px-3 py-1 animate-pulse delay-150"></span>
						<span className="inline-block h-10 w-20 bg-gray-200 text-gray-800 rounded-md px-3 py-1 animate-pulse delay-150"></span>
					</div>
					<ul className="mt-6 space-y-3">
						<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-100"></li>
						<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-150"></li>
						<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-200"></li>
						<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-300"></li>
					</ul>
				</div>
			</div>
			<div className={card_Common_Style}>
				<div className="w-full h-48 bg-gray-300 animate-pulse"></div>
				<div className="px-4 py-2">
					<div className="pt-4 pb-2 flex flex-row justify-start items-center flex-wrap gap-2">
						<span className="inline-block h-10 w-20 bg-gray-200 text-gray-800 rounded-md px-3 py-1 animate-pulse delay-150"></span>
						<span className="inline-block h-10 w-20 bg-gray-200 text-gray-800 rounded-md px-3 py-1 animate-pulse delay-150"></span>
					</div>
					<ul className="mt-6 space-y-3">
						<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-100"></li>
						<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-150"></li>
						<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-200"></li>
						<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-300"></li>
					</ul>
				</div>
			</div>
			<div className={card_Common_Style}>
				<div className="w-full h-48 bg-gray-300 animate-pulse"></div>
				<div className="px-4 py-2">
					<div className="pt-4 pb-2 flex flex-row justify-start items-center flex-wrap gap-2">
						<span className="inline-block h-10 w-20 bg-gray-200 text-gray-800 rounded-md px-3 py-1 animate-pulse delay-150"></span>
						<span className="inline-block h-10 w-20 bg-gray-200 text-gray-800 rounded-md px-3 py-1 animate-pulse delay-150"></span>
					</div>
					<ul className="mt-6 space-y-3">
						<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-100"></li>
						<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-150"></li>
						<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-200"></li>
						<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-300"></li>
					</ul>
				</div>
			</div>
			<div className={card_Common_Style}>
				<div className="w-full h-48 bg-gray-300 animate-pulse"></div>
				<div className="px-4 py-2">
					<div className="pt-4 pb-2 flex flex-row justify-start items-center flex-wrap gap-2">
						<span className="inline-block h-10 w-20 bg-gray-200 text-gray-800 rounded-md px-3 py-1 animate-pulse delay-150"></span>
						<span className="inline-block h-10 w-20 bg-gray-200 text-gray-800 rounded-md px-3 py-1 animate-pulse delay-150"></span>
					</div>
					<ul className="mt-6 space-y-3">
						<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-100"></li>
						<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-150"></li>
						<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-200"></li>
						<li className="w-full h-4 bg-gray-200 rounded-full animate-pulse delay-300"></li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default ProjectSkeleton;
