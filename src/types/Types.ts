
import {Controller} from "../bases/Controller";

export interface ApplicationConfig {
  name: string;
  requires: string[];
  controllers: Controller[];
  autoViewport?: string;
  launch?: (viewport: webix.ui.baseview) => void;
  skipLoading: boolean;
}

export interface WidgetConfig extends webix.ui.baseviewConfig {
  alias?: string;
  data?: any;
  itemId?: string;
  xview?: string;
  view?: string;
  cells?: any;
  body?: string|webix.ui.baseview;
  rows?: any[];
  cols?: any[];
  head?: any;
  elements?: any[];
}

export interface BaseView extends webix.ui.baseview {
  attachEvent(type: string, functor: webix.WebixCallback,
              id?: string): string|number;
  callEvent( name: string, params: any[]): boolean;
}

export interface ControllerInitiator {
  [index: string]: {
  };
}
