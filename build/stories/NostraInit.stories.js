import React from 'react';
import { storiesOf } from '@storybook/react';

import { NostraInit } from '../components/NostraInit';

var stories = storiesOf('Nostra', module);

stories.add('Init', function () {
    return React.createElement(NostraInit, null);
});