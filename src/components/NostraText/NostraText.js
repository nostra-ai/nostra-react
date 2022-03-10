import React, { Component, Fragment } from 'react'
import Parser from 'html-react-parser';
import Dexie from 'dexie';

const data = {
  "test" : "This text is from our database!",
};

async function getData(){
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

export const NostraText = ({ tag : Tag, original, nostraTag, attributes }) => {
    var result = original;

    content.then((nData) => {
      var tempResult = JSON.parse(nData[0]["data"]);

      if(tempResult["showDefault"]){
        result = original;
      }else{
        result = tempResult["variations"]["referrer"]["home-button"][0]["text"];
      }

    }).catch((e) => {
      console.log(e);
    });


    return (
      <Tag data-nostra={nostraTag} { ...attributes }> {Parser(result)} </Tag> 
    )
}
