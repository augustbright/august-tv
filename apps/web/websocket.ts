// TODO: fix websocket connection

import { isServer } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { KEY } from "@/queries/keys";
import { getQueryClient } from "@/queries/queryClient";
import { io, Socket } from "socket.io-client";
import { TMessage } from "@august-tv/common/types";

class WS {
    #client: Socket | null = null;

    connect() {
        if (isServer) return;

        this.disconnect();

        // const socket = io("localhost:3101", {
        //     path: process.env.NEXT_PUBLIC_WS_PREFIX,
        //     transports: ["websocket", "polling"],
        // });

        const socket = io("localhost:3101", {
            path: "/io",
            transports: ["websocket", "polling"],
            withCredentials: true,
        });

        socket.on("connect", () => {
            console.log("WebSocket Client Connected");
            console.log(socket.id);
        });
        socket.on("disconnect", () => {
            console.log("echo-protocol Client Closed");
        });

        socket.on("message", (data) => {
            if (typeof data === "string") {
                let message: TMessage;
                try {
                    message = JSON.parse(data);
                } catch (error) {
                    console.error(`Failed to parse message: ${String(error)}`);
                    return;
                }

                switch (message.type) {
                    case "dummy-notification":
                        toast(message.message);
                        break;
                    case "upload-finished":
                        getQueryClient().invalidateQueries({
                            queryKey: KEY.MY_MEDIA,
                        });
                        getQueryClient().invalidateQueries({
                            queryKey: KEY.VIDEO(message.video.id),
                        });
                        break;
                }
            }
        });

        socket.on("connect_error", (error) => {
            if (socket.active) {
                // temporary failure, the socket will automatically try to reconnect
            } else {
                // the connection was denied by the server
                // in that case, `socket.connect()` must be manually called in order to reconnect
                console.log(`IO connection error: ${error.message}`);
            }
        });

        this.#client = socket;
    }

    disconnect() {
        if (isServer) return;
        this.#client?.close();
        this.#client = null;
    }

    get isConnected() {
        return !!this.#client;
    }
}

export const ws = new WS();
