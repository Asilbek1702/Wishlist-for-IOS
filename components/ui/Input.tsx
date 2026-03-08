import { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

export const Input = forwardRef<any, any>(
  ({ style, error, secureTextEntry, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        mode="outlined"
        outlineColor="#E5E7EB"
        activeOutlineColor="#6366F1"
        placeholderTextColor="#9CA3AF"
        error={error === true}
        secureTextEntry={secureTextEntry === true}
        style={[styles.input, style]}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
});