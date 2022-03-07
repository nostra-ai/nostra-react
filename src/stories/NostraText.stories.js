import React from 'react';
import {storiesOf} from '@storybook/react';

import {NostraText} from '../components/NostraText'

const stories = storiesOf('App Test', module);

stories.add('App', () => {
    return (
        <NostraText nostraTag="test" original="This is example text for Nostra" tag="h2" attributes={{"class" : "sample"}}/>
    );
})