const path = require('path');
const egg = require('egg');


const Application = require('./lib/application');
const Agent = require('./lib/agent');


// clone egg API
Object.assign(exports, egg);

// override Application and Agent
exports.Application = Application;
exports.Agent = Agent;
