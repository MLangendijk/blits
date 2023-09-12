/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2023 Comcast
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { renderer } from './launch.js'
import colors from './lib/colors/colors.js'

import { Log } from './lib/log.js'

const isTransition = (value) => {
  return typeof value === 'object' && 'transition' in value
}

const transformations = {
  unpackValue(obj) {
    if (typeof obj === 'object' && obj.constructor.name === 'Object') {
      if ('value' in obj) {
        return obj.value
      } else {
        return this.unpackValue(obj[Object.keys(obj).pop()])
      }
    } else {
      return obj
    }
  },
  parentId(props) {
    props.parent = props.parentId === 'root' ? renderer.root : renderer.getNodeById(props.parentId)
    delete props.parentId
    return props
  },
  color(props) {
    props.color = colors.normalize(props.color)
    return props
  },
  show(props) {
    props.alpha = props.alpha ? 1 : 0
    delete props.show
    return props
  },
  rotation(props) {
    props.rotation = props.rotation * (Math.PI / 180)
    return props
  },
  text(props) {
    props.text = props.text.toString()
    return props
  },
  textureColor(props) {
    if (!('color' in props)) {
      props.color = 'src' in props || 'texture' in props ? '0xffffffff' : '0x00000000'
    }
    return props
  },
  effects(props) {
    // todo hook into dynamic shader
    props.shader = props.effects[0]
    delete props.effects
    return props
  },
  src(props, setProperties) {
    if (setProperties.indexOf('color') === -1) {
      props.color = 0xffffffff
    }
    return props
  },
  texture(props, setProperties) {
    return this.src(props, setProperties)
  },
}

const Element = {
  defaults: {
    rotation: 0,
  },
  populate(data) {
    let props = {
      ...this.defaults,
      ...this.config,
      ...data,
    }
    this.initData = data

    Object.keys(props).forEach((prop) => {
      if (transformations[prop]) {
        props[prop] = transformations.unpackValue(props[prop])
        transformations[prop](props, this.setProperties)
      }

      this.setProperties.push(prop)
    })

    transformations.textureColor(props, this.setProperties)

    this.node = props.__textnode ? renderer.createTextNode(props) : renderer.createNode(props)
  },
  set(prop, value) {
    if (isTransition(value) && this.setProperties.indexOf(prop) > -1) {
      this.animate(prop, value.transition)
    } else {
      const props = {}
      props[prop] = transformations.unpackValue(value)
      if (transformations[prop]) {
        transformations[prop](props, this.setProperties)
      }

      Object.keys(props).forEach((prop) => {
        this.node[prop] = props[prop]
      })
    }
    this.setProperties.indexOf(prop) === -1 && this.setProperties.push(prop)
  },
  delete() {
    Log.debug('Deleting  Node', this.nodeId, this.node)
    this.node.parent = null
  },
  get nodeId() {
    return this.node && this.node.id
  },
  get id() {
    return this.initData.id || null
  },
  animate(prop, value) {
    const props = {}
    props[prop] = transformations.unpackValue(value)

    if (transformations[prop]) {
      transformations[prop](props)
    }

    if (this.node[prop] !== props[prop]) {
      const f = this.node.animate(props, {
        duration: typeof value === 'object' ? ('duration' in value ? value.duration : 300) : 300,
        easing:
          typeof value === 'object' ? ('function' in value ? value.function : 'ease') : 'ease',
      })

      value.delay ? setTimeout(() => f.start(), value.delay) : f.start()
    }
  },
}

export default (config) =>
  Object.assign(Object.create(Element), {
    node: null,
    setProperties: [],
    initData: {},
    config,
  })
