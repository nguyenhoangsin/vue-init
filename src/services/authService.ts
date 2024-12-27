import { ref } from 'vue';
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import localStorageUtils from '../utils/localStorageUtils';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}

export enum Permission {
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
  EDIT_USER = 'EDIT_USER',
  DELETE_POST = 'DELETE_POST',
}

interface User {
  isAuthenticated: boolean;
  username: string | null;
  role: UserRole | null;
  permissions: Permission[] | null;
}

interface AuthProvider extends User {
  signin(username: string): Promise<void>;
  signout(): Promise<void>;
  hasAllowedRoles(allowedRoles: UserRole[]): boolean;
  hasPermission(permission: Permission): boolean;
}

const AUTH_USER = 'AUTH_USER';

// Reactive state for the user
const user = ref<User | null>(localStorageUtils.getItem<User>(AUTH_USER));

export const authProvider: AuthProvider = {
  get isAuthenticated() {
    return user.value?.isAuthenticated || false;
  },
  get username() {
    return user.value?.username || null;
  },
  get role() {
    return user.value?.role || null;
  },
  get permissions() {
    return user.value?.permissions || null;
  },
  async signin(username: string) {
    await new Promise((r) => setTimeout(r, 500));
    const newUser: User = {
      isAuthenticated: true,
      username,
      role: UserRole.ADMIN,
      permissions: [],
    };
    localStorageUtils.setItem(AUTH_USER, newUser);
    user.value = newUser;
  },
  async signout() {
    await new Promise((r) => setTimeout(r, 500));
    localStorageUtils.removeItem(AUTH_USER);
    user.value = null;
  },
  hasAllowedRoles(allowedRoles: UserRole[]): boolean {
    return !!user.value?.role && allowedRoles.includes(user.value.role);
  },
  hasPermission(permission: Permission): boolean {
    return !!user.value?.permissions?.includes(permission);
  },
};

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  if (!authProvider.isAuthenticated) {
    next({
      path: '/login',
      query: { from: to.fullPath },
    });
  } else {
    next();
  }
}

export function loginGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  if (authProvider.isAuthenticated) {
    next('/');
  } else {
    next();
  }
}
