"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const main_1 = require("../main");
class ControllerManager {
    constructor() {
        /**
         * Store for controller rules for event assignment
         * @type {{}}
         */
        this.aliases = {};
    }
    /**
     * Assign events for provided view. Currently, it supports only widgets with
     * base xview alias and `#itemId` referencing to concrete child with provided
     * itemId
     *
     * @param alias
     * @param view
     * @param scope
     */
    assignEvents(alias, view, scope) {
        let selectorsConfig = this.aliases[alias];
        if (!selectorsConfig) {
            return;
        }
        _.each(selectorsConfig, (eventsConfig, selector) => {
            switch (typeof eventsConfig) {
                case "function":
                    if (view.attachEvent) {
                        view.attachEvent(selector, eventsConfig.bind(view, scope || view));
                    }
                    break;
                case "object":
                    _.each(eventsConfig, (handler, event) => {
                        let element = main_1.EW.getEl(view.config.id + selector);
                        if (element) {
                            element.attachEvent(event, handler.bind(element, scope || view, element));
                        }
                    });
                    break;
                default:
            }
        });
    }
}
exports.ControllerManager = ControllerManager;
//# sourceMappingURL=Controller.js.map