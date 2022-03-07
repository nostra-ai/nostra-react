import React from 'react';
import {storiesOf} from '@storybook/react';

import {NostraImage} from '../components/NostraImage'

const stories = storiesOf('Nostra', module);

stories.add('Image', () => {
    return (
        <NostraImage />
    );
})