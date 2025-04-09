import React, { useEffect } from 'react';
import { makeStyles, Spinner } from '@fluentui/react-components';
import { useAuthStore } from '../../store/useStore';
import { Login } from './Login';
import { UserProfile } from './UserProfile';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
  content: {
    flex: 1,
    overflow: 'auto',
  }
});

export const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const styles = useStyles();
  const { isAuthenticated, isLoading, getCurrentUser } = useAuthStore();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {isAuthenticated ? (
        <>
          <UserProfile />
          <div className={styles.content}>
            {children}
          </div>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}; 