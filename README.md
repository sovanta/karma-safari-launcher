# karma-safari-launcher

> Launcher for Safari.

## Added Pull Request currently

There were some important Pull Requests open for us (not from us) and for the meantime we concat them all in this repo for us:

- Merged PR: <https://github.com/karma-runner/karma-safari-launcher/pull/14> so karma test tabs will be closed.
- Merged PR: <https://github.com/karma-runner/karma-safari-launcher/pull/22> to use WebDriver to run tests (preferred solution).

### Safari WebDriver Setup

How does this work? (<https://webkit.org/blog/6900/webdriver-support-in-safari-10/>)

1. It launches `/usr/bin/safaridriver` on a specified port (defaults to **4444**).
1. It then "ping"s the **safaridriver** until it starts accepting incoming connections.
1. Creates a new WebDriver session (e.g., opens Safari).
1. Navigates to the Karma provided URL.

**To use this you need to do following setup steps:**

- **Enable Remote Automation** in safari (in dev tools settings)
- **Authorize safaridriver**: `sudo /usr/bin/safaridriver --enable`

## Installation

The easiest way is to keep `karma-safari-launcher` as a devDependency in your `package.json`.

```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-safari-launcher": "~0.1"
  }
}
```

You can simple do it by:

```bash
npm install karma-safari-launcher --save-dev
```

## Configuration

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    browsers: ['Safari']
  });
};
```

You can pass list of browsers as a CLI argument too:

```bash
karma start --browsers Safari
```

----

For more information on Karma see the [homepage].

[homepage]: http://karma-runner.github.com
