System.register("types/Types", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("bases/Controller", ["lodash", "main"], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var _, main_1, Controller;
    return {
        setters: [
            function (_1) {
                _ = _1;
            },
            function (main_1_1) {
                main_1 = main_1_1;
            }
        ],
        execute: function () {
            /**
             * Basic class for all controllers. At construction time it invokes overridden
             * `init` method. Also, it contains links to related views mostly to include
             * them to compile
             */
            Controller = class Controller {
                constructor() {
                    this.views = [];
                    // Fill `aliases` hash table at EW controllers manager
                    _.assign(main_1.EW.managers.controller.aliases, this.init());
                }
            };
            exports_2("Controller", Controller);
        }
    };
});
System.register("bases/View", ["main"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var main_2, View;
    return {
        setters: [
            function (main_2_1) {
                main_2 = main_2_1;
            }
        ],
        execute: function () {
            View = class View {
                constructor(defaultConfig, config) {
                    defaultConfig = this.preprocessConfig(defaultConfig);
                    if (!main_2.EW.managers.view.widgets[defaultConfig.alias]) {
                        main_2.EW.define(defaultConfig.alias, defaultConfig);
                    }
                    this.initiated = new Promise(resolve => {
                        this.initiate = resolve;
                    });
                    this.root = main_2.EW.managers.view.build(defaultConfig.alias, Object.assign(defaultConfig, config), this);
                }
            };
            exports_3("View", View);
        }
    };
});
System.register("managers/Controller", ["lodash", "main"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var _, main_3, ControllerManager;
    return {
        setters: [
            function (_2) {
                _ = _2;
            },
            function (main_3_1) {
                main_3 = main_3_1;
            }
        ],
        execute: function () {
            ControllerManager = class ControllerManager {
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
                                    let element = main_3.EW.getEl(view.config.id + selector);
                                    if (element) {
                                        element.attachEvent(event, handler.bind(element, scope || view, element));
                                    }
                                });
                                break;
                            default:
                        }
                    });
                }
            };
            exports_4("ControllerManager", ControllerManager);
        }
    };
});
System.register("managers/Util", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var UtilManager;
    return {
        setters: [],
        execute: function () {
            UtilManager = class UtilManager {
            };
            exports_5("UtilManager", UtilManager);
        }
    };
});
System.register("managers/View", ["lodash"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var _, ViewManager;
    return {
        setters: [
            function (_3) {
                _ = _3;
            }
        ],
        execute: function () {
            /**
             * Manager for ExtWebix views. It loads EW, processes their default configs and
             * stores them for further building. Also, it sets `id` property for every
             * created widget that should be accessed with `EW.down` of `EW.get` methods.
             * `EW.define` in fact calls `process` and `EW.widget` in fact calls
             * `processWidget`  method that hierarchy process provided config and loads all
             * `sub` configs
             */
            ViewManager = class ViewManager {
                constructor(ctrlMgr) {
                    /**
                     * Counter for `id` generating of new widgets
                     * @type {number}
                     */
                    this.index = 0;
                    /**
                     * Container for widgets' default configs
                     * @type {{}}
                     */
                    this.widgets = {};
                    this.ctrlMgr = ctrlMgr;
                }
                /**
                 * Register new widget definition and store it to `widgets` field
                 *
                 * @param name
                 * @param config
                 */
                process(name, config) {
                    this.widgets[name] = config;
                    this.widgets[config.alias] = config;
                    return config;
                }
                /**
                 * Prepare widget to creation with hierarchy processing provided widget config
                 * @param xtype
                 * @param widgetConfig
                 */
                processWidget(xtype, widgetConfig) {
                    // If provided list of widgets (usually if processed `rows` or same
                    // subfields) then call `processWidget` for every item in list
                    if (Array.isArray(widgetConfig)) {
                        widgetConfig.forEach(widget => {
                            this.processWidget(xtype, widget);
                        });
                        return;
                    }
                    // If config is `xview` then it should contain default config. Load it and
                    // assign provided config
                    if (widgetConfig.xview) {
                        _.assign(widgetConfig, _.assign(_.cloneDeep(this.widgets[widgetConfig.xview]), widgetConfig));
                    }
                    // If widget should be accessed with `EW.down` etc then genate new id to it.
                    // every widget should contain only unique itemId per parent
                    if (widgetConfig.view && widgetConfig.itemId) {
                        widgetConfig.id = xtype + this.index + "#" + widgetConfig.itemId;
                    }
                    // Process fields that could contains sub widget configs
                    if (widgetConfig.cells) {
                        this.processWidget(xtype, widgetConfig.cells);
                    }
                    if (widgetConfig.body) {
                        this.processWidget(xtype, widgetConfig.body);
                    }
                    if (widgetConfig.rows) {
                        this.processWidget(xtype, widgetConfig.rows);
                    }
                    if (widgetConfig.cols) {
                        this.processWidget(xtype, widgetConfig.cols);
                    }
                    if (widgetConfig.head) {
                        this.processWidget(xtype, widgetConfig.head);
                    }
                    if (widgetConfig.elements) {
                        this.processWidget(xtype, widgetConfig.elements);
                    }
                }
                /**
                 * Build widget with processing provded config and returning generated widget
                 * with `webix.ui`. Also it assigns event with controllers manager
                 * @param xtype
                 * @param config
                 * @param scope
                 * @returns {BaseView}
                 */
                build(xtype, config, scope) {
                    this.index += 1;
                    let widgetConfig = _.extend(_.cloneDeep(this.widgets[xtype]), config);
                    widgetConfig.id = xtype + this.index;
                    this.processWidget(xtype, widgetConfig);
                    let widget = webix.ui(widgetConfig);
                    this.ctrlMgr.assignEvents(xtype, widget, scope);
                    if (widget.callEvent) {
                        if (scope && scope.initiated) {
                            scope.initiated.then(scope => {
                                widget.callEvent("init", [widget, scope || widget]);
                            });
                        }
                        else {
                            widget.callEvent("init", [widget, scope || widget]);
                        }
                    }
                    return widget;
                }
            };
            exports_6("ViewManager", ViewManager);
        }
    };
});
System.register("main", ["bases/Controller", "bases/View", "managers/Controller", "managers/Util", "managers/View"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var Controller_1, View_1, Controller_2, Util_1, View_2, ExtWebix, EW;
    return {
        setters: [
            function (Controller_1_1) {
                Controller_1 = Controller_1_1;
            },
            function (View_1_1) {
                View_1 = View_1_1;
            },
            function (Controller_2_1) {
                Controller_2 = Controller_2_1;
            },
            function (Util_1_1) {
                Util_1 = Util_1_1;
            },
            function (View_2_1) {
                View_2 = View_2_1;
            }
        ],
        execute: function () {
            exports_7("Controller", Controller_1.Controller);
            exports_7("View", View_1.View);
            ExtWebix = class ExtWebix {
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
            };
            exports_7("ExtWebix", ExtWebix);
            exports_7("EW", EW = new ExtWebix());
        }
    };
});
/**
 * Created by brainenjii on 28.04.17.
 */
//# sourceMappingURL=ts-ext-webix.js.map