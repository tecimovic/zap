/**
 *
 *    Copyright (c) 2020 Silicon Labs
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

/**
 * This module contains the API for templating. For more detailed instructions, read {@tutorial template-tutorial}
 *
 * @module Templating API: Overridable functions.
 */

// Local utility function
function cleanseUints(uint) {
  if (uint == 'uint24_t') return 'uint32_t'
  if (uint == 'uint48_t') return 'uint8_t *'
  return uint
}

/**
 * Returns the name of a fall-through non-atomic type.
 * This method will be used unless the override is
 * providing a different implementation.
 *
 * @param {*} arg
 */
function nonAtomicType(arg = { name: 'unknown' }) {
  return `EmberAf${arg.name}`
}

/**
 * Returns the default atomic C type for a given atomic from
 * the database. These values are used unless there is an
 * override in template package json file. (Not yet fully
 * implemented, but the plan is for template pkg to be able
 * to override these.)
 *
 * @param {*} arg Object containing name and size
 */
function atomicType(arg = { name: 'unknown', size: 0 }) {
  var name = arg.name
  var size = arg.size
  if (name.startsWith('int')) {
    var signed
    if (name.endsWith('s')) signed = true
    else signed = false

    var ret = `${signed ? '' : 'u'}int${size * 8}_t`

    // few exceptions
    ret = cleanseUints(ret)
    return ret
  } else if (name.startsWith('enum') || name.startsWith('data')) {
    return cleanseUints(`uint${name.slice(4)}_t`)
  } else if (name.startsWith('bitmap')) {
    return cleanseUints(`uint${name.slice(6)}_t`)
  } else {
    switch (name) {
      case 'utc_time':
      case 'date':
        return 'uint32_t'
      case 'attribute_id':
      case 'cluster_id':
        return 'uint16_t'
      case 'no_data':
      case 'octet_string':
      case 'char_string':
      case 'ieee_address':
        return 'uint8_t *'
      case 'boolean':
        return 'uint8_t'
      case 'array':
        return `/* TYPE WARNING: ${name} array defaults to */ uint8_t * `
      default:
        return `/* TYPE WARNING: ${name} defaults to */ uint8_t * `
    }
  }
}

// WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!
//
// Note: these exports are public API. Templates that might have been created in the past and are
// available in the wild might depend on these names.
// If you rename the functions, you need to still maintain old exports list.
exports.atomicType = atomicType
exports.nonAtomicType = nonAtomicType
