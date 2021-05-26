/**
 * Moodal
 * https://github.com/sk-rt/moodal
 * Copyright (c) 2019  Ryuta Sakai
 * Licensed under the MIT license.
 */
import { version, MoodalInitialParam } from './constants';
import MoodalCore from './core';
import MoodalController, { MoodalControllerParam } from './controllers';
import { LogLevel } from './modules/Logger';

export default class Moodal {
  moodalCore: MoodalCore;
  initialParam: MoodalInitialParam;
  isValid: boolean = false;
  constructor(
    wrapper: string | HTMLElement,
    param?: Partial<MoodalInitialParam>
  ) {
    this.moodalCore = new MoodalCore(wrapper, param);
    this.isValid = this.moodalCore.isValid;
    if (!this.isValid) {
      this.moodalCore.logger.log(
        LogLevel.error,
        `[Moodal@${version}] Invalid Params`,
        { wrapper: wrapper, param: param }
      );
      return;
    }
    this.initialParam = this.moodalCore.param;
  }
  addController(param: MoodalControllerParam) {
    if (!this.isValid) {
      this.moodalCore.logger.log(
        LogLevel.error,
        `[Moodal@${version}] Invalid Params`
      );
      return;
    }
    return new MoodalController(this.moodalCore, param);
  }
}
export { default as MoodalCore } from './core';
export { default as MoodalController } from './controllers';
export {
  MoodalInitialParam,
  MoodalCreateParam,
  MoodalState,
} from './constants';
export { LogLevel };
