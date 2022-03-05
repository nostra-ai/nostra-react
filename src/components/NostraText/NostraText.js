import React, { Component, Fragment } from 'react'

const data = {
  "test" : "Welcome Nostra",
};


export const NostraText = ({ tag, original }) => {
    var result = original;
    if(data[tag] !== undefined){
      result = data[tag];
    }
    return (
      <div data-nostra={tag}> {result} </div>
    )
}

const NostraImage = ({ tag, original }) => {
    return (
      <img src={require("../logo.svg").default} data-nostra={tag} className="App-logo" alt="logo" />
    )
  }
  
  export { NostraText, NostraImage }