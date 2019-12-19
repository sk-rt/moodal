/**
 * Moodal
 * https://github.com/sk-rt/moodal
 * Copyright (c) 2019  Ryuta Sakai
 * Licensed under the MIT license.
 */

import { MoodalInitialParam } from './constants';
import MoodalCore from './core';
import MoodalController, { MoodalControllerParam } from './controllers';

export default class Moodal {
    moodalCore: MoodalCore;
    initialParam: MoodalInitialParam;
    container: HTMLElement;
    constructor(container: HTMLElement, param?: Partial<MoodalInitialParam>) {
        this.moodalCore = new MoodalCore(container, param);
        this.initialParam = this.moodalCore.param;
        this.container = container;
    }
    addController(param: MoodalControllerParam) {
        return new MoodalController(this.moodalCore, param);
    }
}
export { default as MoodalCore } from './core';
export { default as MoodalController } from './controllers';
export {
    MoodalInitialParam,
    MoodalCreateParam,
    MoodalState
} from './constants';
