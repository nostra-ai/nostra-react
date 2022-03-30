var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React, { Component, Fragment } from 'react';

var data = {
  "test": "https://media.istockphoto.com/photos/picturesque-morning-in-plitvice-national-park-colorful-spring-scene-picture-id1093110112?k=20&m=1093110112&s=612x612&w=0&h=3OhKOpvzOSJgwThQmGhshfOnZTvMExZX2R91jNNStBY="
};

export var NostraImage = function NostraImage(_ref) {
  var nostraTag = _ref.nostraTag,
      original = _ref.original,
      attributes = _ref.attributes;

  var result = original;
  if (data[nostraTag] !== undefined) {
    result = data[nostraTag];
  }
  return React.createElement("img", _extends({ src: result, "data-nostra": nostraTag }, attributes));
};