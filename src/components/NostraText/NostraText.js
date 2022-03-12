import React, { Component, Fragment, useState, useEffect } from 'react'
import Parser from 'html-react-parser';
import Dexie from 'dexie';

const data = {
  "test": "This text is from our database!",
};

async function getData() {
  var db = new Dexie("nostra");
  db.version(1).stores({
    localData: "id,data"
  });

  try {
    const contentData = await db.localData.where("id").equals("content").toArray();
    return contentData;
  } catch (e) {
    console.log(e);
  }
}

var content = getData();
/* 
  NostraText -> HTML element with data-nostra tag
  @params
    - tag -> HTML element tied to the element you're replacing (i.e. h2, p, div, etc...)
    - original -> The original text that was in your original element
    - nostraTag -> The tag that links to the content in our nostra DB
    - attributes -> Dictionary of html attributes (i.e. className, style, etc...)

*/

export const NostraText = ({ tag: Tag, original, nostraTag, attributes }) => {
  const [text, setText] = useState('');
  var result = original;

  content.then((nData) => {
    var tempResult = JSON.parse(nData[0]["data"]);

    if (tempResult["showDefault"]) {
      setText(original);
    } else {
      setText(tempResult["variations"]["referrer"]["home-button"][0]["text"]);
    }
  }).catch((e) => {
    console.log(e);
  });


  return (
    <Tag data-nostra={nostraTag} {...attributes}> {Parser(text)} </Tag>
  )
}

NostraText.propTypes = {
  tag: PropTypes.string.isRequired,
  original: PropTypes.string.isRequired,
  nostraTag: PropTypes.string.isRequired,
  attributes: PropTypes.object.isRequired
};
