# Install Jest
~~~
npm init -y
npm i --save-dev jest
~~~

# Add testing package
In the ```packages.json``` file:
~~~
"test": "jest"
~~~
Or to generate an HTML file:
~~~
"test": "jest --coverage"
~~~

# Run unit tests
~~~
npm test
~~~

# Install Stryker
~~~
npm install --save-dev @stryker-mutator/core @stryker-mutator/jest-runner
npx stryker init
~~~

# Add configurations
In the ```stryker.config.json``` file add ```"json"``` to the reporters list.
~~~
"reporters": [
    "html",
    "clear-text",
    "progress",
    "json"
]
~~~

In the same file add ```"mutate"``` field, according to the directory structure:
~~~
"mutate": [
    "*.js",
    "!*.test.js"
]
~~~

# Run Stryker
~~~
npx stryker run
~~~

# Generate mutants file
~~~
node generate_mutants.js
~~~