import { findExecutableProcessId, transform, getEntryPoint } from './helper'
import { Element, DefinitionElement, Context} from './interfaces'
import { Process } from './activities'

const debug = require('debug')('bpmn2-engine:engine')

export class Engine {
  // xml 模型数据源
  source: string
  // 解析xml后的模型对象
  definitionElement: DefinitionElement
  // 解析xml后的模型对象的上下文
  context: Context
  // 入口节点
  entryPoint: Element
  // 入口节点对应的执行对象
  process: Process

  constructor({source}) {
    this.source = source
  }

  async startInstance({variables, listener}) {
    debug('start')
    const { definition, context } = await transform(this.source)
    this.definitionElement = definition
    this.context = context
    this.entryPoint = getEntryPoint(this.context);
    debug(`start with ${this.entryPoint.id}`);
    this.process = new Process(this.entryPoint, this.context, listener);
    this.process.run(variables)

    return this.process
  }


}
