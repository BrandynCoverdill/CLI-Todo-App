import yargs from 'yargs';
import readline from 'readline';
import shellQuote from 'shell-quote';
import {
	createTask,
	readTasks,
	updateTask,
	deleteTask,
	initializeTasks,
} from './taskHelper.mjs';

// Create Readline interface
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: '> ',
});

// Set up commands for yargs to run in the CLI
const setupYargCommands = () => {
	return yargs()
		.scriptName('')
		.command(
			'add <desc>',
			'add a task',
			(yargs) => {
				yargs.positional('desc', {
					describe: 'task description',
					type: 'string',
					demandOption: true,
				});
			},
			(argv) => {
				// Create a new task in tasks.json
				createTask(argv.desc);
				console.log(`Task created: ${argv.desc}`);
			}
		)
		.command('list', 'list all tasks', (argv) => {
			// List all tasks from tasks.json
			readTasks();
		})
		.command(
			'update <id> <desc>',
			"update a task by it's id",
			(yargs) => {
				yargs.positional('id', {
					describe: 'id of the task you want to update',
					type: 'number',
					demandOption: true,
				});
				yargs.positional('desc', {
					describe: 'updated description',
					type: 'string',
					demandOption: true,
				});
			},
			(argv) => {
				// update task in tasks from tasks.json
				updateTask(argv.id, argv.desc);
			}
		)
		.command(
			'delete <id>',
			"delete a task by it's id",
			(yargs) => {
				yargs.positional('id', {
					describe: 'id of the task',
					type: 'number',
					demandOption: true,
				});
			},
			(argv) => {
				// delete task in tasks from tasks.json
				deleteTask(argv.id);
			}
		)
		.help();
};

// create an instance of the yarg commands to run when the app starts
const yargsInstance = setupYargCommands();

// Starts the application
const runProgram = async () => {
	// initialize tasks.json
	await initializeTasks();
	console.log(
		'Type help for a list of commands or type [ctrl + c] to end the program'
	);

	rl.prompt();

	// Process the line provided from the user
	rl.on('line', (input) => {
		// If there is any input, try to process and run the command
		if (input.trim()) {
			const parsedInput = shellQuote.parse(input);
			yargsInstance.parse(parsedInput, (err, argv, output) => {
				if (err) {
					console.log('Could not execute command.');
					console.log(err.message);
				} else {
					if (output) {
						console.log(output);
					}
				}
				rl.prompt();
			});
		}
	});

	// When the user closes the app or program
	rl.on('close', () => {
		console.log('Goodbye!');
		process.exit(0);
	});
};

runProgram();
