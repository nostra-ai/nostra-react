import React from 'react';
import { storiesOf } from '@storybook/react';

import { NostraText } from '../NostraText'

const stories = storiesOf('Nostra', module);

stories.add('Text', () => {
    return (
        <NostraText nostraTag="test2" original="<span style='color:blue'>This is example text</span> for Nostra" tag="h2" attributes={{ "className": "sample" }} />
    );
})