
/**@fileOverview
 * 起始节点:
 *   - 有一个父节点
 *   - 只有输出流
*/

import { Activity } from './Activity'
const debug = require('debug')('bpmn2-engine:activity:startEvent');

export class StartEvent extends Activity {
  parent: any
  outbound = []
  isStartEvent: boolean = true

  constructor(element, parent) {
    super(element)
    debug('init', element.id);
    this.parent = parent
    this.outbound = parent.getOutboundSequenceFlows(element.id)
  }

  run(variables) {
    debug('run', this.element.id);
    this.emit('start', this);
    this.emit('end', this);
    this.takeAll(this.outbound, variables);
  }

  private takeAll(outbound, variables) {
    debug(`take all ${this.element.id} ${outbound.length} sequence flows`);
    outbound.forEach(flow => {
      flow.take(variables)
    });
  }
}
