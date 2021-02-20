import { window } from "vscode";
import * as dayjs from "dayjs";

const outputChannel = window.createOutputChannel("suyoin-vscode");

export const enum LogLevel {
	trace = "TRACE",
	debug = "DEBUG",
	info = "INFO",
	warn = "WARN",
	error = "ERROR",
}

const send = (level: LogLevel, message: string): void => {
	outputChannel.appendLine(
		`[${dayjs().format("DD/MM/YYYY HH:mm:ss")} - ${level}] ${message}`
	);
};

export const log = (level: LogLevel, message: string | Error): void => {
	if (typeof message === "string") {
		send(level, message);
	} else if (message instanceof Error) {
		send(level, message.message);

		if (message.stack) {
			send(level, message.stack);
		}
	} else if (typeof message === "object") {
		try {
			const json = JSON.stringify(message, null, 2);
			send(level, json);
		} catch {}
	}
};
