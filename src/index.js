import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Layout from './Layout';
import { Button} from 'element-react';
import 'element-theme-default';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Container />, document.getElementById('root'));
ReactDOM.render(<Button type="primary">Hello</Button>, document.getElementById('but'));
//ReactDOM.render(<Header />, document.getElementById('header'));
serviceWorker.unregister();




