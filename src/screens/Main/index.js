import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
import {
  Container,
  Form,
  Input,
  SubmitButton,
  User,
  Avatar,
  List,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';

import api from '../../services/api';

export default function Main({ navigation }) {
  const [newUser, setNewUser] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const usersStorage = await AsyncStorage.getItem('users');
      if (usersStorage) {
        setUsers(JSON.parse(usersStorage));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleOnPress = async () => {
    try {
      setLoading(true);
      const userExists = users.some(
        u => u.login.toLowerCase() === newUser.toLowerCase(),
      );
      if (userExists) {
        throw new Error('User already exists');
      }
      const response = await api.get(`/users/${newUser}`);
      const { data } = response;

      if (data) {
        const { name, login, bio, avatar_url } = data;
        setUsers([...users, { name, login, bio, avatar_url }]);
      }
    } catch (error) {
      console.tron.log(error);
    }

    setLoading(false);
    setNewUser('');
    Keyboard.dismiss();
  };

  const handleAddUser = text => {
    setNewUser(text);
  };

  const handleDetailProfile = user => {
    navigation.navigate('User', { user });
  };

  return (
    <Container>
      <Form>
        <Input
          value={newUser}
          onChangeText={handleAddUser}
          autoCapitalize="none"
          autCorrect={false}
          placeholder="Add user"
          returnKeyType="send"
          onSubmitEditing={handleAddUser}
        />
        <SubmitButton loading={loading} onPress={handleOnPress}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Icon name="add" size={14} color="#fff" />
          )}
        </SubmitButton>
      </Form>

      <List
        data={users}
        keyExtractor={user => user.login}
        renderItem={({ item }) => (
          <User>
            <Avatar source={{ uri: item.avatar_url }} />
            <Name>{item.name}</Name>
            <Bio>{item.bio}</Bio>

            <ProfileButton onPress={() => handleDetailProfile(item)}>
              <ProfileButtonText>Profile</ProfileButtonText>
            </ProfileButton>
          </User>
        )}
      />
    </Container>
  );
}

Main.navigationOptions = {
  title: 'Users',
};

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
