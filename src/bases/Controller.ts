import * as _ from "lodash";
import {EW} from "../main";
import {ControllerInitiator} from "../types/Types";

/**
 * Basic class for all controllers. At construction time it invokes overridden
 * `init` method. Also, it contains links to related views mostly to include
 * them to compile
 */
export abstract class Controller {
  protected views: any[] = [];

  public abstract init (): ControllerInitiator ;

  constructor () {

    // Fill `aliases` hash table at EW controllers manager
    _.assign( EW.managers.controller.aliases, this.init() );

  }
}
