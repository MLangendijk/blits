/*
 * Copyright 2023 Comcast Cable Communications Management, LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
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
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const settings = {
  ___settings: {},
  get(key, defaultValue = null) {
    return (key in this.___settings && this.___settings[key]) || defaultValue
  },
  set(key, value) {
    if (typeof key === 'object') {
      Object.keys(key).forEach((k) => {
        this.set(k, key[k])
      })
    } else {
      this.___settings[key] = value
    }
  },
}

export default settings
