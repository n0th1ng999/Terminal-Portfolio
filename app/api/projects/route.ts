import { Repository } from "@/interfaces/Repository";
import { NextResponse } from "next/server";

const token = process.env.GITHUB_TOKEN; // Replace with your token
const username = process.env.GITHUB_USERNAME; // Replace with your GitHub username

async function fetchStarredRepos(): Promise<Repository[]> {
	const url = `https://api.github.com/users/${username}/starred`;

	try {
		const response = await fetch(url, {
			headers: {
				Authorization: `token ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error(`Error: ${response.status} - ${response.statusText}`);
		}

		const repos: Repository[] = await response.json();
		return repos;
	} catch {
		return []; // Return an empty array in case of an error
	}
}

export async function GET() {
	const repos = await fetchStarredRepos();

	if (repos.length === 0) {
		// Send an error message
		return NextResponse.json(
			{
				message: "No starred repositories were retrieved",
			},
			{ status: 500 }
		);
	}

	// Send the repos information
	return NextResponse.json(
		{ message: "Successufully retreived ", repos },
		{ status: 200 }
	);
}
