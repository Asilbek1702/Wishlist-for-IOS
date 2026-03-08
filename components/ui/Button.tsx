import { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton, ButtonProps as PaperButtonProps } from 'react-native-paper';

type ButtonProps = Omit<PaperButtonProps, 'mode' | 'loading' | 'disabled'> & {
  variant?: 'primary' | 'outline' | 'text';
  mode?: 'contained' | 'outlined' | 'text';
  loading?: boolean;
  disabled?: boolean;
};

export const Button = forwardRef<React.ComponentRef<typeof PaperButton>, ButtonProps>(
  ({ variant = 'primary', mode, style, contentStyle, labelStyle, loading, disabled, ...props }, ref) => {
    const resolvedMode = mode ?? (variant === 'outline' ? 'outlined' : variant === 'text' ? 'text' : 'contained');
    return (
      <PaperButton
        ref={ref}
        mode={resolvedMode}
        loading={loading === true}
        disabled={disabled === true}
        style={[variant === 'primary' && styles.primary, style]}
        contentStyle={[styles.content, contentStyle]}
        labelStyle={[styles.label, labelStyle]}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  primary: {
    borderRadius: 12,
  },
  content: {
    paddingVertical: 6,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
});