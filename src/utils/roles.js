export const CUSTOMER_ROLE = 'customer';
export const EMPLOYEE_ROLE = 'employee';
export const ADMIN_ROLE = 'admin';

export const WEBSITE_ALLOWED_ROLES = [CUSTOMER_ROLE, EMPLOYEE_ROLE, ADMIN_ROLE];

export const isWebsiteAllowedRole = (role) => WEBSITE_ALLOWED_ROLES.includes(role);
