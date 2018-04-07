import { findExecutableProcessId, transform } from './helper'
import { Process } from './activities'

const debug = require('debug')('bpmn2-engine:engine')

export class Engine {
  // xml 模型数据源
  source: string
  // 解析xml后的模型对象
  definition: any
  // 解析xml后的模型对象的上下文
  context: any
  // 入口节点id
  entryPointId: string
  // 入口节点
  entryPoint: any
  // 入口节点对应的执行对象
  process: Process

  constructor({source}) {
    this.source = source
  }

  async startInstance({variables, listener}) {
    debug('start')
    const { definition, context } = await transform(this.source)
    this.definition = definition
    this.context = context
    this.entryPointId = findExecutableProcessId(this.context)
    debug(`start with ${this.entryPointId}`);
    this.entryPoint = this.context.elementsById[this.entryPointId];
    this.process = new Process(this.entryPoint, this.context, listener);
    this.process.run(variables)

    return this.process
  }


}
