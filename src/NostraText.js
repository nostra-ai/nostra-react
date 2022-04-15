import React, { useState, useEffect } from 'react'
import Parser from 'html-react-parser';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import * as ReactDOMServer from 'react-dom/server';

/* 
  nostraRawText -> HTML element with data-nostra tag
  @params
    - original -> The original text that was in your original element
    - nostraTag -> The tag that links to the content in our nostra DB
*/

export const nostraRawText = (original, nostraTag) => {
  var text = original

  const cookies = new Cookies();

  var data = cookies.get("nostra-data");

  if(data === "original" || data === undefined){
    text = original
  }else{
    text = data[nostraTag];

    if(text !== undefined){
      text = text["text"]
    }else{
      text = original
    }
  }

return Parser(text);
}

nostraRawText.propTypes = {
original: PropTypes.string.isRequired,
nostraTag: PropTypes.string.isRequired,
};

/* 
  NostraCustomText -> HTML element with data-nostra tag
  @params
    - component -> Pass in custom component (e.x custom Button component you use for all buttons on your site)
    - nostraTag -> The tag that links to the content in our nostra DB
*/

export const NostraCustomText = ({component, nostraTag}) => {

    const reactComponent = Parser(ReactDOMServer.renderToStaticMarkup(component));

    return (
      <React.Fragment>
        <NostraText type={reactComponent.type} original={reactComponent.props.children} nostraTag={nostraTag} attrs={reactComponent.props}/>
      </React.Fragment>
    )
}

NostraCustomText.propTypes = {
  component: PropTypes.object.isRequired,
  nostraTag: PropTypes.string.isRequired,
};


/* 
  NostraText -> HTML element with data-nostra tag
  @params
    - tag -> HTML element tied to the element you're replacing (i.e. h2, p, div, etc...)
    - original -> The original text that was in your original element
    - nostraTag -> The tag that links to the content in our nostra DB
    - attributes -> Dictionary of html attributes (i.e. className, style, etc...)
*/

export const NostraText = ({ type: Type, original, nostraTag, attrs}) => {
  const [text, setText] = useState(original);

  useEffect(() => {

    const cookies = new Cookies();

    var data = cookies.get("nostra-data");

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

  }, [nostraTag, original])

    return (
      <Type data-nostra={nostraTag} data-nostrafind="find" {...attrs}> {Parser(text)} </Type>
    )
}

NostraText.propTypes = {
  type: PropTypes.string.isRequired,
  original: PropTypes.string.isRequired,
  nostraTag: PropTypes.string.isRequired,
  attrs: PropTypes.object
};
