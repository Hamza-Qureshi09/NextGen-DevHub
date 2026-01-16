"use client";
import React from "react";
import TabButton from "./TabButton";
import { TbBrandNextjs } from "react-icons/tb";
import { FaMedal, FaNetworkWired, FaReact, FaDocker } from "react-icons/fa";
import { SiSocketdotio } from "react-icons/si";
import { SiAntdesign } from "react-icons/si";
import { GrGraphQl } from "react-icons/gr";
import { SiRedis } from "react-icons/si";
import {
	SiTailwindcss,
	SiApachekafka,
	SiKubernetes,
	SiNginx,
	SiNestjs,
} from "react-icons/si";
import Image from "next/image";

const SKILL_CONTENT = [
	{
		TEXT: "text",
		CONTENT:
			"content",
	},
];

const SKILL_CARDS = [
	{
		TEXT: "text",
		ICONS: [
			{ key: 1, icon: <FaDocker /> }
		],
	},
	
];

const TAB_DATA = [
	{
		title: "Skills",
		id: "skills",
		content: (
			<div className="py-6 px-2 x420:p-4 sm:p-8 rounded-md shadow-md">
				<div className="flex flex-wrap flex-row justify-center items-center w-full gap-2 sm:gap-4">
					{/* skills cards */}
					{SKILL_CARDS?.map((val, index) => {
						return (
							<div
								key={index}
								className="w-max px-2 mb-4 font-Figtree tracking-wide hover:scale-105 transition-all duration-150"
							>
								<div className="h-[150px] w-[150px] sm:h-[155px] sm:w-[155px] rounded-md flex flex-col items-center justify-center gap-1 bg-menuDropDownBg">
									<div className="text-white text-4xl mb-2 flex flex-row gap-2">
										{val.ICONS?.map((iconData) => (
											<span key={iconData.key}>{iconData?.icon}</span>
										))}
									</div>
									<div className="text-sm px-2 text-center">{val?.TEXT}</div>
								</div>
							</div>
						);
					})}

					{/* content about skills */}
					<div className="flex flex-col justify-start items-start mt-6">
						<h2 className="text-2xl font-semibold mb-4 font-Poppins">
							Advanced Skills
						</h2>
						{SKILL_CONTENT?.map((val, index) => {
							return (
								<div
									key={index}
									className="w-full px-2 mb-4 flex flex-row items-center"
								>
									<div className="text-green-500 mr-2">&#10003;</div>
									<div className="text-lg">
										<span className="font-semibold mr-2 font-Figtree capitalize tracking-wide">
											{val.TEXT}
										</span>
										<span className="text-base font-Figtree tracking-wide capitalize">
											{val.CONTENT}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		),
	},
	{
		title: "Education",
		id: "education",
		content: (
			<div className="py-6 px-2 x420:p-4 sm:p-8 rounded-md shadow-md ">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col  items-start font-Poppins">
						<div className="w-full flex flex-row justify-between items-center">
							<div className="">
								<div className="text-gray-600 text-sm">Year</div>
								<div className="text-lg font-semibold">2023</div>
							</div>
							<div className="flex flex-row gap-2 justify-center items-center">
								<span>
									<FaMedal className="text-orange-500 text-base sm:text-2xl" />
								</span>
								<span className="font-Figtree font-semibold tracking-wide capitalize text-xl">
									recognition
								</span>
							</div>
						</div>
						<div className="lg:w-3/4">
							<div className="text-gray-600 text-sm">Degree</div>
							<div className="text-lg font-semibold">
								degree name
							</div>
							<div className="text-gray-600 text-sm">University</div>
							<div className="text-lg font-semibold">
								uni name
							</div>
						</div>
					</div>
					<div className="flex flex-row gap-4">
						<p className="text-[15px] font-Figtree tracking-wide">
							your academic journey
						</p>
						<Image
							src="/images/medalist.jpg"
							alt="Hamza Qureshi image"
							className="w-max max-w-[150px] h-full object-contain hidden lg:block rounded-md"
							width={300}
							height={300}
							priority
						/>
					</div>
				</div>
			</div>
		),
	},
	{
		title: "Certifications",
		id: "certifications",
		content: (
			<div className="py-6 px-2 x420:p-4 sm:p-8 rounded-md shadow-md">
				<div className="flex flex-col gap-4 font-Poppins">
					{/* Certificate 1 */}
					<div className="flex flex-col lg:flex-row items-start">
						<div className="w-full flex flex-row justify-between items-center">
							<div className="">
								<div className="text-gray-600 text-sm">Program</div>
								<div className="text-lg font-semibold">program name</div>
							</div>
							<div className="lg:w-3/4">
								<div className="text-gray-600 text-sm">Certificate</div>
								<div className="text-lg font-semibold">
									certificate name
								</div>
							</div>
						</div>
						<p className="text-[15px] font-Figtree tracking-wide mt-2 sm:mt-0 w-full lg:w-2/3">
							{/* Add details about the PSDF program certificate */}
							program details
						</p>
					</div>

					{/* Certificate 2 */}
					<div className="flex flex-col lg:flex-row items-start">
						<div className="w-full flex flex-row justify-between items-center">
							<div className="">
								<div className="text-gray-600 text-sm">Program</div>
								<div className="text-lg font-semibold">name</div>
							</div>
							<div className="lg:w-3/4">
								<div className="text-gray-600 text-sm">Certificate</div>
								<div className="text-lg font-semibold">name</div>
							</div>
						</div>
						<p className="text-[15px] font-Figtree tracking-wide mt-2 sm:mt-0 w-full lg:w-2/3">
							details
						</p>
					</div>
				</div>
			</div>
		),
	},
];

const SkillsSection = () => {
	const [tab, setTab] = React.useState("skills");
	const [isPending, startTransition] = React.useTransition();

	const handleTabChange = (id) => {
		startTransition(() => {
			setTab(id);
		});
	};
	return (
		<section id="skills">
			{/* tabs handling */}
			<div className="text-white sm:container">
				<div className="flex flex-row justify-start flex-wrap gap-2 x420:gap-1 px-10">
					<TabButton
						selectTab={() => handleTabChange("skills")}
						active={tab === "skills"}
					>
						Skills
					</TabButton>
					<TabButton
						selectTab={() => handleTabChange("education")}
						active={tab === "education"}
					>
						Education
					</TabButton>
					<TabButton
						selectTab={() => handleTabChange("certifications")}
						active={tab === "certifications"}
					>
						Certifications
					</TabButton>
				</div>
				<div className="mt-8">{TAB_DATA.find((t) => t.id === tab).content}</div>
			</div>
		</section>
	);
};

export default SkillsSection;
