import assert from 'assert';
import cp from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'bluebird';

const readFile = promisify(fs.readFile);
const exec = promisify(cp.exec);

describe('flow', function() {
  this.timeout(5E4);
  it('should report errors in this project', function (done) {
    const execPromise = new Promise((resolve, reject) => {
      exec('./node_modules/.bin/flow > ./actual', {
        cwd: __dirname
      })
      .then((result) => {
        const [stdout, stderr] = result;
        resolve(stdout.toString());
      })
      .catch((err) => {
        resolve(err);
      });
    }).then(() => {
      const readExpected = readFile(path.join(__dirname, './expected'))
        .then((data) => data.toString());
      const readActual = readFile(path.join(__dirname, './actual'))
        .then((data) => data.toString());
      Promise.all([readActual, readExpected])
        .then(results => {
          const [output, expected] = results;
          assert.equal(output, expected);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
