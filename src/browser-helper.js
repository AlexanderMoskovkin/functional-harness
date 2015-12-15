import SaucelabsConnector from 'saucelabs-connector';
import { getBrowserInfo, open as openBrowser, close as closeBrowser } from 'testcafe-browser-natives';
import { Promise } from 'es6-promise';


export default class BrowserHelper {
    constructor (browsersInfo, username, accessKey, jobName) {
        this.browsersInfo = browsersInfo;

        this.slConnector = username && accessKey ?
                           new SaucelabsConnector(username, accessKey) : null;

        this.jobName = jobName;

        this.slBrowsers    = [];
        this.localBrowsers = [];
    }

    async openBrowsers () {
        var startBrowserPromises = [];

        if (this.slConnector) {
            await this.slConnector.connect();

            startBrowserPromises = this.browsersInfo.map(browserInfo => {
                return this.slConnector.startBrowser(browserInfo.settings, browserInfo.connection.url, this.jobName);
            });

            this.slBrowsers = await Promise.all(startBrowserPromises);
        }
        else {
            startBrowserPromises = this.browsersInfo.map(browserInfo => {
                return getBrowserInfo(browserInfo.settings.alias)
                    .then(browser => {
                        return openBrowser(browser, browserInfo.connection.url);
                    });
            });

            await Promise.all(startBrowserPromises);
            this.localBrowsers = this.browsersInfo;
        }
    }

    async closeBrowsers () {
        var closeBrowserPromises = null;

        if (this.slConnector) {
            closeBrowserPromises = this.slBrowsers.map(browser => {
                return this.slConnector.stopBrowser(browser);
            });

            await Promise.all(closeBrowserPromises);
            await this.slConnector.disconnect();
        }
        else {
            closeBrowserPromises = this.localBrowsers.map(browser => {
                return closeBrowser(browser.connection.getStatus().url);
            });

            await Promise.all(closeBrowserPromises);
        }
    }
}
