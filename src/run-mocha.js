import Mocha from 'mocha';
import promisify from 'es6-promisify';


export default function runMocha (tests, timeout) {
    var mocha = new Mocha({
        ui:       'bdd',
        reporter: 'spec',
        timeout:  timeout * 1000
    });

    var run = promisify(mocha.run.bind(mocha));

    if (Array.isArray(tests)) {
        tests.forEach(test => {
            mocha.addFile(test);
        });
    }
    else
        mocha.addFile(tests);

    return run();
}
