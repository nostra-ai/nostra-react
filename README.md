# Nostra React Component

Connect to Nostra's dynamic changing logic to change elements in a React application.

Supported element types:

- All text elements
- Anchor elements
- Custom react wrapper components for text and anchor elements

## Install

```bash
yarn add shivpatel1027/nostra-component
```

## Usage

Usage examples are provided in the example folder.

## First Steps

In order to use the Nostra react component, you need to complete an internal onboarding process. If you have not completed this, please reach out arthur@nostra.ai for assistance.

## Initializing Nostra on pages being dyanmically changed.

Each page that is being dyanmically changed needs to have a `NostraInit` element. `NostraInit` does not take any inputs.

Example:

```javascript
import { NostraInit } from "nostra-react-component";

const Home = () => {
  return (
    <>
      <NostraInit />
      <Hero className="illustration-section-01" />
      <FeaturesTiles />
      <FeaturesSplit
        invertMobile
        topDivider
        imageFill
        className="illustration-section-02"
      />
      <Testimonial topDivider />
      <Cta split />
    </>
  );
};
```

## Using NostraText

Below is an example showing how to convert a text elememt (`p`,`h1`-`h6`, etc) or anchor tag to a `NostraText` element.

`NostraText` takes in the following inputs:

Take a `<p>` tag below:

```html
<p className="m-0 mb-32" data-reveal-delay="400">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
  incididunt ut labore et dolore magna aliqua.
</p>
```

and convert is as such:

```html
<NostraText nostraTag="header" original="Lorem ipsum dolor sit amet, consectetur
adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
aliqua." tag="p" attributes={{ "className": "m-0 mb-32", "data-reveal-delay" :
"400" }} />
```
