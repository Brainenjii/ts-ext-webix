import {Controller} from "./bases/Controller";
import {View} from "./bases/View";
import {ControllerManager} from "./managers/Controller";
import {UtilManager} from "./managers/Util";
import {ViewManager} from "./managers/View";
import {ApplicationConfig, BaseView, WidgetConfig} from "./types/Types";

interface Managers {
  view: ViewManager;
  util: UtilManager;
  controller: ControllerManager;
}

export class ExtWebix {
  public appConfig: ApplicationConfig;
  private window: any;
  public project: string;

  public managers: Managers;

  public widget ( xtype: string, config?: WidgetConfig,
                  scope?: View ): webix.ui.baseview {

    return this.managers.view.build( xtype, config, scope );

  }

  public define ( name: string, config: any ) {

    return this.managers.view.process( name, config );

  }

  // noinspection JSMethodCanBeStatic
  public getEl ( selector: string ): BaseView {

    return <BaseView> $$( selector );

  }

  public find ( widget: webix.ui.baseview,
                selector: string ): webix.ui.baseview {

    return <webix.ui.baseview> $$(widget.getTopParentView().config.id +
      selector);

  }

  public application ( applicationConfig: ApplicationConfig ) {

    this.appConfig = applicationConfig;

    this.window[applicationConfig.name] = {};
    this.project = this.window[applicationConfig.name];

    webix.ready( () => {

      let viewport: webix.ui.baseview;

      if ( this.appConfig.autoViewport ) {

        viewport = this.widget( this.appConfig.autoViewport );

      }

      if ( this.appConfig.launch ) {

        this.appConfig.launch( viewport );

      }

    } );

  }

  constructor () {

    let controllerManager = new ControllerManager();

    this.window = window;

    this.managers = {
      view: new ViewManager( controllerManager ),
      util: new UtilManager(),
      controller: controllerManager
    };

  }

}
export let EW = new ExtWebix();
export {Controller, View};
