export interface Repository {
	id: number;
	name: string;
	html_url: string;
	description: string | null;
	stargazers_count: number;
	forks_count: number;
}