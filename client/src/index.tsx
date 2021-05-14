import React from "react";
import ReactDOM from "react-dom";
import { setSyncAdapter, WSSyncAdapter } from "@visly/state";
import { App } from "./App";

setSyncAdapter(WSSyncAdapter("ws://localhost:5000"));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
