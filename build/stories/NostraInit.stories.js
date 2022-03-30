import React from 'react';
import { storiesOf } from '@storybook/react';

import { NostraInit } from '../NostraInit';

var stories = storiesOf('Nostra', module);

stories.add('Init', function () {
    return React.createElement(NostraInit, null);
});