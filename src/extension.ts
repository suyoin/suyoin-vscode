// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Client, Presence, register } from "discord-rpc";
import { log, LogLevel } from "./log";

const CLIENT_ID = "802405845572517918";

register(CLIENT_ID);

const statusBarIcon = vscode.window.createStatusBarItem(
	vscode.StatusBarAlignment.Left
);
statusBarIcon.text = "suyoin-vscode connecting...";

let rpc = new Client({ transport: "ipc" });

const cleanUp = () => {};

const sendActivity = async () => {
	rpc.setActivity({
		state: "SUS?!?!",
		details: "stan ayame",
		startTimestamp: Date.now(),
		largeImageKey: "ayame",
		largeImageText: "the one",
		smallImageKey: "suyoinker",
		smallImageText: "hello",
		partyId: "lol",
		partySize: 420,
		partyMax: 69,
		joinSecret: "MTI4NzM0OjFpMmhuZToxMjMxMjM=",
	} as Presence);
};

const login = async () => {
	rpc = new Client({ transport: "ipc" });

	rpc.once("ready", () => {
		log(LogLevel.info, "Connected to Discord");
		cleanUp();

		statusBarIcon.text = "suyoin-vscode connected to Discord";

		sendActivity();
	});

	try {
		await rpc.login({ clientId: CLIENT_ID });
	} catch (err) {
		log(
			LogLevel.error,
			`Encountered error while trying to log in bot:\n${err as string}`
		);

		cleanUp();
		await rpc.destroy();
		statusBarIcon.text = "suyoin-vscode disconnected";
	}
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	log(LogLevel.info, "suyoin-vscode activated.");

	const enable = async () => {
		cleanUp();
		statusBarIcon.text = "suyoin-vscode connecting...";
		statusBarIcon.show();
		await login();
	};

	const disable = async () => {
		cleanUp();
		await rpc.destroy();
		statusBarIcon.hide();
	};

	const enabler = vscode.commands.registerCommand(
		"suyoin-vscode.enable",
		async () => {
			await enable();
			vscode.window.showInformationMessage(
				"Enabled suyoin-vscode for this workspace."
			);
		}
	);

	const disabler = vscode.commands.registerCommand(
		"suyoin-vscode.disable",
		async () => {
			await disable();
			vscode.window.showInformationMessage(
				"Disabled suyoin-vscode for this workspace."
			);
		}
	);

	context.subscriptions.push(enabler, disabler);

	statusBarIcon.show();
	await login();

	try {
		const gitExtension = vscode.extensions.getExtension("vscode.git");
		if (!gitExtension?.isActive) {
			await gitExtension?.activate();
		}
	} catch {}
}

// this method is called when your extension is deactivated
export async function deactivate() {
	cleanUp();
	await rpc.destroy();
}
