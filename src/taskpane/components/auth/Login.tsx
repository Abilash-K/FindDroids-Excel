import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  Button,
  Input,
  Label,
  Text,
  tokens,
  Card,
  mergeClasses,
  Spinner,
} from '@fluentui/react-components';
import { PersonRegular, LockClosedRegular } from '@fluentui/react-icons';
import { useAuthStore } from '../../store/useStore';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    ...shorthands.padding('32px'),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    borderRadius: tokens.borderRadiusMedium,
    transition: 'transform 0.2s ease-in-out',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: tokens.shadow8,
    },
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  title: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightHero800,
  },
  subtitle: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
    maxWidth: '240px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  input: {
    backgroundColor: tokens.colorNeutralBackground1,
    transition: 'border-color 0.2s ease-in-out',
    ':focus-within': {
      ...shorthands.borderColor(tokens.colorBrandForeground1),
    },
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: tokens.fontSizeBase200,
    marginTop: '8px',
    textAlign: 'center',
  },
  button: {
    marginTop: '8px',
    transition: 'all 0.2s ease-in-out',
    ':hover': {
      transform: 'translateY(-1px)',
    },
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    color: tokens.colorNeutralForeground2,
  },
});

export const Login: React.FC = () => {
  const styles = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <Text className={styles.title}>Welcome to Findroids</Text>
          <Text className={styles.subtitle}>
            Please sign in to continue to your account
          </Text>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <Label htmlFor="email" weight="semibold">
              <span className={styles.icon}>
                <PersonRegular />
                Email
              </span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <Label htmlFor="password" weight="semibold">
              <span className={styles.icon}>
                <LockClosedRegular />
                Password
              </span>
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={styles.input}
              required
            />
          </div>
          {error && (
            <Text className={styles.error}>
              {error}
            </Text>
          )}
          <Button
            type="submit"
            appearance="primary"
            className={styles.button}
            disabled={isLoading}
            icon={isLoading ? <Spinner size="tiny" /> : undefined}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Card>
    </div>
  );
}; 