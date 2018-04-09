import { Engine } from '../src'
import * as request from 'request-promise-native'

const debug = require('debug')('bpmn2-engine:demo');

async function loadXML(name) {
  let res = await request.get(`http://127.0.0.1:7001/public/${name}.bpmn`);
  // console.log(xml.data)
  // let viewer = new BpmnJS()
  // viewer.importXML(xml.data)
  // viewer.attachTo('#demo')

  return res;
}

async function runSample() {
  const bpmnSchema = await loadXML('sample');;

  const engine = new Engine({
    source: bpmnSchema
  });

  engine.startInstance({
    variables: {
      name: 'demo'
    },
    listener: null
  }).then(execution => {
    console.log('Process instance started with id', execution.variables)
  });
}

async function runWithExclusiveGateway() {
  const bpmnSchema = await loadXML('exclusive_gateway');

  const engine = new Engine({
    source: bpmnSchema
  });

  engine.startInstance({
    variables: {
      days: '8'
    },
    listener: null
  }).then(execution => {
    console.log('Process instance started with id', execution.variables)
    console.log('倒计时开始: 5s...')
    setTimeout(() => {
      execution.signal('Task_0ux91rm', {
        newInput: {
          name: 'tom'
        }
      })
    }, 5000)
  });
}

async function runWithUserTask() {
  const bpmnSchema = await loadXML('user_task');

  const engine = new Engine({
    source: bpmnSchema
  });

  engine.startInstance({
    variables: {
      name: 'demo'
    },
    listener: null
  }).then(execution => {
    console.log('Process instance started with id', execution.variables)
    console.log('倒计时开始: 5s...')
    setTimeout(() => {
      execution.signal('Task_1el0q7x', {
        newInput: {
          name: 'tom'
        }
      })
    }, 5000)
  });
}

// 暂时只支持node环境
async function runWithScriptTask() {
  const bpmnSchema = await loadXML('script_task');

  const engine = new Engine({
    source: bpmnSchema
  });

  engine.startInstance({
    variables: {
      name: 'tom',
      setTimeout
    },
    listener: null
  }).then(execution => {
    debug('Process instance started with id', execution.variables)
    debug('等待接口返回...')
    execution.on('completed', activity => {
      if (activity.constructor.name === 'ScriptTask') {
        debug('task end with:', activity.output)
      }
    })
  });
}

var __GLOBAL__

if (typeof window !== 'undefined') {
  __GLOBAL__ = window
  window.localStorage.setItem('debug', '*')
} else {
  __GLOBAL__ = global
}

Object.assign(__GLOBAL__, {
  processDemos: {
    runSample,
    runWithExclusiveGateway,
    runWithUserTask,
    runWithScriptTask
  },
  Engine: Engine
})

runWithScriptTask()
