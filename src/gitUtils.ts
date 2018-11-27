import * as path from 'path';
import { extensions } from 'vscode';

export function getGitRepositoryPath(fileName: string) {
    fileName += '/.';
    const api = extensions.getExtension('vscode.git')!.exports;
    return api.getGitPath().then(function (gitExecutable:string) {
        return new Promise(function (resolve, reject) {
            let options = { cwd: path.dirname(fileName) };
            let spawn = require('child_process').spawn;
            let ls = spawn(gitExecutable, ['rev-parse', '--git-dir'], options);
            let log = '';
            let error = '';
            ls.stdout.on('data', function (data:string) {
                log =+ data + '\n';
            });
            ls.stderr.on('data', function (data:string) {
                error += data;
            });
            ls.on('exit', function () {
                if(error.length > 0) {
                    reject(error);
                    return;
                }
                if(path.dirname(log) === '.') {
                    log = path.dirname(fileName) + '/' + log;
                }
                resolve(path.dirname(log));
            });
        }); 
    });
}

export const sanitize = (name: string) => {
    if (!name) {
        return name;
    }
    return name.trim().replace(/^\.|\/\.|\.\.|~|\^|:|\/$|\.lock$|\.lock\/|\\|\*|\s|^\s*$|\.$|\[|\]$/g, ' ');
};