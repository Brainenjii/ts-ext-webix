import * as _ from "lodash";
import {View} from "../bases/View";
import {EW} from "../main";
import {BaseView, ControllerInitiator} from "../types/Types";

export class ControllerManager {
  /**
   * Store for controller rules for event assignment
   * @type {{}}
   */
  public aliases: {
    [index: string]: ControllerInitiator
  } = {};

  /**
   * Assign events for provided view. Currently, it supports only widgets with
   * base xview alias and `#itemId` referencing to concrete child with provided
   * itemId
   *
   * @param alias
   * @param view
   * @param scope
   */
  public assignEvents ( alias: string, view: BaseView, scope?: View ): void {

    let selectorsConfig = this.aliases[alias];

    if ( !selectorsConfig ) {

      return;

    }

    _.each( selectorsConfig, ( eventsConfig: webix.WebixCallback,
        selector: string ) => {

      switch ( typeof eventsConfig ) {
      case "function":
        if ( view.attachEvent ) {

          view.attachEvent( selector,
            eventsConfig.bind( view, scope || view ) );

        }
        break;
      case "object":
        _.each( eventsConfig, ( handler, event ) => {

          let element = EW.getEl( view.config.id + selector );

          if ( element ) {

            element.attachEvent( event, handler.bind( element, scope || view,
              element ) );

          }

        } );
        break;
      default:
      }

    } );

  }

}
