var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import React, { useState, useEffect } from 'react';
import Parser from 'html-react-parser';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import * as ReactDOMServer from 'react-dom/server';

/* 
  NostraCustomText -> HTML element with data-nostra tag
  @params
    - component -> Pass in custom component (e.x custom Button component you use for all buttons on your site)
    - nostraTag -> The tag that links to the content in our nostra DB
*/

export var NostraCustomText = function NostraCustomText(_ref) {
  var component = _ref.component,
      nostraTag = _ref.nostraTag;


  var reactComponent = Parser(ReactDOMServer.renderToStaticMarkup(component));

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(NostraText, { tag: reactComponent.type, original: reactComponent.props.children, nostraTag: nostraTag, attributes: reactComponent.props })
  );
};

NostraCustomText.propTypes = {
  component: PropTypes.object.isRequired,
  nostraTag: PropTypes.string.isRequired
};

/* 
  NostraText -> HTML element with data-nostra tag
  @params
    - tag -> HTML element tied to the element you're replacing (i.e. h2, p, div, etc...)
    - original -> The original text that was in your original element
    - nostraTag -> The tag that links to the content in our nostra DB
    - attributes -> Dictionary of html attributes (i.e. className, style, etc...)
*/

export var NostraText = function NostraText(_ref2) {
  var Type = _ref2.type,
      original = _ref2.original,
      nostraTag = _ref2.nostraTag,
      attrs = _ref2.attrs;

  var _useState = useState(original),
      _useState2 = _slicedToArray(_useState, 2),
      text = _useState2[0],
      setText = _useState2[1];

  useEffect(function () {

    var cookies = new Cookies();

    var data = cookies.get("nostra-data");

    if (data === "original" || data === undefined) {
      setText(original);
    } else {
      var text = data[nostraTag];

      if (text !== undefined) {
        setText(text["text"]);
      } else {
        setText(original);
      }
    }
  }, [nostraTag, original]);

  return React.createElement(
    Type,
    _extends({ 'data-nostra': nostraTag, 'data-nostrafind': 'find' }, attrs),
    ' ',
    Parser(text),
    ' '
  );
};

NostraText.propTypes = {
  type: PropTypes.string.isRequired,
  original: PropTypes.string.isRequired,
  nostraTag: PropTypes.string.isRequired,
  attrs: PropTypes.object
};