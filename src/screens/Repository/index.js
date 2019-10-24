import PropTypes from 'prop-types';
import React from 'react';
import { WebView } from 'react-native-webview';
import { Container, Loading, LoadingContainer } from './styles';

export default function Repository({ navigation }) {
  const { repository } = navigation.state.params;

  const renderLoading = () => (
    <LoadingContainer>
      <Loading />
    </LoadingContainer>
  );
  return (
    <Container>
      <WebView
        source={{ uri: repository.html_url }}
        style={{ flex: 1 }}
        renderLoading={renderLoading}
        startInLoadingState
      />
    </Container>
  );
}

Repository.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('repository').name,
});

Repository.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: {
        html_url: PropTypes.string,
      },
    }),
  }).isRequired,
};
