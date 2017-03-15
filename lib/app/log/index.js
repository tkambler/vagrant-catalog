'use strict';

/*
error: the system is in distress, customers are probably being affected (or will soon be) and the fix probably requires human intervention. The “2AM rule” applies here- if you’re on call, do you want to be woken up at 2AM if this condition happens? If yes, then log it as “error”.
warn: an unexpected technical or business event happened, customers may be affected, but probably no immediate human intervention is required. On call people won’t be called immediately, but support personnel will want to review these issues asap to understand what the impact is. Basically any issue that needs to be tracked but may not require immediate intervention.
info: things we want to see at high volume in case we need to forensically analyze an issue. System lifecycle events (system start, stop) go here. “Session” lifecycle events (login, logout, etc.) go here. Significant boundary events should be considered as well (e.g. database calls, remote API calls). Typical business exceptions can go here (e.g. login failed due to bad credentials). Any other event you think you’ll need to see in production at high volume goes here.
debug: just about everything that doesn’t make the “info” cut… any message that is helpful in tracking the flow through the system and isolating issues, especially during the development and QA phases. We use “debug” level logs for entry/exit of most non-trivial methods and marking interesting events and decision points inside methods.
trace: we don’t use this often, but this would be for extremely detailed and potentially high volume logs that you don’t typically want enabled even during normal development. Examples include dumping a full object hierarchy, logging some state during every iteration of a large loop, etc.
*/

const winston = require('winston');
const logger = new winston.Logger();

logger.setLevels({
    'error': 0,
    'warn': 1,
    'info': 2,
    'debug': 3,
    'trace': 4
});

logger.add(winston.transports.Console, {
    'json': true,
    'timestamp': true,
    'stringify': true
});

logger.stream = {
    'write': function(msg, enc) {
        logger.info(msg);
    }
};

module.exports = logger;
