"use client";
import React from "react";
import HeroSection from "./_Components/HeroSection";
import AchievementsSection from "./_Components/AchievementsSection";
import SkillsSection from "./_Components/SkillsSection";
import ProjectsSection from "./_Components/ProjectsSection";
import AboutSection from "./_Components/AboutSection";
import EmailSection from "./_Components/EmailSection";
// import ServicesSection from "./_Components/ServicesSection";
import HeroSkeleton from "../shared/skeletons/HeroSkeleton";
import ProjectSkeleton from "../shared/skeletons/ProjectSkeleton";
import { Toaster } from "react-hot-toast";

const HomePage = () => {
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		const timeoutId = setTimeout(() => setIsLoading(false), 2000);
		return () => clearTimeout(timeoutId);
	}, []);
	return (
		<div className="">
			{/* special hero section */}
			<div className="bg-gradient-to-tr from-mainBlack to-gray-900 via-mainBlack w-full">
				<div className="container mt-[70px] mx-auto px-12 py-4 ">
					{isLoading ? <HeroSkeleton /> : <HeroSection />}
				</div>
			</div>
			<div className="mt-2 mx-auto px-3 x420:px-4 sm:px-12 py-4">
				<AchievementsSection />
			</div>
			<div className="flex flex-col justify-center items-center w-full bg-gradient-to-bl from-mainBlack to-gray-900 via-mainBlack px-3 x420:px-4 sm:px-12 py-4">
				<SkillsSection />
			</div>
			<div className="flex flex-col justify-center items-center w-full bg-gradient-to-tl from-mainBlack to-gray-900 via-mainBlack px-3 x420:px-4 sm:px-12 py-4">
				{isLoading ? <ProjectSkeleton /> : <ProjectsSection />}
			</div>
			{/* <div className="flex flex-col justify-center items-center w-full bg-gradient-to-tl from-mainBlack to-gray-900 via-mainBlack px-12 py-4">
				<ServicesSection />
			</div> */}
			<div className="flex flex-col justify-center items-center w-full bg-gradient-to-bl from-mainBlack to-gray-900 via-mainBlack px-5 x420:px-6 sm:px-12 py-4">
				<AboutSection />
			</div>
			<div className="flex flex-col justify-center items-center w-full bg-gradient-to-tl from-mainBlack to-gray-900 via-mainBlack px-5 x420:px-6 sm:px-12 py-4">
				<EmailSection />
			</div>

			{/* taosts */}
			<Toaster />
		</div>
	);
};

export default HomePage;
