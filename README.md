# Nostra React Component

Connect to Nostra's dynamic changing logic to change elements in a React application.

Supported element types:

- Text Elements

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

## Tagging NostraText
