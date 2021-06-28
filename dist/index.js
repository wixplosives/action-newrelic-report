require('./sourcemap-register.js');module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 270:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FetchError = exports.isSecureUrl = exports.readTextFromStream = exports.fetchText = void 0;
const http_1 = __importDefault(__nccwpck_require__(605));
const https_1 = __importDefault(__nccwpck_require__(211));
const events_1 = __nccwpck_require__(614);
const url_1 = __nccwpck_require__(835);
function fetchText(url, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const request = isSecureUrl(url)
            ? https_1.default.get(url, options)
            : http_1.default.get(url, options);
        const [response] = (yield events_1.once(request, 'response'));
        const { statusCode } = response;
        if (statusCode !== 200) {
            response.resume();
            throw new FetchError(`HTTP ${String(statusCode)}: failed fetching ${url.toString()}`, statusCode);
        }
        return readTextFromStream(response);
    });
}
exports.fetchText = fetchText;
function readTextFromStream(readable, encoding = 'utf8') {
    var readable_1, readable_1_1;
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        let text = '';
        readable.setEncoding(encoding);
        try {
            for (readable_1 = __asyncValues(readable); readable_1_1 = yield readable_1.next(), !readable_1_1.done;) {
                const chunk = readable_1_1.value;
                text += chunk;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (readable_1_1 && !readable_1_1.done && (_a = readable_1.return)) yield _a.call(readable_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return text;
    });
}
exports.readTextFromStream = readTextFromStream;
function isSecureUrl(url) {
    return url instanceof url_1.URL
        ? url.protocol === 'https'
        : url.startsWith('https://');
}
exports.isSecureUrl = isSecureUrl;
class FetchError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.FetchError = FetchError;


/***/ }),

/***/ 109:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(186));
const fs_1 = __importDefault(__nccwpck_require__(747));
const report_1 = __nccwpck_require__(269);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const inputFile = core.getInput('input_file');
            const outputFile = core.getInput('output_file');
            const queryKey = core.getInput('nr_query_id');
            const accountId = core.getInput('nr_account_id');
            const os = core.getInput('measured_os');
            const mdReport = yield report_1.generateReport(inputFile, accountId, queryKey, os);
            fs_1.default.writeFileSync(outputFile, mdReport);
            core.setOutput('data', mdReport);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();


/***/ }),

