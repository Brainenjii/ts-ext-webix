"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const main_1 = require("../main");
/**
 * Basic class for all controllers. At construction time it invokes overridden
 * `init` method. Also, it contains links to related views mostly to include
 * them to compile
 */
class Controller {
    constructor() {
        this.views = [];
        // Fill `aliases` hash table at EW controllers manager
        _.assign(main_1.EW.managers.controller.aliases, this.init());
    }
}
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map