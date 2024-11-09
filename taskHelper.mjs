import path from 'node:path';
import fs from 'node:fs/promises';

// Get current directory
const __dirname = path.resolve();

// Task id count
let taskId = 0;

// Tries to access tasks.json, and if it isn't present, create that file
const initializeTasks = async () => {
	try {
		await fs.access(`${__dirname}/tasks.json`);

		// if the file is there, try and grab the last tasks id and save the number for taskId
		try {
			const data = await fs.readFile(`${__dirname}/tasks.json`);
			const json = JSON.parse(data);
			const lastId = json[json.length - 1].id + 1;
			taskId = lastId;
		} catch (err) {
			// do nothing
		}
	} catch (err) {
		await fs.appendFile(`${__dirname}/tasks.json`, '[]');
	}
};

// Create a new task in tasks.json
const createTask = async (desc) => {
	// Grab existing data from the json file
	const data = await fs.readFile(`${__dirname}/tasks.json`);
	const tasks = JSON.parse(data);

	// Create an object with the argument from the user
	const newTask = {
		id: taskId++,
		desc: desc,
	};

	// Add the newTask to tasks
	tasks.push(newTask);

	// stringify the json object to save it back to tasks.json
	await fs.writeFile(`${__dirname}/tasks.json`, JSON.stringify(tasks));
};

// Read all tasks from tasks.json
const readTasks = async () => {
	const data = await fs.readFile(`${__dirname}/tasks.json`);
	const tasks = JSON.parse(data);
	if (tasks.length === 0) {
		console.log('There are no tasks to read.');
	} else {
		console.log('id - task\n');
		console.log('-----------------');
		tasks.forEach((task) => {
			console.log(`${task.id} - ${task.desc}`);
		});
	}
};

// Update task from tasks.json
const updateTask = async (id, desc) => {
	// get existing data from tasks.json and parse the data into an object
	const data = await fs.readFile(`${__dirname}/tasks.json`);
	const tasks = JSON.parse(data);

	// Try to find the task
	const oldTask = await tasks.find((task) => task.id === id);

	// Alert the user if the task could not be found
	if (!oldTask) {
		console.log(`Could not find task with an id of ${id}`);
	} else {
		// update the found task with the new information
		const newTasks = tasks.map((task) => {
			if (task.id === oldTask.id) {
				return {
					...task,
					desc: desc,
				};
			} else {
				return task;
			}
		});

		// update tasks.json with the new tasks
		await fs.writeFile(`${__dirname}/tasks.json`, JSON.stringify(newTasks));
		console.log('Task updated');
	}
};

// Delete task from tasks.json
const deleteTask = async (id) => {
	// get existing tasks from tasks.json
	const data = await fs.readFile(`${__dirname}/tasks.json`);
	const tasks = JSON.parse(data);

	// Try and find the task with the given id
	const taskToDelete = tasks.find((task) => task.id === id);

	// If the task wasnt found
	if (!taskToDelete) {
		console.log(`Could not find a task with an id of ${id}`);
	} else {
		// If the task was found, delete the task from tasks
		const newTasks = tasks.filter((task) => task !== taskToDelete);

		// stringify the object and write it to tasks.json
		await fs.writeFile(`${__dirname}/tasks.json`, JSON.stringify(newTasks));

		console.log('Task succesfully deleted');
	}
};

export { createTask, readTasks, updateTask, deleteTask, initializeTasks };
