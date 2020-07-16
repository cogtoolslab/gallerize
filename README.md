# gallerize
tool for generating web-based interactive sketch gallery
=======
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

After cloning the repo, remember to install your node packages by running `npm install` at the top level of the repo. 

### To launch app from your server:

**Step 1**: (Re)-build the app by running <br>
```
./deploy.sh
```
This does NOT serve the app. 

**Step 2**: Start node process to interface with mongodb. The app is running on the selected port (default: 8887). <br>
Go into the the `server` directory and run this comamnd:
```
node store.js --gameport xxxx
```
This *will* serve the app, over the port passed to the gameport flag.

### Judy notes while chatting with Zixian:
1. To check data that has been marked invalid see [this notebook](https://github.com/cogtoolslab/gallerize/blob/mturk/public/parser/find_invalid_drawings.ipynb)
2. `kiddraw` dbname is specified in `gallerize/server/store.js`
3. `check_invalid_v5_dev` colname is specified in `gallerize/server/models/draw.model.js`.




### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

