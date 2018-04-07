export enum ACTIVITI_TYPES {
  PROCESS = 'Process',
  START_EVENT = 'StartEvent',
  END_EVENT = 'EndEvent',
  SEQUENCE_FLOW = 'SequenceFlow',
  EXCLUSIVE_GAGEWAY = 'ExclusiveGateway',
  INCLUSIVE_GATEWAY = 'InclusiveGateway',
  PARALLER_GAETWAY = 'ParallelGateway',
  USER_TASK = 'UserTask'
}

export enum BPMN_ACTIVITI_TYPES {
  PROCESS = 'bpmn:Process',
  START_EVENT = 'bpmn:StartEvent',
  END_EVENT = 'bpmn:EndEvent',
  SEQUENCE_FLOW = 'bpmn:SequenceFlow',
  EXCLUSIVE_GAGEWAY = 'bpmn:ExclusiveGateway',
  INCLUSIVE_GATEWAY = 'bpmn:InclusiveGateway',
  PARALLER_GAETWAY = 'bpmn:ParallelGateway',
  USER_TASK = 'bpmn:UserTask'
}
