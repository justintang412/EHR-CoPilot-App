/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';

import type { Comment, User } from '@/types/api';

import { useFirebaseUser } from '@/features/auth/api/useFirebaseUser';


export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

type RoleTypes = keyof typeof ROLES;


export const POLICIES = {
  'comment:delete': (user: User, comment: Comment) => {
    if (user.role === 'ADMIN') {
      return true;
    }

    if (user.role === 'USER' && comment.author?.id === user.id) {
      return true;
    }

    return false;
  },
};

export const useAuthorization = () => {
  const user = useFirebaseUser();

  if (!user) {
    throw Error('User does not exist!');
  }

  const checkAccess = React.useCallback(
    ({ allowedRoles }: { allowedRoles: RoleTypes[] }) => {
      // Firebase user does not have a 'role' property by default
      // You may need to fetch custom claims or user profile from your DB
      // For now, treat all users as 'USER'
      const role = 'USER';
      if (allowedRoles && allowedRoles.length > 0) {
        return allowedRoles?.includes(role as RoleTypes);
      }

      return true;
    },
    [user],
  );

  return { checkAccess, role: 'USER' };
};

type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
} & (
  | {
      allowedRoles: RoleTypes[];
      policyCheck?: never;
    }
  | {
      allowedRoles?: never;
      policyCheck: boolean;
    }
);

export const Authorization = ({
  policyCheck,
  allowedRoles,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();

  let canAccess = false;

  if (allowedRoles) {
    canAccess = checkAccess({ allowedRoles });
  }

  if (typeof policyCheck !== 'undefined') {
    canAccess = policyCheck;
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};
