import React from 'react';
import {
  makeStyles,
  Button,
  Text,
  Avatar,
} from '@fluentui/react-components';
import { PersonRegular } from '@fluentui/react-icons';
import { useAuthStore } from '../../store/useStore';

const useStyles = makeStyles({
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
  },
  userContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  name: {
    fontSize: '14px',
    fontWeight: '500',
  },
  email: {
    fontSize: '12px',
    color: '#666',
  },
  logoutButton: {
    marginLeft: '12px',
  },
});

export const UserProfile: React.FC = () => {
  const styles = useStyles();
  const { user, logout, isLoading } = useAuthStore();

  if (!user) return null;

  return (
    <div className={styles.topbar}>
      <div className={styles.userContainer}>
        <div className={styles.userInfo}>
          <Text className={styles.name}>
            {user.user_metadata.first_name} {user.user_metadata.last_name}
          </Text>
          <Text className={styles.email}>
            {user.email}
          </Text>
        </div>
        <Avatar
          name={`${user.user_metadata.first_name} ${user.user_metadata.last_name}`}
          icon={<PersonRegular />}
          size={32}
        />
        <Button
          className={styles.logoutButton}
          appearance="subtle"
          onClick={logout}
          disabled={isLoading}
          size="small"
        >
          {isLoading ? 'Signing out...' : 'Sign Out'}
        </Button>
      </div>
    </div>
  );
}; 