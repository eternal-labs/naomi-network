/**
 * Base Plugin class for extending agent capabilities
 */

import { Agent } from '../agent/Agent';
import { Plugin } from '../types';

export abstract class BasePlugin implements Plugin {
  abstract name: string;
  abstract version: string;

  async initialize(agent: Agent): Promise<void> {
    // Override in subclasses
  }

  abstract execute(agent: Agent, input: any): Promise<any>;

  async cleanup(): Promise<void> {
    // Override in subclasses if needed
  }
}

