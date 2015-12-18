import express from 'express';
import http from 'http';
import fs from 'fs';
import path from 'path';
import promisify from 'es6-promisify';


var CONTENT_TYPES = {
    '.js':   'application/javascript',
    '.css':  'text/css',
    '.html': 'text/html',
    '.png':  'image/png'
};

var readFile = promisify(fs.readFile);


export default class Server {
    constructor (port, basePath) {
        this.app       = express();
        this.appServer = http.createServer(this.app).listen(port);
        this.sockets   = [];
        this.basePath  = basePath;

        this._setupRoutes();


        this.appServer.on('connection', socket => {
            this.sockets.push(socket);

            socket.on('close', () => {
                this.sockets.splice(this.sockets.indexOf(socket), 1);
            });
        });
    }

    _setupRoutes () {
        this.app.get('*', async (req, res) => {
            var reqPath      = req.params[0] || '';
            var resourcePath = path.join(this.basePath, reqPath);

            try {
                var content = await readFile(resourcePath);

                res.setHeader('content-type', CONTENT_TYPES[path.extname(resourcePath)]);
                res.send(content);
            }
            catch (err) {
                res.sendStatus(404);
            }
        });
    }

    close () {
        this.appServer.close();
        this.sockets.forEach(socket => {
            socket.destroy();
        });
    }
}
