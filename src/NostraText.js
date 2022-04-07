import React, { useState, useEffect } from 'react'
import Parser from 'html-react-parser';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';

/* 
  NostraText -> HTML element with data-nostra tag
  @params
    - tag -> HTML element tied to the element you're replacing (i.e. h2, p, div, etc...)
    - original -> The original text that was in your original element
    - nostraTag -> The tag that links to the content in our nostra DB
    - attributes -> Dictionary of html attributes (i.e. className, style, etc...)
*/

export const NostraText = ({ tag: Tag, original, nostraTag, attributes}) => {
  const [text, setText] = useState(original);

  const cookies = new Cookies();

  useEffect(() => {

    var data = cookies.get("nostra-data");
    console.log("cookie data: ", data);

    if(data === "original" || data === undefined){
      setText(original);
    }else{
      var text = data[nostraTag];

      if(text !== undefined){
        setText(text["text"]);
      }else{
        setText(original);
      }
    }

  }, [])

  return (
    <Tag data-nostra={nostraTag} data-nostrafind="find" {...attributes}> {Parser(text)} </Tag>
  )
}

NostraText.propTypes = {
  tag: PropTypes.string.isRequired,
  original: PropTypes.string.isRequired,
  nostraTag: PropTypes.string.isRequired,
  attributes: PropTypes.object
};
