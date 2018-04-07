// import * as uuid from 'uuid'
import { EventEmitter } from 'events'

export class Activity extends EventEmitter {
  id: string
  name: string
  // 当前对应的xml节点对象
  element: any

  constructor(element, parent?) {
    super()
    this.id = element.id
    this.name = element.name
    this.element = element
  }
}
