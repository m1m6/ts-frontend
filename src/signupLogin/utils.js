import { ROLES } from './constants';

export const isAdmin = (role) => role === ROLES.ADMIN;
export const isEditor = (role) => role === ROLES.EDITOR;
export const isDeveloper = (role) => role === ROLES.DEVELOPER;
