/**
 * @fileOverview
 * 并行网关:
 *   - 有输入和输出流
 *   - 所有的输出流都会被执行(忽略路径上的条件)
 *   - 可以同时具有切分和汇聚行为
 */


import { Activity } from './Activity'
const debug = require('debug')('bpmn2-engine:activity:parallelGateway');

export class ParallelGateway extends Activity {
  inbound = []
  outbound = []
  // 是否具有归并行为
  isJoin: boolean
  // 是否在等待归并
  isPendingJoin: boolean
  // 是否具有切分行为
  isSplit: boolean

  constructor(element, parent) {
    super(element)
    this.inbound = parent.getInboundSequenceFlows(element.id);
    this.outbound = parent.getOutboundSequenceFlows(element.id)
    this.isJoin = this.inbound.length > 1;
    this.isPendingJoin = !this.isJoin;
    this.isSplit = this.outbound.length > 1;
    debug('init', element.id, this.isJoin ? 'joining' : '');
  }

  run(variables) {
    debug('run', this.element.id);
    if (this.isJoin) return this.runJoin(variables);

    this.emit('start', this);
    this.complete(variables);
  }

  runJoin(variables) {
    if (!this.isPendingJoin) {
      this.emit('start', this);
      this.isPendingJoin = true;
      return this.setUpInbound(variables)
    }
  }

  complete(variables) {
    this.isPendingJoin = false;
    this.emit('end', this);
    this.takeAll(variables);
  }

  private setUpInbound(variables) {
    const pending = this.inbound.filter((flow) => !flow.isTaken);
    let pendingLength = pending.length;

    pending.forEach((flow) => {
      flow.once('taken', () => {
        pendingLength--;
        if (pendingLength === 0) {
          this.complete(variables);
        }
      });
      flow.once('discarded', () => {
        pendingLength--;
        if (pendingLength === 0) {
          this.complete(variables);
        }
      });
    });
  }

  private takeAll(variables) {
    let outbound = this.outbound
    debug(`take all ${this.element.id} ${outbound.length} sequence flows`);
    outbound.forEach((flow) => flow.take(variables));
  }
}
