"use client";
import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const EmailSection = () => {
	const [emailSubmitted, setEmailSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [emailMsg, setEmailMsg] = useState({
		email: "",
		subject: "",
		message: "",
	});

	const handleInput = (e) => {
		const { name, value } = e.target;
		setEmailMsg((preVal) => {
			return {
				...preVal,
				[name]: value,
			};
		});
	};

	const handleSubmit = async (e) => {
		if (!emailMsg.email) {
			return toast.error("Email Field is required!", {
				duration: 2000,
				position: "top-center",
			});
		}
		if (!emailMsg.message) {
			return toast.error("Kindly write your message!", {
				duration: 2000,
				position: "top-center",
			});
		}
		if (!emailMsg.subject) {
			return toast.error("Subject Field is required!", {
				duration: 2000,
				position: "top-center",
			});
		}
		try {
			setLoading(true);
			const { email, message, subject } = emailMsg;
			const data = {
				email: email,
				subject: subject,
				message: message,
			};

			// email sending service
			emailjs
				.send("service_id_here", "template_id_here", data, {
					publicKey: "public_key_here",
				})
				.then(
					() => {
						toast.success(`Message send Successfully!`, {
							duration: 2000,
							position: "top-center",
						});
						setEmailMsg({
							email: "",
							subject: "",
							message: "",
						});
						return setLoading(false);
					},
					(error) => {
						setEmailMsg({
							email: "",
							subject: "",
							message: "",
						});
						toast.error("Something went wrong! Message Failed.", {
							duration: 2000,
							position: "bottom-right",
						});
						return setLoading(false);
					}
				);
		} catch (error) {
			setLoading(false);
			setEmailMsg({
				email: "",
				subject: "",
				message: "",
			});
			return toast.error("Something went wrong! Message Failed.", {
				duration: 2000,
				position: "bottom-right",
			});
		}
	};
	return (
		<section
			id="contact"
			className="grid md:grid-cols-2 my-2 py-12 gap-4 relative font-Figtree tracking-wide"
		>
			<div className="z-10">
				<h5 className="text-xl font-bold text-white my-2 font-Poppins">
					Let&apos;s Connect
				</h5>
				<p className="text-[#ADB7BE] mb-4 max-w-md">
					I&apos;m currently looking for new opportunities, my inbox is always
					open. Whether you have a question or just want to say hi, I&apos;ll
					try my best to get back to you!
				</p>
				<div className="socials flex flex-row gap-2 text-white">
					<Link href="github link">
						<FaGithub className="text-xl" />
					</Link>
					<Link href="fb link">
						<FaLinkedin className="text-xl" />
					</Link>
				</div>
			</div>
			<div>
				{emailSubmitted ? (
					<p className="text-green-500 text-sm mt-2">
						Email sent successfully!
					</p>
				) : (
					<div className="flex flex-col">
						<div className="mb-6">
							<label
								htmlFor="email"
								className="text-white block mb-2 text-sm font-medium"
							>
								Your Email
							</label>
							<input
								name="email"
								type="email"
								id="email"
								value={emailMsg.email}
								onChange={handleInput}
								required
								className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
								placeholder="xyz@gmail.com"
							/>
						</div>
						<div className="mb-6">
							<label
								htmlFor="subject"
								className="text-white block text-sm mb-2 font-medium"
							>
								Subject
							</label>
							<input
								name="subject"
								type="text"
								id="subject"
								value={emailMsg.subject}
								onChange={handleInput}
								required
								className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
								placeholder="Just saying hi"
							/>
						</div>
						<div className="mb-6">
							<label
								htmlFor="message"
								className="text-white block text-sm mb-2 font-medium"
							>
								Message
							</label>
							<textarea
								name="message"
								id="message"
								value={emailMsg.message}
								onChange={handleInput}
								className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
								placeholder="Let's talk about..."
							/>
						</div>
						<button
							type="submit"
							disabled={loading}
							onClick={() => {
								handleSubmit();
							}}
							className={`px-8 inline-block py-3 w-full text-center sm:w-fit rounded-full mr-4 bg-gradient-to-br from-purple-500 to-rose-500 hover:bg-slate-200 text-white`}
						>
							{loading === true ? "Sending..." : "Send Message"}
						</button>
					</div>
				)}
			</div>
		</section>
	);
};

export default EmailSection;
