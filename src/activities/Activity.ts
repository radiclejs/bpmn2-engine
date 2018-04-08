// import * as uuid from 'uuid'
import { EventEmitter } from 'events'
// import { Element, SequenceFlowElement } from '../interfaces'

export class Activity extends EventEmitter {
  id: string
  name: string
  // 当前对应的xml节点对象
  element: any

  constructor(element) {
    super()
    this.id = element.id
    this.name = element.name
    this.element = element
  }
}
