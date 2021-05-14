import express from "express";
import enableWs from "express-ws";
import WebSocket from "ws";
import { setSyncAdapter, SyncPayloadType } from "@visly/state";
import chalk from "chalk";
import type { SyncPayload } from "@visly/state";
import type { Patch } from "immer";

import { appState } from "@spike-visly/shared";

const app = enableWs(express()).app;

setSyncAdapter((applyPatches, setState) => {
  const connections = new Set<WebSocket>();

  app.ws("/", (ws) => {
    connections.add(ws);

    ws.send(
      JSON.stringify({
        type: SyncPayloadType.FullSync,
        data: appState.get(),
        key: appState.syncKey,
      })
    );

    ws.on("message", (message) => {
      for (const connection of connections) {
        if (connection !== ws && connection.readyState === WebSocket.OPEN) {
          connection.send(message);
        }
      }

      const { type, key, data } = JSON.parse(
        message as string
      ) as SyncPayload<any>;

      switch (type) {
        case SyncPayloadType.Patches:
          applyPatches(key, data);
          break;
        case SyncPayloadType.FullSync:
          setState(key, data);
          break;
      }
    });

    ws.on("close", () => {
      connections.delete(ws);
    });
  });

  return (key: string, patches: Patch[]) => {
    connections.forEach((connection) => {
      if (connection.readyState === WebSocket.OPEN) {
        connection.send(
          JSON.stringify({
            type: SyncPayloadType.Patches,
            data: patches,
            key,
          })
        );
      }
    });
  };
});

app.listen(5000, () => {
  console.log(
    `${chalk.green(`● Server available`)} at ${chalk.green(
      `http://localhost:5000`
    )}`
  );
});
