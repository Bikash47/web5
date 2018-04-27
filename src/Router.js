import React, {Component} from 'react';

import {
    Scene,
    Router,
    Actions,
    Stack
} from 'react-native-router-flux';
import ScienceProject from './ScienceProject'


const Example = () => (
    <Router>
      <Stack key="root" navigationBarStyle={{ backgroundColor: '#4051B5',borderBottomColor: 'gray', borderBottomWidth: 1 }} titleStyle={{ color: 'white' }}  >
     
        <Scene key="ScienceProject" component={ScienceProject} title="Web5" initial />
        

      </Stack>
    </Router>
  );
export default Example;