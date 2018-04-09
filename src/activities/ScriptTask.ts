/**
 * @fileOverview
 * 脚本任务
 */

import { Activity } from './Activity'
import * as vm from 'vm'
const debug = require('debug')('bpmn2-engine:activity:scriptTask');

export class ScriptTask extends Activity {
  inbound = []
  outbound = []

  script: vm.Script
  output: object

  constructor(element, parent) {
    super(element)
    debug('init', element.id);
    this.inbound = parent.getInboundSequenceFlows(element.id);
    this.outbound = parent.getOutboundSequenceFlows(element.id);
    debug('getScript:' + this.element.script)
    this.script = new vm.Script(this.element.script, {
      filename: `${this.element.id}.script`,
      displayErrors: true
    });
  }

  run(variables) {
    debug('run', this.element.id);
    this.emit('start', this);
    this.executeScript(variables)
  }

  private executeScript(variables) {
    const context = vm.createContext({
      context: variables,
      next: (err, data) => {
        if (err) {
          this.emit('error', err)
          return
        }

        this.output = data
        this.emit('end', this)
        this.takeAll(variables)
      }
    });

    const result = this.script.runInContext(context);
    debug(`condition result ${this.element.id} evaluated to ${result}`);
    return result;
  }

  private takeAll(variables) {
    debug(`take all ${this.element.id} ${this.outbound.length} sequence flows`);
    this.outbound.forEach(outboundSequenceFlow => {
      outboundSequenceFlow.take(variables)
    })
  }
}
