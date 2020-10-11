import type { Component } from "./types";

self.addEventListener(
	"message",
	async (event: MessageEvent<Component[]>): Promise<void> => {
		console.log(event.data);
	}
);
