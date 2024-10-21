import {
  Injectable,
  OnModuleInit,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { ModulesContainer, Reflector } from '@nestjs/core';
import { GUARD_TAG } from '@august-tv/server/utils';

@Injectable()
export class GuardCheckService implements OnModuleInit {
  private readonly logger = new Logger(GuardCheckService.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly modulesContainer: ModulesContainer,
  ) {}

  onModuleInit() {
    this.checkGuardsOnRoutes();
  }

  checkGuardsOnRoutes() {
    const missingAuthTag: string[] = [];
    // Get all loaded modules
    const modules = [...this.modulesContainer.values()];

    // Iterate through each module
    for (const module of modules) {
      // Get all controllers within the module
      const controllers = [...module.controllers.values()];

      for (const controller of controllers) {
        const instance = controller.instance;
        const prototype = Object.getPrototypeOf(instance);

        // Get all the methods in the controller
        const methods = Object.getOwnPropertyNames(prototype).filter(
          (method) =>
            typeof prototype[method] === 'function' && method !== 'constructor',
        );

        for (const method of methods) {
          const handler = prototype[method];

          // Check if the @Guard() decorator is present on the method
          const hasGuard = this.reflector.get(GUARD_TAG, handler);

          if (!hasGuard) {
            missingAuthTag.push(`${controller.metatype.name}.${method}`);
          }
        }
      }
    }

    if (missingAuthTag.length) {
      throw new ForbiddenException(
        `⛔️ The following route handlers are missing authorization settings: ${missingAuthTag.join(
          ', ',
        )}`,
      );
    }

    this.logger.log('✅ All route handlers are properly guarded.');
  }
}
