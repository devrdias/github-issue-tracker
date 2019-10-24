import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const LoadingContainer = styled.View`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  justify-content: center;
  align-items: center;
  border-color: #eee;
`;

export const Loading = styled.ActivityIndicator.attrs({
  animating: true,
  size: 'large',
})``;
