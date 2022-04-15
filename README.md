# Nostra React Component

Connect to Nostra's dynamic changing logic to change elements in a React application.

Supported element types:

- All text elements
- Anchor elements
- Custom react wrapper components for text and anchor elements

## Install

```bash
yarn add nostra-ai/nostra-react

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

`NostraText` takes in the following inputs:

| Variable  | Type   | Required | Description                                                                     |
| --------- | ------ | -------- | ------------------------------------------------------------------------------- |
| type      | string | &check;  | Type of the HTML element being converted.                                       |
| original  | string | &check;  | Original text/items inside of the HTML element.                                 |
| nostraTag | string | &check;  | Internal name given to the element. This is used to change content dynamically. |
| attrs     | dict   | &cross;  | Any attributes given to the HTML element.                                       |

Example:

Take a `<p>` tag below:

```html
<p className="m-0 mb-32" data-reveal-delay="400">
  Lorem ipsum dolor sit amet, consectetur.
</p>
```

and convert is as such:

```html
<NostraText nostraTag="header" original="Lorem ipsum dolor sit amet,
consectetur." tag="p" attributes={{ "className": "m-0 mb-32",
"data-reveal-delay" : "400" }} />
```

## Using NostraCustomText

`NostraCustomText` takes the following inputs:

| Variable  | Type   | Required | Description                                                                     |
| --------- | ------ | -------- | ------------------------------------------------------------------------------- |
| component | JSX    | &check;  | Type of the HTML element being converted.                                       |
| nostraTag | string | &check;  | Internal name given to the element. This is used to change content dynamically. |

*Note: This will only work if the child of the component is what Nostra is testing*

Example:

Take a custom element named `Button`:

```javascript
<Button tag="a" color="primary" wideMobile href="https://nostra.ai/">
  Get started
</Button>
```

and convert it as such:

```javascript
<NostraCustomText
  component={
    <Button tag="a" color="primary" wideMobile href="https://nostra.ai/">
      Get started
    </Button>
  }
  nostraTag="header-cta"
/>
```

## Using nostraRawText

`nostraRawText` takes the following inputs:

| Variable  | Type   | Required | Description                                                                     |
| --------- | ------ | -------- | ------------------------------------------------------------------------------- |
| original | string    | &check;  | The original text that was in your original element.                                       |
| nostraTag | string | &check;  | Internal name given to the element. This is used to change content dynamically. |

Example:

Take a custom element named `Button`:

```javascript
<Button 
  tag="a" 
  color="primary" 
  wideMobile 
  href="https://nostra.ai/" 
  value="Get started"
/>
```

and convert it as such:

```javascript
<NostraCustomText
  component={
    <Button tag="a" color="primary" wideMobile href="https://nostra.ai/">
      Get started
    </Button>
  }
  nostraTag="header-cta"
/>
```