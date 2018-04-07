import { BPMN_ACTIVITI_TYPES } from '../enums'
import * as ActivityMap from '../activities'

export function findExecutableProcessId(context) {
  return Object.keys(context.elementsById).find(key => {
    return context.elementsById[key].isExecutable
  })
}

export function element2Activity(element) {
  const Activity = Object.values(ActivityMap).find(obj => {
    let key = obj.constructor.name.toUpperCase()
    return element.$type === BPMN_ACTIVITI_TYPES[key]
  })

  return Activity
}

export function getSequenceFlows(context) {
  return context.references.filter((r) => r.property === 'bpmn:sourceRef');
};

export function getSequenceFlows2(context) {
  return context.references.filter((r) => r.property === 'bpmn:targetRef');
};

export function getOutboundSequenceFlows(context, elementId) {
  return context.references.filter((r) => r.property === 'bpmn:sourceRef' && r.id === elementId);
};

export function getInboundSequenceFlows(context, elementId) {
  return context.references.filter((r) => r.property === 'bpmn:targetRef' && r.id === elementId);
};

export function getSequenceFlowTarget(context, elementId) {
  return context.references.find((r) => r.property === 'bpmn:targetRef' && r.element.id === elementId);
};

export function isDefaultSequenceFlow(context, elementId) {
  return context.references.some((r) => r.property === 'bpmn:default' && r.id === elementId);
};

export function getStartEvents(element) {
  return element.flowElements.filter((e) => e.$type === 'bpmn:StartEvent');
};

