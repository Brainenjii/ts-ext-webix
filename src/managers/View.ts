import * as _ from "lodash";
import {View} from "../bases/View";
import {BaseView, WidgetConfig} from "../types/Types";
import {ControllerManager} from "./Controller";

/**
 * Manager for ExtWebix views. It loads EW, processes their default configs and
 * stores them for further building. Also, it sets `id` property for every
 * created widget that should be accessed with `EW.down` of `EW.get` methods.
 * `EW.define` in fact calls `process` and `EW.widget` in fact calls
 * `processWidget`  method that hierarchy process provided config and loads all
 * `sub` configs
 */
export class ViewManager {

  /**
   * Counter for `id` generating of new widgets
   * @type {number}
   */
  private index: number = 0;

  /**
   * Controller manager
   */
  private ctrlMgr: ControllerManager;

  /**
   * Container for widgets' default configs
   * @type {{}}
   */
  public widgets: {[index: string]: WidgetConfig} = {};

  /**
   * Register new widget definition and store it to `widgets` field
   *
   * @param name
   * @param config
   */
  public process ( name: string, config: WidgetConfig ) {

    this.widgets[name] = config;
    this.widgets[config.alias] = config;

    return config;

  }

  /**
   * Prepare widget to creation with hierarchy processing provided widget config
   * @param xtype
   * @param widgetConfig
   */
  private processWidget ( xtype: string,
                          widgetConfig: WidgetConfig | WidgetConfig[] ) {

    // If provided list of widgets (usually if processed `rows` or same
    // subfields) then call `processWidget` for every item in list
    if ( Array.isArray( widgetConfig ) ) {

      widgetConfig.forEach( widget => {

        this.processWidget( xtype, widget );

      } );
      return;

    }

    // If config is `xview` then it should contain default config. Load it and
    // assign provided config
    if ( widgetConfig.xview ) {

      _.assign( widgetConfig, _.assign( _.cloneDeep(
        this.widgets[widgetConfig.xview]
      ), widgetConfig ) );

    }

    // If widget should be accessed with `EW.down` etc then genate new id to it.
    // every widget should contain only unique itemId per parent
    if (widgetConfig.view && widgetConfig.itemId) {

      widgetConfig.id = xtype + this.index + "#" + widgetConfig.itemId;

    }

    // Process fields that could contains sub widget configs
    if ( widgetConfig.cells ) {

      this.processWidget( xtype, widgetConfig.cells );

    }
    if ( widgetConfig.body ) {

      this.processWidget( xtype, <any> widgetConfig.body );

    }
    if ( widgetConfig.rows ) {

      this.processWidget( xtype, widgetConfig.rows );

    }
    if ( widgetConfig.cols ) {

      this.processWidget( xtype, widgetConfig.cols );

    }
    if ( widgetConfig.head ) {

      this.processWidget( xtype, widgetConfig.head );

    }
    if ( widgetConfig.elements ) {

      this.processWidget( xtype, widgetConfig.elements );

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
  public build ( xtype: string, config?: WidgetConfig,
                 scope?: View ): webix.ui.baseview {

    this.index += 1;

    let widgetConfig = _.extend( _.cloneDeep( this.widgets[xtype] ), config );

    widgetConfig.id = xtype + this.index;

    this.processWidget( xtype, widgetConfig );

    let widget = <BaseView> webix.ui(widgetConfig);

    this.ctrlMgr.assignEvents( xtype, widget, scope );

    if ( widget.callEvent ) {

      if ( scope && scope.initiated ) {

        scope.initiated.then( scope => {

          widget.callEvent( "init", [widget, scope || widget] );

        } );

      } else {

        widget.callEvent( "init", [widget, scope || widget] );

      }

    }
    return widget;

  }

  constructor ( ctrlMgr: ControllerManager ) {

    this.ctrlMgr = ctrlMgr;

  }

}
