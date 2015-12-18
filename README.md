## testcafe-functional-harness

Runs functional tests in local browsers and on SauceLabs.

#### What it does

1. Starts the server with the test pages.
2. Opens the specified browsers (locally or on SauceLabs).
3. Runs mocha tests.
4. Closes the browsers and stops the server after all tests are finished.

#### Install:

```
$ npm install testcafe-functional-harness
```
#### How to use:

##### test-runner.js
```js
var createTestCafe            = require('testcafe');
var TestCafeFunctionalHarness = require('testcafe-functional-harness');

var testCafeFunctionalHarness = new TestCafeFunctionalHarness();

var BROWSERS = [{
    platform:    'Windows 10',
    browserName: 'internet explorer',
    alias:       'ie'
}];

var SITE_PORT1 = 2000;
var SITE_PORT2 = 2001;
var VIEWS_PATH = '/tests';

var TIMEOUT_SEC = 60;


exports.browsersConnections = null;
exports.testCafe            = null;

exports.run = function () {
    return createTestCafe('127.0.0.1', 1335, 1336)
        .then(function (tc) {
            exports.testCafe = tc;

            var browsersInfo = BROWSERS.map(function (settings) {
                return {
                    settings:   settings,
                    connection: tc.createBrowserConnection()
                };
            });

            exports.browsersConnections = browsersInfo.map(function (browserInfo) {
                return browserInfo.connection;
            });

            return testCafeFunctionalHarness
                .src(['test.js'])
                .siteSettings(SITE_PORT1, SITE_PORT2, VIEWS_PATH)
                .browsers(browsersInfo)
                .sauceLabs('SAUCELABS_USERNAME', 'SAUCELABS_ACCESSKEY', 'SAUCELABS_JOBNAME')
                .timeout(TIMEOUT_SEC)    // 2 sec by default
                .run();
        });
};
```

##### test.js
```js
var testRunner = require('test-runner.js');
var expect     = require('chai').expect;

var testCafe    = testRunner.testCafe;
var connections = testRunner.browsersConnections;

describe('An example fixture', function () {
    it('demonstrates how to run TestCafe tests from a mocha test', function () {
        var runner = testCafe.createRunner();

        return runner
            .src('testcafe.test.js')
            .browsers(connections)
            .run()
            .then(function (failed) {
                expect(failed).eql(0);
            });
    });
});
```