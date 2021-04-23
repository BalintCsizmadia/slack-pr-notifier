/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __nccwpck_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
__nccwpck_require__.r(__webpack_exports__);
const axios = require('axios');
const core = require('@actions/core');
const MessageFormatter = require('./message-formatter.js')

const main = async () => {
  try {
    const message = {
        webHook: core.getInput('slack-webHook'),
        channel: core.getInput('slack-channel'),
        title: core.getInput('slack-title'),
        parameters: core.getInput('parameters'),
        createdBy: core.getInput('created-by'),
        jobStatus: core.getInput('job-status'),
        planStatus: core.getInput('plan-status'),
        username: core.getInput('slack-username'),
        icon: core.getInput('slack-icon'),
        iconEmoji: core.getInput('slack-icon-emoji')
    }

    await axios.post({
        url: message.webHook,
        data: MessageFormatter.format(message)
    })
  } catch (error) {
    core.setOutput('result', 'failure');
    core.setFailed(error.message);
  }
};

main();

module.exports = __webpack_exports__;
/******/ })()
;