
/**@fileOverview
 * 在有向弧上可以定义条件判断
 * 满足条件: 执行take, 被采用
 * 不满足: 执行discard, 被废弃
 */

import { Activity } from './Activity'
import * as vm from 'vm'

const debug = require('debug')('bpmn2-engine:activity:sequenceFlow');

export class SequenceFlow extends Activity {
  // 流的目标节点
  target: any
  // 是否是默认路径
  isDefault: boolean = false

  isTaken: boolean = false

  constructor(element, parent) {
    super(element)
    this.target = parent.getSequenceFlowTarget(element.id);
    this.isDefault = parent.isDefaultSequenceFlow(element.id);
    this.isTaken = false;
  }

  take(variables) {
    debug('take', this.element.id);
    if (this.element.conditionExpression) {
      this.isTaken = this.executeCondition(variables);
    } else {
      debug(`unconditional flow ${this.element.id} taken`);
      this.isTaken = true;
    }

    if (this.isTaken) {
      this.emit('taken', this);
    } else {
      this.discard();
    }

    return this.isTaken;
  }

  discard() {
    debug('discard', this.element.id);
    this.emit('discarded', this);
  }

  executeCondition(variables): boolean {
    const script = new vm.Script(this.element.conditionExpression.body);
    const context = vm.createContext(variables);
    const result = script.runInContext(context);
    debug(`condition result ${this.element.id} evaluated to ${result}`);
    return result;
  }
}
