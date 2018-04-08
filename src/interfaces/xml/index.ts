export interface Element {
  id: string
  name: string
  $type: string
}

export interface ProcessElement extends Element {
  isExecutable: boolean
  flowElements: Element[]
}

export interface SequenceFlowElement extends Element {
  conditionExpression: string
}

export interface DefinitionElement extends Element {
  rootElements: Element[]
}


export interface Reference {
  id: string,
  property: string,
  element: Element
}

export interface Context {
  addElement: Function
  addReference: Function
  elementsById: object
  references: Reference[]
  rootHandler: object
}
