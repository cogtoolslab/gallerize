import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {CardLayout,SelectSort} from './Layout';
import 'element-theme-default';
import * as serviceWorker from './serviceWorker';


//ReactDOM.render(<Layout />, document.getElementById('root'));
ReactDOM.render(<SelectSort> </SelectSort>, document.getElementById('cas'));
ReactDOM.render(<CardLayout />, document.getElementById('main'));
serviceWorker.unregister();




