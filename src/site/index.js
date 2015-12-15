import Server from './server';


export default class Site {
    constructor (port1, port2, viewsPath) {
        this.port1    = port1;
        this.port2    = port2;
        this.basePath = viewsPath;

        this.server1 = null;
        this.server2 = null;
    }

    create () {
        this.server1 = new Server(this.port1, this.basePath);
        this.server2 = new Server(this.port2, this.basePath);
    }

    destroy () {
        this.server1.close();
        this.server2.close();
    }
}