/***/ 269:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.standardizeOS = exports.generateReport = exports.makeMDReportStringForMetrics = exports.calcChangeForMetrics = exports.getNewRelicDataForMetrics = exports.getListOfMetrics = exports.loadLocalMetricsFromFile = exports.fileExists = void 0;
const http_1 = __nccwpck_require__(270);
const fs_1 = __importDefault(__nccwpck_require__(747));
const core = __importStar(__nccwpck_require__(186));
function convertMetricsListToNRQL(metrics, os) {
    const list = [];
    for (const entry of metrics) {
        list.push(`average(${entry})`);
    }
    const subQuery = list.join(',');
    const query = `SELECT ${subQuery} from measurement since 1 weeks ago where commit is not null and appName = 'component-studio' and os = '${os}'`;
    return query;
}
function parseNewrelicMetrics(rawData) {
    const metrics = {};
    const results = JSON.parse(rawData);
    if (results) {
        for (let i = 0; i < results.metadata.contents.length; i++) {
            const value = Math.round(results.results[i].average);
            const name = results.metadata.contents[i].attribute;
            metrics[name] = value;
        }
    }
    else {
        throw Error('Cannot parse raw data \n ${rawData}');
    }
    return metrics;
}
function getMetrics(newrelicAccountId, newrelicQueryKey, metrics, os) {
    return __awaiter(this, void 0, void 0, function* () {
        const querySelector = convertMetricsListToNRQL(metrics, os);
        const urlWithQuery = `https://insights-api.newrelic.com/v1/accounts/${newrelicAccountId}/query?nrql=${querySelector}`;
        const encoded = encodeURI(urlWithQuery);
        const result = yield http_1.fetchText(encoded, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Query-Key': newrelicQueryKey
            }
        });
        const parsedResults = parseNewrelicMetrics(result);
        return parsedResults;
    });
}
function fileExists(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return (yield fs_1.default.promises.stat(filePath)).isFile();
        }
        catch (_a) {
            return false;
        }
    });
}
exports.fileExists = fileExists;
function loadLocalMetricsFromFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        core.info(`Loading ${filePath}`);
        const fileContent = (yield fileExists(filePath))
            ? yield fs_1.default.promises.readFile(filePath, 'utf8')
            : undefined;
        const metrics = {};
        if (fileContent) {
            const rawMetrics = JSON.parse(fileContent);
            if (rawMetrics) {
                metrics['bundle_time_duration'] = {
                    avg: rawMetrics.bundleTime,
                    normalizedAvg: rawMetrics.bundleTime,
                    normalizedObs: 1
                };
                for (const k in rawMetrics.avg) {
                    const newRelicKeyName = k.replace(/ /g, '_');
                    metrics[newRelicKeyName] = {
                        avg: rawMetrics.avg[k],
                        normalizedAvg: rawMetrics.normalizedAvg[k]['duration'],
                        normalizedObs: rawMetrics.normalizedAvg[k]['observations']
                    };
                }
            }
            else {
                throw new Error(`Cannot parse WcsMeasureResults for \n ${fileContent}`);
            }
        }
        else {
            throw new Error(`File not found ${filePath}`);
        }
        return metrics;
    });
}
exports.loadLocalMetricsFromFile = loadLocalMetricsFromFile;
function getListOfMetrics(metricsList) {
    const retval = [];
    for (const k in metricsList) {
        const metrics_name = k.replace(/ /g, '_');
        retval.push(metrics_name);
    }
    return retval;
}
exports.getListOfMetrics = getListOfMetrics;
function getNewRelicDataForMetrics(nrAccountID, nrQueryKey, metrics, os) {
    return __awaiter(this, void 0, void 0, function* () {
        if (metrics) {
            core.info(`Get NewRelic data for ${Object.keys(metrics).length} metrics`);
            const listOfMetrics = getListOfMetrics(metrics);
            return yield getMetrics(nrAccountID, nrQueryKey, listOfMetrics, os);
        }
        else {
            throw Error('Empty metrics list');
        }
    });
}
exports.getNewRelicDataForMetrics = getNewRelicDataForMetrics;
function calcChangeForMetrics(metrics, nrValues) {
    const changes = {};
    for (const k in metrics) {
        changes[k] = {
            avg: Math.round((metrics[k]['avg'] / nrValues[k] - 1) * 100),
            normalizedAvg: Math.round((metrics[k]['normalizedAvg'] / nrValues[k] - 1) * 100)
        };
    }
    return changes;
}
exports.calcChangeForMetrics = calcChangeForMetrics;
function makeMDReportStringForMetrics(localMetrics, newrelicLatest, os) {
    const changes = calcChangeForMetrics(localMetrics, newrelicLatest);
    const reportRows = new Array('');
    reportRows.push(`| Test (${os}) | Avg (ms) | Normalized Avg (ms) / Obs (n)| Average From NewRelic (ms)| Change % (Avg)|Change % (Normalized Avg)|`);
    reportRows.push('|----|---:|---:|---:|---:|---:|');
    for (const k in localMetrics) {
        const roundedNormalizedAvg = Math.round(localMetrics[k]['normalizedAvg']);
        const roundedAvg = Math.round(localMetrics[k]['avg']);
        reportRows.push(`|${k}|${roundedAvg}|${roundedNormalizedAvg} / ${localMetrics[k]['normalizedObs']} |${newrelicLatest[k]}|${changes[k]['avg']}%|${changes[k]['normalizedAvg']}%|`);
    }
    return reportRows.join('\n');
}
exports.makeMDReportStringForMetrics = makeMDReportStringForMetrics;
function generateReport(localMetricsFileName, nrAccountID, nrQueryKey, os) {
    return __awaiter(this, void 0, void 0, function* () {
        os = standardizeOS(os);
        const localMetrics = yield loadLocalMetricsFromFile(localMetricsFileName);
        if (localMetrics) {
            const len = Object.keys(localMetrics).length;
            core.info(`Found ${len} metrics in ${localMetricsFileName}`);
            const newRelicMetrics = yield getNewRelicDataForMetrics(nrAccountID, nrQueryKey, localMetrics, os);
            if (newRelicMetrics) {
                const report = makeMDReportStringForMetrics(localMetrics, newRelicMetrics, os);
                return report;
            }
        }
        return '';
    });
}
exports.generateReport = generateReport;
function standardizeOS(os) {
    if (os.includes('windows')) {
        return 'win32';
    }
    if (os.includes('linux') || os.includes('ubuntu')) {
        return 'linux';
    }
    if (os.includes('mac')) {
        return 'darwin';
    }
    throw new Error('Could not find specified OS');
}
exports.standardizeOS = standardizeOS;


/***/ }),

/***/ 351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(278);
const os = __importStar(__nccwpck_require__(87));
const path = __importStar(__nccwpck_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(747));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 278:
/***/ ((__unused_webpack_module, exports) => {


// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 614:
/***/ ((module) => {

module.exports = require("events");;

/***/ }),

/***/ 747:
/***/ ((module) => {

module.exports = require("fs");;

/***/ }),

/***/ 605:
/***/ ((module) => {

module.exports = require("http");;

/***/ }),

/***/ 211:
/***/ ((module) => {

module.exports = require("https");;

/***/ }),

/***/ 87:
/***/ ((module) => {

module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

module.exports = require("path");;

/***/ }),

/***/ 835:
/***/ ((module) => {

module.exports = require("url");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __nccwpck_require__(109);
/******/ })()
;
//# sourceMappingURL=index.js.map