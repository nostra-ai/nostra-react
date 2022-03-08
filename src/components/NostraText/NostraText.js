import React, { Component, Fragment } from 'react'
import Parser from 'html-react-parser';

const data = {
  "test" : "This text is from our database!",
};

export const NostraText = ({ tag : Tag, original, nostraTag, attributes }) => {
    var result = original;
    var fromDb = data[nostraTag];
    if(fromDb !== undefined){
      result = fromDb;
    }
    return (
        <Tag data-nostra={nostraTag} { ...attributes }> {Parser(result)} </Tag> 
    )
}
