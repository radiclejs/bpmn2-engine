/**
 * @fileOverview
 * 结束节点:
 *   - 只有输入流
 *   - 没有take方法
 */

import { Activity } from './Activity'
const debug = require('debug')('bpmn2-engine:activity:endEvent');

export class EndEvent extends Activity {
  inbound = []
  isEndEvent: boolean = true
  isTaken: boolean = false

  constructor(element, parent) {
    super(element)
    debug('init', element.id);
    this.inbound = parent.getInboundSequenceFlows(element.id);
  }

  run() {
    debug('run', this.element.id);
    this.isTaken = true;
    this.emit('end', this);
  }
}
