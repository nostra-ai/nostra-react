var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var getData = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var db;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            db = new Dexie("nostra");

            db.version(1).stores({
              localData: "id,data"
            });

            _context.prev = 2;
            _context.next = 5;
            return db.localData.where("id").equals("content").toArray();

          case 5:
            return _context.abrupt('return', _context.sent);

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](2);

            console.log(_context.t0);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 8]]);
  }));

  return function getData() {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import React, { Component, Fragment, useState, useEffect } from 'react';
import Parser from 'html-react-parser';
import Dexie from 'dexie';
import PropTypes from 'prop-types';

var content = getData();

/* 
  NostraText -> HTML element with data-nostra tag
  @params
    - tag -> HTML element tied to the element you're replacing (i.e. h2, p, div, etc...)
    - original -> The original text that was in your original element
    - nostraTag -> The tag that links to the content in our nostra DB
    - attributes -> Dictionary of html attributes (i.e. className, style, etc...)
*/

export var NostraText = function NostraText(_ref2) {
  var Tag = _ref2.tag,
      original = _ref2.original,
      nostraTag = _ref2.nostraTag,
      attributes = _ref2.attributes;

  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      text = _useState2[0],
      setText = _useState2[1];

  content.then(function (nData) {
    var tempResult = JSON.parse(nData[0]["data"]);

    /*
      Content show default or profile status or uri?
      
    */

    if (tempResult["showDefault"]) {
      setText(original);
    } else {
      setText(tempResult["variations"]["referrer"][nostraTag][0]["text"]);
    }
  }).catch(function (e) {
    console.log(e);
  });

  function testOnClick() {
    console.log("Clicked");
  }

  return React.createElement(
    Tag,
    _extends({ 'data-nostra': nostraTag }, attributes, { onClick: testOnClick }),
    ' ',
    Parser(text),
    ' '
  );
};

NostraText.propTypes = {
  tag: PropTypes.string.isRequired,
  original: PropTypes.string.isRequired,
  nostraTag: PropTypes.string.isRequired,
  attributes: PropTypes.object.isRequired
};