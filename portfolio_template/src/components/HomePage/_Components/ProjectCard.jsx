import React from "react";
import Link from "next/link";
import Image from "next/image";
import parse from "html-react-parser";
import { motion, AnimatePresence } from "framer-motion";
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline";

const ProjectCard = ({
	imgUrl,
	title,
	tags,
	gitUrl,
	cardIndex,
	previewUrl,
	description,
	projectDate,
	bigDescription,
}) => {
	const [isModalOpen, setModalOpen] = React.useState(false);
	const handleOpenModal = () => {
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
	};
	return (
		<div key={cardIndex}>
			<AnimatePresence>
				{/* normal card */}
				<div
					onClick={handleOpenModal}
					className="group max-w-md sm:max-w-sm min-w-[260px] overflow-hidden shadow-lg bg-[#181818] p-4 rounded-md min-h-[450px] max-h-max hover:scale-[1.02] cursor-pointer transition-all duration-200"
				>
					<Image
						src={imgUrl}
						alt="project image"
						className="w-full h-48 rounded-md object-cover"
						width={400}
						height={400}
						priority
					/>
					<div className="pt-4 pb-2 flex flex-row justify-start items-center flex-wrap gap-2">
						{tags?.map((val, index) => {
							return (
								<span
									key={index}
									className="inline-block  bg-gray-200 text-gray-800 rounded-md px-3 py-1 text-sm font-semibold"
								>
									{val}
								</span>
							);
						})}
					</div>
					<div className="py-4">
						<div className="font-bold text-xl mb-2 text-white font-Poppins capitalize tracking-wide">
							{title}
						</div>
						<p className="text-zinc-400 text-base font-Figtree">
							{description}
						</p>
					</div>
				</div>
				{/* big modal for project showcase */}
				{isModalOpen && (
					<motion.div
						key={cardIndex + 1}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black bg-opacity-90 font-Figtree"
					>
						<motion.div
							initial={{ y: -50, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: -50, opacity: 0 }}
							className="bg-[#181818] rounded-md w-11/12 sm:max-w-3xl relative h-max max-h-[calc(100vh-120px)]"
						>
							{/* close btn */}
							<button
								type="button"
								onClick={handleCloseModal}
								className="text-gray-300 bg-transparent hover:text-gray-200 hover:scale-[1.2] rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center absolute right-4 top-3 z-20 transition-all duration-200"
							>
								<svg
									className="w-3 h-3"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 14 14"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										stroke-width="2"
										d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
									/>
								</svg>
							</button>
							<div className="relative px-3 x420:px-4 sm:px-12 pb-1 pt-14 w-full max-w-3xl">
								<div className="relative rounded-lg shadow h-full max-h-[calc(100vh-260px)] scrollbarwithhiddenbehav">
									<div className="rounded-md bg-[#181818] w-full h-72 relative overflow-hidden">
										<Image
											src={imgUrl}
											alt="project image"
											className="w-full h-full rounded-md object-cover"
											width={500}
											height={500}
											priority
										/>
									</div>

									<div className="p-4 md:p-5 space-y-4">
										<div className="font-bold text-2xl mb-2 text-white font-Poppins capitalize tracking-wide">
											{title}
										</div>
										<div className="py-1 flex flex-row justify-start items-center flex-wrap gap-2">
											{tags?.map((val, index) => {
												return (
													<span
														key={index * (cardIndex + 1)}
														className="inline-block bg-gray-800 text-indigo-500 rounded-md px-3 py-1 text-sm font-semibold font-Nunito"
													>
														{val}
													</span>
												);
											})}
										</div>
										{/* timeline */}
										<div className=" -ml-5 x420:-ml-2 sm:-ml-0">
											<div className="ps-2 my-2 first:mt-0">
												<h3 className="text-xs font-medium uppercase text-gray-200">
													{projectDate[0]} - {projectDate[1]}
												</h3>
											</div>
											<div className="flex gap-x-1 sm:gap-x-3">
												<div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200">
													<div className="relative z-10 w-7 h-7 flex justify-center items-center">
														<div className="w-2 h-2 rounded-full bg-blue-400"></div>
													</div>
												</div>
												<div className="grow pt-0.5 pb-8">
													<p className="mt-1 text-sm text-gray-300">
														project description here
													</p>
													<button
														type="button"
														className="mt-1 -ms-1 p-1 px-2 inline-flex items-center gap-x-2 text-xs rounded-md
														font-Merriweather border border-transparent bg-indigo-300
														text-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
													>
														<Image
															className="flex-shrink-0 w-4 h-4 rounded-full"
															src="/images/hamza.jpg"
															alt="User Image"
															height={16}
															width={16}
														/>
														Your name
													</button>
													<p className="text-gray-200 font-Figtree text-sm mt-6">
														{parse(bigDescription)}
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
								{/* footer */}
								<div className="flex flex-row justify-between gap-2 items-center py-4 border-t border-gray-200 rounded-b w-full bg-[#181818] font-Poppins">
									<Link
										target="_blank"
										href={previewUrl}
										className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full flex flex-row justify-center items-center gap-1"
									>
										View Demo <EyeIcon className="h-5" />
									</Link>
									<Link
										target="_blank"
										href={gitUrl}
										className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 w-full flex flex-row justify-center items-center gap-1"
									>
										View Code <CodeBracketIcon className="h-5" />
									</Link>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ProjectCard;
