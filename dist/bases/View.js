"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Basic class for all controllers. At construction time it invokes overridden
 * `init` method. Also, it contains links to related views mostly to include
 * them to compile
 */
const main_1 = require("../main");
class View {
    constructor(defaultConfig, config) {
        defaultConfig = this.preprocessConfig(defaultConfig);
        if (!main_1.EW.managers.view.widgets[defaultConfig.alias]) {
            main_1.EW.define(defaultConfig.alias, defaultConfig);
        }
        this.initiated = new Promise(resolve => {
            this.initiate = resolve;
        });
        this.root = main_1.EW.managers.view.build(defaultConfig.alias, Object.assign(defaultConfig, config), this);
    }
}
exports.View = View;
//# sourceMappingURL=View.js.map