import runMocha from './run-mocha.js';
import BrowserHelper from './browser-helper';
import Site from './site';


export default class FunctionalHarness {
    constructor () {
        this.sources = null;

        this.site = null;

        this.browsersInfo = null;

        this.username  = null;
        this.accessKey = null;
        this.jobName   = null;

        this.testTimeout = null;
    }

    src (sources) {
        this.sources = sources;

        return this;
    }

    siteSettings (sitePort1, sitePort2, viewsPath) {
        this.site = new Site(sitePort1, sitePort2, viewsPath);

        return this;
    }

    browsers (browsers) {
        this.browsersInfo = browsers;

        return this;
    }

    sauceLabs (username, accessKey, jobName) {
        this.username  = username;
        this.accessKey = accessKey;
        this.jobName   = jobName;

        return this;
    }

    timeout (sec) {
        this.testTimeout = sec;

        return this;
    }

    async run () {
        var error         = null;
        var browserHelper = new BrowserHelper(this.browsersInfo, this.username, this.accessKey, this.jobName);

        this.site.create();
        await browserHelper.openBrowsers();

        try {
            await runMocha(this.sources, this.testTimeout);
        }
        catch (err) {
            error = err;
        }
        finally {
            await browserHelper.closeBrowsers();
            this.site.destroy();
        }

        if (error)
            throw error;
    }
}
