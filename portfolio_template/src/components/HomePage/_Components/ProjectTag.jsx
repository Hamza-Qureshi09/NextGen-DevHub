import React from "react";

const ProjectTag = ({ name, onClick, isSelected }) => {
	const buttonStyles = isSelected
		? "text-white border-none bg-gradient-to-br from-purple-500 to-rose-500"
		: "text-[#ADB7BE] border-slate-600 hover:border-white hover:bg-gradient-to-br hover:from-purple-500 hover:to-rose-500 hover:text-white hover:border-transparent";
	return (
		<button
			className={`${buttonStyles} rounded-full border-2 px-6 py-2 text-xl cursor-pointer font-Nunito transition-all duration-200`}
			onClick={() => onClick(name)}
		>
			{name}
		</button>
	);
};

export default ProjectTag;
