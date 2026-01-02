import { StyleSheet } from 'react-native';

export const colors = {
  background: '#F2F7F5',
  primary: '#4E9F3D',
  secondary: '#ffffffff',
  text: '#2F3E46',
};

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
});
