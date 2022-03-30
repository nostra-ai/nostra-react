import React from 'react';
import { storiesOf } from '@storybook/react';

import { NostraImage } from '../components/NostraImage';

var stories = storiesOf('Nostra', module);

stories.add('Image', function () {
    return React.createElement(NostraImage, { nostraTag: 'test2', original: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg', attributes: { className: "App-logo", alt: "logo" } });
});