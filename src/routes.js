import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './screens/Main';
import User from './screens/User';

const AppNavigator = createStackNavigator(
  {
    Main,
    User,
  },
  {
    headerLayoutPreset: 'center',
    headerBackTitleVisible: false,
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#222',
      },
      headerTintColor: '#fff',
    },
  },
);

export default createAppContainer(AppNavigator);
