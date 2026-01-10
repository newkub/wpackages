import { useResource } from "@wpackages/signal/react";

const fetchUser = async (id: number) => {
	const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
	if (!response.ok) {
		throw new Error("Failed to fetch user");
	}
	return response.json();
};

export function AsyncData() {
	const [userId, setUserId] = useSignal(1);
	const [user, { loading, error, refetch }] = useResource(() => fetchUser(userId()));

	return (
		<div>
			<h1>User Data</h1>
			<div>
				<button onClick={() => setUserId(1)}>User 1</button>
				<button onClick={() => setUserId(2)}>User 2</button>
				<button onClick={() => setUserId(3)}>User 3</button>
			</div>
			{loading() && <p>Loading...</p>}
			{error() && <p>Error: {String(error())}</p>}
			{user() && (
				<div>
					<h2>{user().name}</h2>
					<p>Email: {user().email}</p>
					<p>Phone: {user().phone}</p>
					<p>Website: {user().website}</p>
					<button onClick={() => refetch()}>Refetch</button>
				</div>
			)}
		</div>
	);
}
