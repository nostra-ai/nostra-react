import React, { Component, Fragment } from 'react'

const data = {
  "test2" : "Welcome Nostra",
};

export const NostraText = ({ tag : Tag, original, nostraTag, attributes }) => {
    var result = original;
    if(data[nostraTag] !== undefined){
      result = data[nostraTag];
    }
    return (
        <Tag data-nostra={nostraTag} { ...attributes }> {result} </Tag> 
    )
}
