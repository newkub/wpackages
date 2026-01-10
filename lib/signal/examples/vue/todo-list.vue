<script setup lang="ts">
import { useSignal, useComputed } from "@wpackages/signal/vue";

interface Todo {
	id: number;
	text: string;
	completed: boolean;
}

const [todos, setTodos] = useSignal<Todo[]>([
	{ id: 1, text: "Learn signals", completed: false },
	{ id: 2, text: "Build app", completed: false },
]);
const [newTodo, setNewTodo] = useSignal("");

const completedTodos = useComputed(() => todos().filter((t) => t.completed));
const incompleteTodos = useComputed(() => todos().filter((t) => !t.completed));
const progress = useComputed(() => {
	const total = todos().length;
	const completed = completedTodos().length;
	return total === 0 ? 0 : (completed / total) * 100;
});

const addTodo = () => {
	if (newTodo().trim()) {
		setTodos((todos) => [
			...todos,
			{ id: Date.now(), text: newTodo(), completed: false },
		]);
		setNewTodo("");
	}
};

const toggleTodo = (id: number) => {
	setTodos((todos) =>
		todos.map((todo) =>
			todo.id === id ? { ...todo, completed: !todo.completed } : todo,
		),
	);
};

const deleteTodo = (id: number) => {
	setTodos((todos) => todos.filter((todo) => todo.id !== id));
};
</script>

<template>
	<div>
		<h1>Todo List</h1>
		<div>
			<input
				v-model="newTodo.value"
				type="text"
				placeholder="Add new todo"
				@keyup.enter="addTodo"
			/>
			<button @click="addTodo">Add</button>
		</div>
		<div>Progress: {{ progress().toFixed(0) }}%</div>
		<h2>Incomplete ({{ incompleteTodos().length }})</h2>
		<ul>
			<li v-for="todo in incompleteTodos()" :key="todo.id">
				<input
					type="checkbox"
					:checked="todo.completed"
					@change="toggleTodo(todo.id)"
				/>
				<span>{{ todo.text }}</span>
				<button @click="deleteTodo(todo.id)">Delete</button>
			</li>
		</ul>
		<h2>Completed ({{ completedTodos().length }})</h2>
		<ul>
			<li v-for="todo in completedTodos()" :key="todo.id">
				<input
					type="checkbox"
					:checked="todo.completed"
					@change="toggleTodo(todo.id)"
				/>
				<span style="text-decoration: line-through">{{ todo.text }}</span>
				<button @click="deleteTodo(todo.id)">Delete</button>
			</li>
		</ul>
	</div>
</template>
