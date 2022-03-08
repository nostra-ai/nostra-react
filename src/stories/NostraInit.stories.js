import React from 'react';
import {storiesOf} from '@storybook/react';

import {NostraInit} from '../components/NostraInit'

const stories = storiesOf('Nostra', module);

stories.add('Init', () => {
    return <NostraInit />;
})