import { Engine } from '../src'
import request from 'axios'

async function loadXML() {
  let xml = await request.get('http://127.0.0.1:7001/public/4.bpmn');
  // console.log(xml.data)
  // let viewer = new BpmnJS()
  // viewer.importXML(xml.data)
  // viewer.attachTo('#demo')
  return xml;
}




