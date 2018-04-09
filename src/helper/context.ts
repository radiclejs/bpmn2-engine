import { BPMN_ACTIVITI_TYPES, ACTIVITI_TYPES } from '../enums'
import { Element, ProcessElement, Context, Reference } from '../interfaces'
import * as ActivityMap from '../activities'
// import * as _ from 'lodash'

export function findExecutableProcessId(context) {
  return Object.keys(context.elementsById).find(key => {
    return context.elementsById[key].isExecutable
  })
}

export function element2Activity(element) {
  if (!element.$type) {
    throw new Error('element.$type is missing')
  }

  const Activity = Object.values(ActivityMap).find(obj => {
    return BPMN_ACTIVITI_TYPES[element.$type] === ACTIVITI_TYPES[obj.name]
  })

  if (!Activity) {
    throw new Error(`can not find class mapping for ${element.$type}`)
  }

  return Activity
}

export function getEntryPoint(context: Context): Element {
  return context.elementsById[findExecutableProcessId(context)]
}

export function getAllOutboundSequenceFlows(context: Context): Reference[] {
  return context.references.filter((r) => r.element.$type === 'bpmn:SequenceFlow' && r.property === 'bpmn:sourceRef');
};

export function getOutboundSequenceFlows(context: Context, elementId: string): Reference[] {
  return context.references.filter((r) => r.property === 'bpmn:sourceRef' && r.id === elementId);
};

export function getInboundSequenceFlows(context: Context, elementId: string): Reference[] {
  return context.references.filter((r) => r.property === 'bpmn:targetRef' && r.id === elementId);
};

export function getSequenceFlowTarget(context: Context, sequenceFlowId: string): Reference {
  return context.references.find((r) => r.property === 'bpmn:targetRef' && r.element.id === sequenceFlowId);
};

export function isDefaultSequenceFlow(context: Context, sequenceFlowId: string): boolean {
  return context.references.some((r) => r.property === 'bpmn:default' && r.id === sequenceFlowId);
};

export function getStartEvents(element: ProcessElement): Element[] {
  return element.flowElements.filter((e) => e.$type === 'bpmn:StartEvent');
};

export function getChildOutputNames(context, taskId) {
  const contextElement = context.elementsById[taskId];
  if (!contextElement.dataOutputAssociations) return [];

  return contextElement.dataOutputAssociations.map((association) => {
    return getDataObjectFromAssociation(context, association.id);
  });
};

export function getDataObjectFromAssociation(context, associationId) {
  const association = context.references.find((r) => r.element.$type === 'bpmn:DataOutputAssociation' && r.element.id === associationId && r.property === 'bpmn:targetRef');
  if (!association) return null;

  const potentialRef = context.elementsById[association.id];
  if (potentialRef.$type === 'bpmn:DataObject') return potentialRef;

  return getDataObjectFromRef(context, potentialRef.id);
};

export function getDataObjectFromRef(context, refId) {
  const ref = context.references.find((r) => r.element.$type === 'bpmn:DataObjectReference' && r.element.id === refId && r.property === 'bpmn:dataObjectRef');
  if (!ref) return null;

  return context.elementsById[ref.id];
};

