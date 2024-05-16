
const egg = require('egg');

const decorators = require('./lib/decorator');
const axios = require("./lib/axios.js");


const Application = require('./lib/application');
const Agent = require('./lib/agent');


// clone egg API
Object.assign(exports, egg);

// override Application and Agent
exports.Application = Application;
exports.Agent = Agent;

exports.decorators = decorators;
exports.axios = axios;
