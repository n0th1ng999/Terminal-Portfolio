"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

import React, { Key, useEffect, useRef, useState } from "react";
import {
	faMailBulk,
	faStar,
	faCodeBranch,
} from "@fortawesome/free-solid-svg-icons";

import { Repository } from "@/interfaces/Repository";
import Image from "next/image";

export default function Home() {
	// Ref for terminal output
	const windowContent = useRef<HTMLDivElement | null>(null);

	const windowTerminal = useRef<HTMLDivElement | null>(null);

	const scrollToBottom = () => {
		if (windowContent.current)
			windowContent.current.scrollTop = windowContent.current.scrollHeight;
	};

	// Current input
	const [commandInput, setCommandInput] = useState<string>("");

	//History of inputs
	const [commandHistory, setCommandHistory] = useState<string[]>([]);

	//ART
	const NameArt = () => {
		const name = `
████████╗██╗ ██████╗  █████╗ ███████╗   ██████╗   ██████╗ ███████╗██╗   ██╗
╚══██╔══╝██║██╔════╝ ██╔══██╗██╔════╝  ██╔═══██╗  ██╔══██╗██╔════╝██║   ██║
   ██║   ██║██║  ███╗███████║███████╗  ██║██╗██║  ██║  ██║█████╗  ██║   ██║
   ██║   ██║██║   ██║██╔══██║╚════██║  ██║██║██║  ██║  ██║██╔══╝  ╚██╗ ██╔╝
   ██║   ██║╚██████╔╝██║  ██║███████║  ╚█║████╔╝  ██████╔╝███████╗ ╚████╔╝ 
   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝   ╚╝╚═══╝   ╚═════╝ ╚══════╝  ╚═══╝`;

		return (
			<pre style={{ whiteSpace: "pre-wrap", lineHeight: "1.1rem" }}>{name}</pre>
		);
	};

	const Intro = () => {
		return (
			<div>
				<div className="flex items-start h-fit ">
					<div className=" mr-12">
						<span className="text-foregroundSecondary hidden xl:block">
							{NameArt()}
						</span>
						<br />
						<i className="mt-4 text-sm text-foregroundMuted">
							&quot;AI trainer by night, code master by day <br />
							catching bugs and evolving models like rare Pokémon&quot;
						</i>
					</div>
					<Image
						layout="intrinsic" // Maintains the aspect ratio of the image
						alt="myAvatar"
						width={256}
						height={256}
						quality={100} // Maximum quality
						className="h-[200px] lg:h-full"
						src="/avatar.png"
					/>
				</div>

				<a>
					Type <span className="text-foregroundPrimary font-bold">help</span>{" "}
					for a list of all available commands
				</a>

				<br />
				<br />
			</div>
		);
	};

	// Command output
	const [commandOutput, setCommandOutput] = useState<JSX.Element[]>([
		<Intro key={0} />,
	]);

	//add command to output
	//
	const addToCommandOutput = (content: (string | JSX.Element)[]) => {
		let newCommandOutput = [...commandOutput];

		for (const part of content) {
			if (React.isValidElement(part)) {
				// Clone the element with a unique key based on its position in the array
				newCommandOutput = [
					...newCommandOutput,
					React.cloneElement(part, { key: String(newCommandOutput.length) }),
				];
				continue;
			}

			// Assume `lineComponent` is a function that takes content and an index to create a new component
			newCommandOutput = [
				...newCommandOutput,
				lineComponent(part, newCommandOutput.length),
			];
		}

		setCommandOutput(newCommandOutput);
	};

	//Current history command in View
	const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);

	// Line Component
	const lineComponent = (content: JSX.Element | string, key: Key) => {
		return <p key={key}>{content}</p>;
	};

	//Keyboard press handler function
	const keyboardPressHandler = (event: React.KeyboardEvent) => {
		if (event.key == "Enter") {
			// Add this command prompt to the history
			setCommandHistory([commandInput, ...commandHistory]);

			// Handle command input
			commandHandler(commandInput);

			// Reset history search
			setCurrentHistoryIndex(-1);

			// Clear the input field
			setCommandInput("");
		} else if (event.key == "ArrowUp") {
			// Go "foward" into the past commands
			event.preventDefault();

			// If commandHistory has n commands
			// The first command typed will be at the index commandHistory.length-1

			if (currentHistoryIndex + 1 < commandHistory.length) {
				const currentHistorySelectionIndex = currentHistoryIndex + 1;

				setCommandInput(commandHistory[currentHistorySelectionIndex]);

				setCurrentHistoryIndex(currentHistorySelectionIndex);
			}
		} else if (event.key == "ArrowDown") {
			// Go "back" into the past commands
			event.preventDefault();

			// If commandHistory has n commands
			// The last command typed will be at index 0
			if (currentHistoryIndex > 0) {
				const currentHistorySelectionIndex = currentHistoryIndex - 1;

				setCommandInput(commandHistory[currentHistorySelectionIndex]);

				setCurrentHistoryIndex(currentHistorySelectionIndex);
			}

			if (currentHistoryIndex == 0) {
				setCurrentHistoryIndex(-1);

				setCommandInput("");
			}
		} else if (event.key == "Tab") {
			event.preventDefault();
			// Autocomplete suggestions

			const similarCommand = findSimilarCommand(commandInput);

			if (similarCommand) {
				setCommandInput(similarCommand);
			}
		}
	};

	// Function to count shared characters between input and command
	function countSharedChars(input: string, command: string) {
		let sharedCount = 0;

		// Only compare up to the length of the shorter string
		const minLength = Math.min(input.length, command.length);

		for (let i = 0; i < minLength; i++) {
			if (input[i] === command[i]) {
				sharedCount++;
			}
		}

		return sharedCount;
	}

	// Command list
	const commands = [
		"about",
		"help",
		"intro",
		"clear",
		"contacts",
		"projects",
		"funfact",
	];

	// Function to find the most similar command
	function findSimilarCommand(input: string) {
		let bestMatch: string | null = null;
		let maxSharedChars = 0;

		// Iterate through the commands and find the one with the most shared characters
		for (const command of commands) {
			const sharedChars = countSharedChars(input, command);
			if (sharedChars > maxSharedChars) {
				maxSharedChars = sharedChars;
				bestMatch = command;
			}
		}

		// Suggest the best match only if there's a meaningful similarity (min 2 shared chars)
		return maxSharedChars >= 2 ? bestMatch : null;
	}

	// Executes commands if they exist
	const commandHandler = async (input: string) => {
		let responseContent: (string | JSX.Element)[] = [];

		switch (
			input.toLowerCase().trim() // Remove leading and trailing spaces + transform to lowercase
		) {
			case "about":
				responseContent = [
					<div key={0}>
						<b>
							Hey there! I&apos;m Tiago Gabriel, but you can call me
							&quot;Tigas&quot;.
						</b>
						<br />
						<br />
						Welcome to my corner of the internet, where coding meets creativity!
						<br />
						I&apos;m 22 years old, fresh out of my bachelor&apos;s in Web
						Technologies and
						<br />
						Information Systems, ready to level up and take on the tech world.
						<br />
						<br />
						From UI/UX design to full-stack development, I&apos;ve been stacking
						up
						<br />
						skills like power-ups, always ready for the challenge in the tech
						<br />
						universe.
						<br />
						<br />
						I’ve been grinding through projects and picked up some serious XP in
						<br />
						Machine Learning and Data Analysis during a recent internship. You
						<br />
						could say I&apos;m the guy who loves both building the front end of
						a
						<br />
						game and designing the AI that makes the enemies smarter.
						<br />
						<br />
						<b>Here&apos;s my skill tree:</b>
						<br />
						<br />
						<ul>
							<li>
								UI/UX design: Crafting interfaces that make user journeys feel
								<br />
								like a smooth, well-designed level.
							</li>
							<br />
							<li>
								Full-Stack Development: From front to back, building web apps
								<br />
								that don&apos;t just work, they play.
							</li>
							<br />
							<li>
								Machine Learning & Data Analysis: Making sense of the numbers
								<br />
								and teaching machines to think smarter, because who doesn&apos;t
								want
								<br />a bit of AI magic on their team?
							</li>
						</ul>
						<br />
						<br />
						If you&apos;re looking for a teammate who&apos;s all about
						innovation,
						<br />
						creativity, and fun, let&apos;s connect! Whether it&apos;s for a
						project or
						<br />
						just a game session, I&apos;m always down to meet new allies. 🕹️
					</div>,
				];
				break;

			case "help":
				responseContent = [
					<p key={0}>
						<b className="text-foregroundPrimary">Commands available:</b>
						<br />
						<b>about</b>&nbsp;&nbsp;&nbsp;&nbsp; - &nbsp;Go to my about page
						<br />
						<b>clear</b>&nbsp;&nbsp;&nbsp;&nbsp; - &nbsp;Clear terminal output
						<br />
						<b>contacts</b>&nbsp; - &nbsp;Display my social networks
						<br />
						<b>funfact</b>&nbsp;&nbsp; - &nbsp;Present a random fun fact about
						diverse topics
						<br />
						<b>help</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - &nbsp;Display help menu
						<br />
						<b>intro</b>&nbsp;&nbsp;&nbsp;&nbsp; - &nbsp;Display initial screen
						<br />
						<b>projects</b>&nbsp; - &nbsp;Checkout the projects I worked on
						<br />
					</p>,
				];

				break;

			case "intro":
				responseContent = [<Intro key={0} />];
				break;

			case "clear":
				setCommandOutput([]);
				return;

			case "contacts":
				responseContent = [
					<p key={0}>
						Check out my social media profiles:
						<br />
						<FontAwesomeIcon icon={faGithub}></FontAwesomeIcon>
						&nbsp;GitHub:&nbsp;
						<a className="hover:underline" href="https://github.com/n0th1ng999">
							https://github.com/n0th1ng999
						</a>
						<br />
						<FontAwesomeIcon icon={faLinkedin}></FontAwesomeIcon>
						&nbsp;LinkedIn:&nbsp;
						<a
							className="hover:underline"
							href="https://www.linkedin.com/in/tiagogabrieldev/"
						>
							https://www.linkedin.com/in/tiagogabrieldev/
						</a>
						<br />
						<FontAwesomeIcon icon={faMailBulk}></FontAwesomeIcon>
						&nbsp;Email:&nbsp;
						<a
							className="hover:underline"
							href="https://www.linkedin.com/in/tiagogabrieldev/"
						>
							https://www.linkedin.com/in/tiagogabrieldev/
						</a>
						<br />
					</p>,
				];
				break;

			case "projects":
				const request = await fetch("/api/projects", { cache: "force-cache" });
				const data: { status: number; message: string; repos: Repository[] } =
					await request.json();

				if (request.status === 200) {
					const repos = data.repos;

					responseContent = repos.map((repo) => (
						<div key={repo.id} style={{ marginBottom: "20px" }}>
							<h3 key={`${repo.id}.${0}`}>
								<a
									className="hover:underline"
									href={repo.html_url}
									target="_blank"
									rel="noopener noreferrer"
									key={`${repo.id}.${0.1}`}
								>
									{repo.name}
								</a>
							</h3>
							{repo.description && (
								<p key={`${repo.id}.${1}`}>
									<strong>Description:</strong> {repo.description}
								</p>
							)}
							<p key={`${repo.id}.${2}`}>
								{repo.stargazers_count} <FontAwesomeIcon icon={faStar} />{" "}
							</p>
							<p key={`${repo.id}.${3}`}>
								{repo.forks_count} <FontAwesomeIcon icon={faCodeBranch} />{" "}
							</p>
						</div>
					));
				} else {
					responseContent = [
						<p key={0}>
							Couldn&apos;t fetch the repositories, please try again...
						</p>,
					];
				}

				break;

			case "funfact":
				const funFacts = [
					// JavaScript Facts
					"💻 JavaScript was born in just 10 days! Brendan Eich whipped it up back in 1995, and it's still going strong.",
					"☕ Despite its name, JavaScript has nothing to do with Java it's like comparing ham to hamster.",
					"🤯 NaN in JavaScript means 'Not-a-Number', yet it's technically... a number. The irony is real.",
					"🎭 JavaScript arrays are wild—you can throw in numbers, strings, objects, or even other arrays. It's the ultimate party mix!",
					"🌐 The first-ever website to flex JavaScript magic was Netscape's home page in the '90s. Vintage vibes!",

					// Games Facts
					"🛠️ Minecraft, the ultimate sandbox game, has sold over 238 million copies. It’s basically digital LEGO on steroids.",
					"👻 Pac-Man almost debuted as 'Puck Man', but arcade owners feared vandals would tweak the 'P' into an 'F'. Smart move!",
					"🧢 Pokémon launched its first adventure in Japan in 1996 with Red and Green. Gotta catch 'em all started small!",
					"💥 Doom (1993) practically invented the first-person shooter genre. It's why we have FPS games today!",
					"🎮 The Konami Code (↑↑↓↓←→←→BA) is gaming's most famous cheat code. Legend has it, it unlocks nostalgia.",

					// Pop Culture Facts
					"🌌 Star Wars blasted into theaters in 1977 with Episode IV. Yep, they started in the middle of the story!",
					"🦸 The Marvel Cinematic Universe has raked in billions, proving everyone loves a good superhero team-up.",
					"🤖 'I'll be back' from *The Terminator* almost didn't exist—it was originally scripted as 'I'll come back.' Boring!",
					"🎤 Elvis Presley is the King of Rock and Roll, but he only snagged three Grammys. Shocking, right?",
					"🎶 The Beatles rocked a global TV audience in 1967, becoming the first band to perform live via satellite.",

					// Machine Learning Facts
					"🤖 The term 'machine learning' was coined way back in 1959 by Arthur Samuel. The robots were already scheming!",
					"🧠 The Perceptron, a neural network built in 1958, was the OG of AI. It paved the way for today's deep learning.",
					"♟️ AlphaGo crushed the world’s top Go player in 2016, proving that AIs can dominate ancient strategy games too.",
					"📧 Thank machine learning for saving you from email spam—it’s the unsung hero behind your clutter-free inbox.",
					"🔥 Training deep learning models is like teaching a dragon to dance—it takes a TON of data and power, but the results are epic!",
				];

				const i = Math.floor(Math.random() * funFacts.length);

				responseContent = [funFacts[i]];

				break;

			default:
				// Attempt to find a similar command
				const similarCommand = findSimilarCommand(input);

				// Provide feedback based on the result
				if (similarCommand) {
					responseContent = [
						`${input}: Ability not found! Did you mean to cast "${similarCommand}"?`,
					];
				} else {
					responseContent = [`${input}: command does not exist.`];
				}

				break;
		}

		// Return content
		addToCommandOutput([
			<p key={0} className="my-2">
				Tiago<span className="text-foregroundPrimary">@</span>Pereira:
				{" " + input}
			</p>,

			...responseContent,
		]);
	};

	// Scroll to the bottom whenever commandOutput changes
	useEffect(() => {
		scrollToBottom();
	}, [commandOutput]);

	return (
		<>
			<video
				id="overlay"
				src="/overlayTerminal.mp4"
				autoPlay
				loop
				muted
				className="absolute inset-0 w-full h-full object-cover opacity-[.02] z-0"
				onLoadedMetadata={(e: React.SyntheticEvent<HTMLVideoElement>) => {
					e.currentTarget.playbackRate = 0.65;
				}}
			></video>
			<div
				id="window-border"
				className="md:w-4/5 md:h-4/5 lg:w-3/4 lg:h-3/4 sm:w-full sm:h-full w-full h-full flex-col p-2 rounded-lg bg-terminalBorder"
				ref={windowTerminal}
			>
				<div
					id="window-content"
					className="w-full h-full rounded-md bg-background overflow-y-auto z-10"
					ref={windowContent}
				>
					<div id="content" className="z-10 relative p-4">
						<div id="terminal-output" className="w-full max-h-fit">
							{commandOutput}
						</div>
						<div id="terminal-input" className="flex my-2">
							<span className="mr-2">
								Tiago<span className="text-foregroundPrimary">@</span>Pereira:{" "}
							</span>
							<input
								className="border-none outline-none bg-transparent flex-grow w-full"
								onKeyDown={(e) => keyboardPressHandler(e)}
								type="text"
								id="command-input"
								autoFocus={true}
								onChange={(event) => setCommandInput(event.target.value)}
								value={commandInput}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
