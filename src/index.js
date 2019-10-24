import React from 'react';
import './config/ReactotronConfig';

import { StatusBar, SafeAreaView } from 'react-native';
import Routes from './routes';

// import { Container } from './styles';

console.disableYellowBox = true;

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#222" />
      <Routes />
      <SafeAreaView style={{ backgroundColor: '#222' }} />
    </>
  );
}
