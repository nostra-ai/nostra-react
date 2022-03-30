import React from 'react';
import { storiesOf } from '@storybook/react';

import { NostraText } from '../components/NostraText';

var stories = storiesOf('Nostra', module);

stories.add('Text', function () {
    return React.createElement(NostraText, { nostraTag: 'test2', original: '<span style=\'color:blue\'>This is example text</span> for Nostra', tag: 'h2', attributes: { "className": "sample" } });
});