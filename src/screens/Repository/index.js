import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { Container } from './styles';

export default function User({ repository }) {
  useEffect(() => {
    // const userParam = navigation.getParam('user');
    // setUser(userParam);
    // loadData();
  }, []);

  return (
    <Container>
      <WebView
        source={{ uri: repository.html_url }}
        style={{ flex: 1, marginTop: 20 }}
      />
    </Container>
  );
}

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('repository').name,
});

User.propTypes = {
  repository: PropTypes.string.isRequired,
};
