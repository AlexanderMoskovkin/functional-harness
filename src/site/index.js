import Server from './server';


export default class Site {
    constructor (sitePort1, sitePort2, viewsPath) {
        this.sitePort1 = sitePort1;
        this.sitePort2 = sitePort2;
        this.basePath  = viewsPath;

        this.server1 = null;
        this.server2 = null;
    }

    create () {
        this.server1 = new Server(this.sitePort1, this.basePath);
        this.server2 = new Server(this.sitePort2, this.basePath);
    }

    destroy () {
        this.server1.close();
        this.server2.close();
    }
}
