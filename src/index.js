import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {CardLayout,SelectSort, Main} from './Layout';
import 'element-theme-default';
import * as serviceWorker from './serviceWorker';


//ReactDOM.render(<Layout />, document.getElementById('root'));
//ReactDOM.render(<SelectSort> </SelectSort>, document.getElementById('cas'));
//ReactDOM.render(<CardLayout />, document.getElementById('main'));
ReactDOM.render(<Main />, document.getElementById('main'));
serviceWorker.unregister();




