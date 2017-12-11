"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = require("./bases/Controller");
exports.Controller = Controller_1.Controller;
const View_1 = require("./bases/View");
exports.View = View_1.View;
const Controller_2 = require("./managers/Controller");
const Util_1 = require("./managers/Util");
const View_2 = require("./managers/View");
class ExtWebix {
    widget(xtype, config, scope) {
        return this.managers.view.build(xtype, config, scope);
    }
    define(name, config) {
        return this.managers.view.process(name, config);
    }
    // noinspection JSMethodCanBeStatic
    getEl(selector) {
        return $$(selector);
    }
    find(widget, selector) {
        return $$(widget.getTopParentView().config.id +
            selector);
    }
    application(applicationConfig) {
        this.appConfig = applicationConfig;
        this.window[applicationConfig.name] = {};
        this.project = this.window[applicationConfig.name];
        webix.ready(() => {
            let viewport;
            if (this.appConfig.autoViewport) {
                viewport = this.widget(this.appConfig.autoViewport);
            }
            if (this.appConfig.launch) {
                this.appConfig.launch(viewport);
            }
        });
    }
    constructor() {
        let controllerManager = new Controller_2.ControllerManager();
        this.window = window;
        this.managers = {
            view: new View_2.ViewManager(controllerManager),
            util: new Util_1.UtilManager(),
            controller: controllerManager
        };
    }
}
exports.ExtWebix = ExtWebix;
exports.EW = new ExtWebix();
//# sourceMappingURL=main.js.map