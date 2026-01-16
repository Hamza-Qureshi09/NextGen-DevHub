"use client";
import React, { useState, useRef } from "react";
import ProjectCard from "./ProjectCard";
import ProjectTag from "./ProjectTag";
import { motion, useInView } from "framer-motion";
import { projectsData } from "@/assets/Projects";

const ProjectsSection = () => {
	const [tag, setTag] = useState("All");
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });

	const handleTagChange = (newTag) => {
		setTag(newTag);
	};

	const filteredProjects = projectsData.filter((project) =>
		project.tag.includes(tag)
	);

	const cardVariants = {
		initial: { y: 50, opacity: 0 },
		animate: { y: 0, opacity: 1 },
	};

	return (
		<section id="projects">
			<h2 className="text-center text-4xl font-bold text-white mt-4 mb-8 md:mb-12 font-Poppins">
				My Projects
			</h2>
			<div className="text-white flex flex-row justify-center items-center flex-wrap gap-2 py-6 font-Figtree">
				<ProjectTag
					onClick={handleTagChange}
					name="All"
					isSelected={tag === "All"}
				/>
			</div>
			<ul
				ref={ref}
				className="flex flex-row justify-center items-center gap-6 flex-wrap py-2 px-2"
			>
				{filteredProjects.map((project, index) => (
					<motion.li
						key={index}
						variants={cardVariants}
						initial="initial"
						animate={isInView ? "animate" : "initial"}
						transition={{ duration: 0.3, delay: index * 0.4 }}
					>
						<ProjectCard
							key={project.id}
							cardIndex={index}
							projectDate={project.projectDate}
							title={project.title}
							description={project.description}
							bigDescription={project.bigDescription}
							imgUrl={project.image}
							gitUrl={project.gitUrl}
							previewUrl={project.previewUrl}
							tags={project.tags}
						/>
					</motion.li>
				))}
			</ul>
		</section>
	);
};

export default ProjectsSection;
