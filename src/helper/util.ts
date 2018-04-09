import BpmnModdle from 'bpmn-moddle'
import{ promisify } from 'es6-promisify'

export function delay(delay): Promise<any> {
  return new Promise(function(resolve) {
      setTimeout(resolve, delay)
  })
}

export function transform(sourceXml: string): Promise<any> {
  const moddle = new BpmnModdle()
  if (typeof sourceXml !== 'string') {
    throw new Error('Nothing to transform')
  }

  let fromXML = moddle.fromXML.bind(moddle)
  fromXML[promisify.argumentNames] = ['definition', 'context']

  fromXML = promisify(fromXML)
  return fromXML(sourceXml)
};
