import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
  Error,
  LoadingContainer,
  Loading,
} from './styles';

export default function User({ navigation }) {
  const [stars, setStars] = useState([]);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState({});
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [endOfList, setEndOfList] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (!endOfList) {
        const userParam = navigation.state.params.user;
        setUser(userParam);
        const response = await api.get(
          `/users/${userParam.login}/starred?page=${page}`,
        );
        if (response.data && response.data.length > 0) {
          setStars(
            page === 1 ? [...response.data] : [...stars, ...response.data],
          );
        } else {
          setEndOfList(true);
        }

        setLoading(false);
      }
    } catch (e) {
      const { response } = e;
      let message;
      if (response.data) {
        message = response.data.message;
      } else {
        message = e.message;
      }
      setError(message);
    }
  };

  const renderStarredList = () => (
    <List
      data={stars}
      keyExtractor={star => String(star.id)}
      renderItem={({ item }) => {
        return (
          <Starred onPress={() => renderRepository(item)}>
            <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
            <Info>
              <Title>{item.name}</Title>
              <Author>{item.owner.login}</Author>
            </Info>
          </Starred>
        );
      }}
      onEndReachedThreshold={0.5}
      onEndReached={handleLoadMore}
      initialNumToRender={6}
      refreshing={refreshing}
      onRefresh={handleOnRefresh}
      ListFooterComponent={renderFooter}
    />
  );

  const handleLoadMore = () => {
    setLoading(true);
    setPage(page + 1);
    loadData();
  };

  const handleOnRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadData();
    setRefreshing(false);
    setEndOfList(false);
  };

  const renderFooter = () => {
    if (!loading || endOfList) {
      return null;
    }

    return (
      <LoadingContainer>
        <Loading />
      </LoadingContainer>
    );
  };

  const renderRepository = item => {
    navigation.navigate('Repository', { repository: item });
  };

  const renderError = () => <Error>{error}</Error>;

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user.avatar_url }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>

      {error ? renderError() : renderStarredList()}
    </Container>
  );
}

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name,
});

User.propTypes = {
  navigation: PropTypes.shape({
    state: {
      params: {
        user: PropTypes.obj,
      },
    },
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};
