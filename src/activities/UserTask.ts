/**
 * @fileOverview
 * 用户任务:
 *   - 有输入和输出流
 *   - run后是等待状态, 需要收到信号才能继续运行下去
 */

import { Activity } from './Activity'
const debug = require('debug')('bpmn2-engine:activity:userTask');

export class UserTask extends Activity {
  inbound = []
  outbound = []

  constructor(element, parent) {
    super(element)
    debug('init', element.id);
    this.inbound = parent.getInboundSequenceFlows(element.id);
    this.outbound = parent.getOutboundSequenceFlows(element.id)
  }

  run() {
    debug('run', this.element.id);
    this.emit('start', this);
  }

  signal(variables) {
    this.emit('end', this);
    this.takeAll(variables);
  }

  private takeAll(variables) {
    debug(`take all ${this.element.id} ${this.outbound.length} sequence flows`);
    this.outbound.forEach(outboundSequenceFlow => {
      outboundSequenceFlow.take(variables)
    })
  }
}
