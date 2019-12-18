/**
 * Layrs
 * https://github.com/sk-rt/layrs
 * Copyright (c) 2019  Ryuta Sakai
 * Licensed under the MIT license.
 */

import { LayrsInitialParam } from './constants';
import LayrsCore from './core';
import LayrsController, { LayrsControllerParam } from './controllers';

export default class Layrs {
    layrsCore: LayrsCore;
    initialParam: LayrsInitialParam;
    container: HTMLElement;
    constructor(container: HTMLElement, param?: Partial<LayrsInitialParam>) {
        this.layrsCore = new LayrsCore(container, param);
        this.initialParam = this.layrsCore.param;
        this.container = container;
    }
    addController(param: LayrsControllerParam) {
        return new LayrsController(this.layrsCore, param);
    }
}
export { default as LayrsCore } from './core';
export { default as LayrsController } from './controllers';
// export { anchorController } from './controllers/anchor';
export { LayrsInitialParam, LayrsCreateParam, LayrsState } from './constants';
