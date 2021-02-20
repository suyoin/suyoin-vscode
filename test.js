const RPC = require("discord-rpc"); // npm install discord-rpc

// do 'npm init' or 'npm init -y' in your teminal
// put this in your index file

const clientId = "802405845572517918";

RPC.register(clientId);

const rpc = new RPC.Client({ transport: "ipc" });
const startTimestamp = new Date();

async function setActivity() {
	rpc.setActivity({
		details: `booped times`,
		state: "in slither party",
		startTimestamp,
		largeImageText: "tea is delicious",
		smallImageText: "i am my own pillows",
		instance: false,
	});
}

rpc.on("ready", () => {
	setActivity();

	// activity can only be set every 15 seconds
	setInterval(() => {
		setActivity();
	}, 15e3);
});

rpc.login({ clientId }).catch(console.error);
