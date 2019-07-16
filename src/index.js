import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Main } from "./components/Main";
import "element-theme-default";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<Main />, document.getElementById("main"));
serviceWorker.unregister();
