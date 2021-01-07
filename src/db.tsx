import PouchDB from 'pouchdb';

export const localDB = new PouchDB('users');

let remoteHost;

if (navigator && navigator.userAgent.includes('M315')) {
    remoteHost = '192.168.1.38';
} else {
    remoteHost = 'localhost';
}

export const remoteDB = new PouchDB(`http://admin:root@${remoteHost}:5984/remotedb`);