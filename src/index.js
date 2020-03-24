import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { MTurk } from "./components/mturk_study/mturk";
import "element-theme-default";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<MTurk />, document.getElementById("main"));
serviceWorker.unregister();
