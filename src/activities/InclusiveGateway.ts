/**
 * @fileOverview
 * 包含网关:
 *   - 有输入和输出流
 *   - 满足条件的输出流会被执行
 */


import { Activity } from './Activity'
const debug = require('debug')('bpmn2-engine:activity:inclusiveGateway');

export class InclusiveGateway extends Activity {
  inbound = []
  outbound = []

  constructor(element, parent) {
    super(element)
    debug('init', element.id);
    this.inbound = parent.getInboundSequenceFlows(element.id);
    this.outbound = parent.getOutboundSequenceFlows(element.id)
  }

  run(variables) {
    debug('run', this.element.id);
    this.emit('start', this);
    this.emit('end', this);

    this.takeAll(variables);
  }

  private takeAll(variables) {
    let outbound = this.outbound
    debug(`take all ${this.element.id} ${outbound.length} sequence flows`);
    let taken = false;

    const defaultFlow = outbound.find((flow) => flow.isDefault);
    const conditionalFlows = outbound.filter((flow) => !flow.isDefault);

    // 满足条件的路径全部可以走
    // 没有满足条件的走默认路径
    // 啥都没有报错
    for (let i = 0; i < conditionalFlows.length; i++) {
      const sequenceFlow = conditionalFlows[i];
      if (sequenceFlow.take(variables)) {
        taken = true;
      }
    }

    if (!taken && defaultFlow) {
      debug(`take ${this.element.id} default sequence flow ${defaultFlow.element.id}`);
      defaultFlow.take();
    } else if (defaultFlow) {
      defaultFlow.discard();
    } else if (!taken) {
      this.emit('error', new Error(`No conditional flow was taken ${this.element.id}`));
    }
  }
}
