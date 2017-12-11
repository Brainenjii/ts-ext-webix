/**
 * Basic class for all controllers. At construction time it invokes overridden
 * `init` method. Also, it contains links to related views mostly to include
 * them to compile
 */
import {EW} from "../main";

export abstract class View {

  public initiated: Promise<any>;
  protected initiate: (value?: any | PromiseLike<any>) => void;
  private alias: string;
  public root: webix.ui.baseview;

  protected abstract preprocessConfig ( config: any ): any;

  constructor ( defaultConfig: any, config?: any ) {

    defaultConfig = this.preprocessConfig( defaultConfig );

    if ( !EW.managers.view.widgets[defaultConfig.alias] ) {

      EW.define( defaultConfig.alias, defaultConfig );

    }

    this.initiated = new Promise( resolve => {

      this.initiate = resolve;

    } );
    this.root = EW.managers.view.build( defaultConfig.alias,
      Object.assign( defaultConfig, config ), this );

  }

}
