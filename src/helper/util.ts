import * as BpmnModdle from 'bpmn-moddle'

export function delay(delay): Promise<any> {
  return new Promise(function(resolve) {
      setTimeout(resolve, delay)
  })
}

export function promisify(fn, receiver): Function {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn.apply(receiver, [...args, (err, res) => {
        return err ? reject(err) : resolve(res);
      }]);
    });
  };
};

export function transform(sourceXml: string, callback: Function = () => {}): Promise<any> {
  const moddle = new BpmnModdle()
  if (typeof sourceXml !== 'string') return callback(new Error('Nothing to transform'))
  const fromXML = promisify(moddle.fromXML, moddle)
  return fromXML(sourceXml, callback)
};
