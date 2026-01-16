"use client";
import React from "react";
import dynamic from "next/dynamic";
import { FaAward, FaProjectDiagram, FaUsers } from "react-icons/fa";
import { MdDeveloperMode } from "react-icons/md";

const AnimatedNumbers = dynamic(
	() => {
		return import("react-animated-numbers").then((mod) => {
			{
				return mod.default || mod.AnimatedNumbers || mod;
			}
		});
	},
	{ ssr: false, loading: () => <span>0</span> }
);

const achievementsList = [
	{
		metric: "Projects",
		value: "12",
		postfix: "+",
		icon: <FaProjectDiagram />,
	},
	{
		prefix: "~",
		metric: "Users",
		value: "50+",
		icon: <FaUsers />,
	},
	{
		metric: "Years",
		value: "04",
		postfix: "y",
		icon: <MdDeveloperMode />,
	},
	{
		metric: "Awards",
		value: "01",
		icon: <FaAward />,
	},
];

const AchievementsSection = () => {
	return (
		<div className="sm:container py-8 px-4 xl:gap-16 xl:px-16">
			<h2 className="w-full text-center text-2xl x420:text-3xl font-Poppins font-semibold text-white sm:hidden">
				Achievements
			</h2>
			<div className="sm:border-[#33353F] sm:border sm:drop-shadow-md rounded-md py-8 px-2 sm:px-16 flex flex-row items-center justify-center sm:justify-between flex-wrap gap-6">
				{achievementsList.map((achievement, index) => {
					return (
						<div
							key={index}
							className="flex flex-col gap-2 items-center justify-center sm:my-0 sm:py-8 h-32 w-32 rounded-md bg-menuDropDownBg sm:h-0 sm:w-0 sm:bg-transparent sm:px-20"
						>
							<h2 className="text-white font-bold flex flex-row font-Figtree text-3xl">
								{achievement.prefix}
								<AnimatedNumbers
									includeComma
									animateToNumber={parseInt(achievement.value)}
									locale="en-US"
									className="text-white font-bold"
									configs={(_, index) => {
										return {
											mass: 1,
											friction: 100,
											tensions: 140 * (index + 1),
										};
									}}
								/>
								{achievement.metric === "Awards" && (
									<span className="text-lg text-yellow-600">
										{achievement.icon}
									</span>
								)}
								{achievement.postfix}
							</h2>
							<p className="text-[#ADB7BE] font- text-sm flex flex-row justify-center items-center gap-1">
								{achievement.metric}{" "}
								{achievement.metric !== "Awards" && (
									<span className="text-sm text-gray-500">
										{achievement.icon}
									</span>
								)}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default AchievementsSection;
