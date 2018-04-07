import { Factory, PetrinetInterface, PlaceInterface } from '../src/model'
import { PetrinetBuilder } from '../src/builder/PetrinetBuilder'
import { JsonDumper } from '../src/dumper/JsonDumper'
import { MarkingBuilder } from '../src/builder/MarkingBuilder'
import { TransitionService } from '../src/service/TransitionService'

const $factory = new Factory()

function createPetrinet(): PetrinetInterface {
  let $builder = new PetrinetBuilder($factory)

  let p1 = $builder.place()
  let p2 = $builder.place()
  let p3 = $builder.place()
  let p4 = $builder.place()

  let t1 = $builder.transition()
  let t2 = $builder.transition()

  $builder.connect(p1, t1, 1)
  $builder.connect(t1, p2, 1)
  $builder.connect(t1, p3, 1)
  $builder.connect(p2, t2, 1)
  $builder.connect(p3, t2, 1)
  $builder.connect(t2, p4, 1)

  return $builder.getPetrinet()
}

// 创建流程结构
const petrinet = createPetrinet()

// transition 集合
const $ts = petrinet.getTransitions()
// place 集合
const $ps = petrinet.getPlaces()

// 生成json数据文件
function dumpJSON() {
  let dumper = new JsonDumper()
  dumper.dump(petrinet, null)
}

dumpJSON()

interface MarkParam {
  place: PlaceInterface,
  count: number
}

function createMarking(markParams: MarkParam | MarkParam[]) {
  let markingBuilder = new MarkingBuilder($factory)
  let arr = []
  if (!Array.isArray(markParams)) {
    arr = [markParams]
  } else {
    arr = markParams
  }

  arr.forEach(markParam => {
    markingBuilder.mark(markParam.place, markParam.count)
  })

  return markingBuilder.getMarking()
}

function fire(transition, marking) {
  const $transitionService = new TransitionService($factory)

  // const isEnabled = $transitionService.isEnabled(transition, marking)

  // console.log('is transition allowed? ', isEnabled)

  try {
      $transitionService.fire(transition, marking)
  } catch (e) {
     console.log(e.message)
  }
}

// 模拟流程运行
function mockRunProcess() {
  let marking

  // 标记p1为流程的起点, 并添加一个token

  marking = createMarking({
    place: $ps[0],
    count: 1
  })

  // t1 发生变迁
  fire($ts[0], marking)

  // t2 发生变迁
  fire($ts[1], marking)
}

mockRunProcess()



