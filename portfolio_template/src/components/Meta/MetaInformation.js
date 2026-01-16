// "use client"
import Image from "next/image";

// icons or images paths
const iconPath = "../../../public/images/logo.jpg";
const frontEndLink = process.env.NEXT_PUBLIC_BASE_FRONTEND_URL;
const description = `Welcome to my portfolio website! I am Hamza Qureshi,`;

const keywords = [
	"Hamza Qureshi",
	"Full Stack Developer",
];
const Icon = () => {
	return (
		<Image
			src={iconPath}
			height={30}
			width={30}
			priority={true}
			alt="etihad icon"
		/>
	);
};

export const Metadata = {
	title: "Hamza Qureshi - Full Stack Developer",
	description: description,
	keywords: keywords,
	author: "Hamza Qureshi",
	url: new URL(frontEndLink),
	metadataBase: new URL(frontEndLink),
	image: <Icon />,
	type: "website",
	locale: "en-US",
	twitter: {
		card: "summary_large_image",
		site: "@HamzaQu14589309",
		title: "Hamza Qureshi",
		description: `${description}`,
		image: <Icon />,
	},
	facebook: {
		app_id: "100011364909978",
		title: "HáMzà Qûrèshí",
		description: `${description}`,
		image: <Icon />,
		type: "website",
		url: new URL(frontEndLink),
	},
	openGraph: {
		title: "Hamza Qureshi",
		description: description,
		image: {
			url: <Icon />,
			width: 30,
			height: 30,
			type: "image/png",
		},
		url: new URL(frontEndLink),
		type: "website",
		locale: "en_US",
	},
};
