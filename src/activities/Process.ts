import * as Helper from '../helper'
import { Activity } from './Activity'
import * as DEBUG from 'debug'

const debug = DEBUG('bpmn2-engine:activity:process')

export class Process extends Activity {

  constructor(element, context, listener?) {
    super(element)

    this.element = element
    this.context = context

    this.listener = listener
    this.init()
  }

  id: string
  name: string
  // 解析出的xml对象的上下文
  context: any
  listener: any
  children: object = {}
  paths: object = {}
  sequenceFlows = []
  activeArtifacts: number = 0
  stopInitialized: boolean = false
  eleStartEvents = []
  variables: object = {}
  isEnded: boolean = false

  private init() {
    this.eleStartEvents = Helper.getStartEvents(this.element)

    this.sequenceFlows = Helper.getSequenceFlows(this.context).map(obj => {
      let ActivityClass = Helper.element2Activity(obj.element)
      return new ActivityClass(obj.element, this)
    })
  }

  run(variables) {
    this.emit('start', this);
    if (!this.eleStartEvents.length) {
      debug('error: no startEvent found')
      return this.emit('end', this);
    }
    this.variables = Object.assign({}, variables);
    const startActivity = this.getChildActivityById(this.eleStartEvents[0].id);
    this.execute(startActivity)
  }

  signal(id, input) {
    const childActivity = this.getChildActivityById(id);
    childActivity.signal(input);
  }

  take(target) {
    this.execute(target);
  }

  execute(childActivity) {
    debug('execute', childActivity.id);
    if (childActivity.outbound) {
      // Listen for outbound flows
      childActivity.outbound.forEach((sequenceFlow) => {
        sequenceFlow._parentTakenListener = function (flow) {
          this.activeArtifacts--;

          flow.removeListener('discarded', sequenceFlow._parentDiscardedListener);
          const child = this.getChildActivityById(flow.target.id);

          this.paths[flow.element.element.id] = flow;

          this.execute(child);
        };
        sequenceFlow._parentDiscardedListener = function (flow) {
          this.activeArtifacts--;
          flow.removeListener('taken', sequenceFlow._parentTakenListener);
        };

        this.activeArtifacts++;
        sequenceFlow.once('taken', sequenceFlow._parentTakenListener);
        sequenceFlow.once('discarded', sequenceFlow._parentDiscardedListener);
      });
    }

    childActivity.once('start', (activity) => {
      this.emit('start', activity)
    });

    childActivity.once('end', () => {
      this.activeArtifacts--;
      debug('completed', childActivity.element.id, 'activeArtifacts', this.activeArtifacts);

      if (childActivity.isEndEvent) {
        setImmediate(this.stop.bind(this));
      }
    });

    childActivity.once('error', (e) => {
      this.emit('error', e);
    });

    this.activeArtifacts++;
    childActivity.run(this.variables);
  }

  stop() {
    if (this.stopInitialized) return;
    debug('stop', this.element.id, `active artifacts: ${this.activeArtifacts}`);
    if (this.activeArtifacts !== 0) return;

    this.stopInitialized = true;

    Object.keys(this.children).forEach((id) => {
      const child = this.children[id];
      if (child.endListener) {
        child.removeListener('end', child.endListener);
      }
    });

    this.isEnded = true;
    this.emit('end', this);
  }

  getChildActivityById(id) {
    if (this.children[id]) return this.children[id];

    const obj = this.context.elementsById[id];
    const ActivityClass = Helper.element2Activity(obj.element)
    const child = new ActivityClass(obj.element, this);

    this.children[id] = child;

    return child;
  }

  // ?
  getOutboundSequenceFlows(id) {
    return this.sequenceFlows.filter((sf) => sf.activity.id === id);
  }

  //?
  getInboundSequenceFlows(id) {
    return this.sequenceFlows.filter((sf) => sf.target.id === id);
  }

  isDefaultSequenceFlow(id) {
    return Helper.isDefaultSequenceFlow(this.context, id);
  }

  getSequenceFlowTarget(id) {
    return Helper.getSequenceFlowTarget(this.context, id);
  }
}
