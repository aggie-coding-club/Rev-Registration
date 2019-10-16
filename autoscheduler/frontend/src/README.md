# Frontend

## Setup
First, you'll need to install Node.js in order to install npm, which is what we use for managing all of our Javascript packages. Download Node.js and npm [here](https://www.npmjs.com/get-npm).


Once you have npm installed, do the following:

1) `cd` into the src/ folder, where package.json, index.tsx, etc are contained.
2) Run `npm install` to install all of packages required to run/build the project.

## Running

Run `npm run dev` to run webpack and compile our Typescript(`.tsx`) files into javascript

* These `.tsx` files are compiled into `static/main.js`. This `main.js` file is then referenced in `templates/index.html` to load our React & Typescript into a format Django can load and server to our user.

Now, open another terminal, cd into the `autoscheduler` directory(one with `manage.py` in it) and run the server by running `python manage.py runserver`. Navigate to `localhost:8000/` and you should see the basics of the webpage!

## About
We are currently using [Typescript](https://stackoverflow.com/questions/12694530/what-is-typescript-and-why-would-i-use-it-in-place-of-javascript/35048303#35048303) and [React](https://reactjs.org/). To do these, we have 3 configuration files, one for webpack, `webpack.config.js`, one for Typescript, `tsconfig.json`, and one for our package manager npm, `package.json`(and it's generated file `package-lock.json`)

* `package.json`
  * This contains 2 major things:
      1) `devDepencencies`: Contains all of the packages we'll need.
      2) `scripts`: These all us to run `npm run dev` to quickly run webpack/compile our Typescript.
* `tsconfig.json`
  * Defines how typescript is compiled and where to compile it to.

* `webpack.config.js`
  * This is what actually compiles the Typescript and React into javascript for the browser to interpret.
  * See file for descriptions of each config value.
