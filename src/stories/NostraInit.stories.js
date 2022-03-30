import React from 'react';
import {storiesOf} from '@storybook/react';

import {NostraInit} from '../NostraInit'

const stories = storiesOf('Nostra', module);

stories.add('Init', () => {
    return <NostraInit />;
})