'use strict';

import { mixin } from 'tcomb-validation';

export function getOptionsOfEnum(type) {
  var enums = type.meta.map;
  return Object.keys(enums).map(value => {
    return {
      value,
      text: enums[value]
    };
  });
}

export function getTypeInfo(type) {

  var innerType = type;
  var isMaybe = false;
  var isSubtype = false;
  var kind;

  while (innerType) {
    kind = innerType.meta.kind;
    if (kind === 'maybe') {
      isMaybe = true;
      innerType = innerType.meta.type;
      continue;
    }
    if (kind === 'subtype') {
      isSubtype = true;
      innerType = innerType.meta.type;
      continue;
    }
    break;
  }

  return {
    isMaybe: isMaybe,
    isSubtype: isSubtype,
    innerType: innerType
  };
}

// thanks to https://github.com/epeli/underscore.string

function underscored(s){
  return s.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
}

function capitalize(s){
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function humanize(s){
  return capitalize(underscored(s).replace(/_id$/, '').replace(/_/g, ' '));
}

export function merge(a, b) {
  return mixin(mixin({}, a), b, true);
}

export function move(arr, fromIndex, toIndex) {
  var element = arr.splice(fromIndex, 1)[0];
  arr.splice(toIndex, 0, element);
  return arr;
}

/*
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    var r = Math.random() * 16|0, v = (c === 'x') ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}
*/

let counter = 0;

export function uid() {
  return '__ID' + (counter++);
}
