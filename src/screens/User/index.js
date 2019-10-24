import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, View } from 'react-native';
import api from '../../services/api';
import {
  Container,
  List,
  Header,
  Avatar,
  Name,
  Bio,
  OwnerAvatar,
  Starred,
  Info,
  Title,
  Author,
} from './styles';

export default function User({ navigation }) {
  const [stars, setStars] = useState([]);
  const [page, setPage] = useState(1);
  const [endList, setEndList] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userParam = navigation.getParam('user');
    setUser(userParam);
    loadData();
  }, []);

  const loadData = async () => {
    if (endList) {
      console.tron.log('fim da lista', response.data.length);
      return;
    }
    console.tron.log('page', page);
    setLoading(true);
    const userParam = navigation.getParam('user');
    const response = await api.get(
      `/users/${userParam.login}/starred?page=${page}`,
    );

    console.tron.log('TCL: loadData -> response.data', response.data.length);
    if (response.data) {
      setStars([...stars, ...response.data]);
      setPage(page + 1);
      if (response.data.length < 30) {
        setEndList(true);
      }
    }
    setLoading(false);
  };

  const renderFooter = () => {
    if (!endList) return null;

    return (
      <View
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          paddingVertical: 20,
          borderTopWidth: 1,
          marginTop: 10,
          marginBottom: 10,
          borderColor: '#fff',
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user.avatar_url }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>
      {loading ? (
        <ActivityIndicator color="#222" size="large" />
      ) : (
        <List
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => {
            return (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            );
          }}
          onEndReachedThreshold={0.01}
          onEndReached={loadData}
          initialNumToRender={5}
          maxToRenderPerBatch={2}
          refreshing={loading}
          onRefresh={() => {
            setPage(1);
            setEndList(false);
            loadData();
          }}
          ListFooterComponent={renderFooter}
        />
      )}
    </Container>
  );
}

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name,
});

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};
