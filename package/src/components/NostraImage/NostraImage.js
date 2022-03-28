import React, { Component, Fragment } from 'react'

const data = {
  "test" : "https://media.istockphoto.com/photos/picturesque-morning-in-plitvice-national-park-colorful-spring-scene-picture-id1093110112?k=20&m=1093110112&s=612x612&w=0&h=3OhKOpvzOSJgwThQmGhshfOnZTvMExZX2R91jNNStBY=",
};

export const NostraImage = ({ nostraTag, original, attributes }) => {
  var result = original;
  if(data[nostraTag] !== undefined){
    result = data[nostraTag];
  }
    return (
      <img src={result} data-nostra={nostraTag} { ...attributes } />
    )
}
