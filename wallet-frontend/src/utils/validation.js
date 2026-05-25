import { z } from 'zod';

export const userSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must be less than 255 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  groupId: z
    .number()
    .int('Group ID must be an integer')
    .positive('Group ID must be a positive number')
    .optional()
    .nullable(),
});

export const userUpdateSchema = userSchema.partial().extend({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters')
    .optional()
    .or(z.literal('')),
});

export const validateUser = (data) => {
  return userSchema.safeParse(data);
};

export const validateUserUpdate = (data) => {
  return userUpdateSchema.safeParse(data);
};

// Account Validation Schema
export const accountSchema = z.object({
  userId: z
    .number()
    .int('User ID must be an integer')
    .positive('User ID must be a positive number'),
  accountTypeId: z
    .number()
    .int('Account type ID must be an integer')
    .positive('Account type ID must be a positive number'),
  currencyId: z
    .number()
    .int('Currency ID must be an integer')
    .positive('Currency ID must be a positive number'),
  balance: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Balance must be a valid number with max 2 decimal places')
    .refine((val) => {
      const num = parseFloat(val);
      return num >= 0;
    }, 'Balance must be non-negative'),
});

export const validateAccount = (data) => {
  return accountSchema.safeParse(data);
};

// Group Validation Schema
export const groupSchema = z.object({
  name: z
    .string()
    .min(2, 'Group name must be at least 2 characters')
    .max(50, 'Group name must be less than 50 characters')
    .trim(),
  permissionIds: z
    .array(z.number().int().positive())
    .min(1, 'At least one permission must be selected'),
});

export const validateGroup = (data) => {
  return groupSchema.safeParse(data);
};

// Permission Validation Schema
export const permissionSchema = z.object({
  name: z
    .string()
    .min(2, 'Permission name must be at least 2 characters')
    .max(50, 'Permission name must be less than 50 characters')
    .trim()
    .regex(/^[A-Z_]+$/, 'Permission name must be uppercase with underscores only'),
});

export const validatePermission = (data) => {
  return permissionSchema.safeParse(data);
};

// Account Type Validation Schema
export const accountTypeSchema = z.object({
  typeName: z
    .string()
    .min(2, 'Account type name must be at least 2 characters')
    .max(50, 'Account type name must be less than 50 characters')
    .trim()
    .regex(/^[a-zA-Z\s-]+$/, 'Account type name must contain only letters, spaces, and hyphens'),
});

export const validateAccountType = (data) => {
  return accountTypeSchema.safeParse(data);
};

// Currency Validation Schema
export const currencySchema = z.object({
  currencyCode: z
    .string()
    .min(3, 'Currency code must be exactly 3 characters')
    .max(3, 'Currency code must be exactly 3 characters')
    .regex(/^[A-Z]{3}$/, 'Currency code must be 3 uppercase letters')
    .trim(),
  currencyName: z
    .string()
    .min(2, 'Currency name must be at least 2 characters')
    .max(50, 'Currency name must be less than 50 characters')
    .trim()
    .regex(/^[a-zA-Z\s]+$/, 'Currency name must contain only letters and spaces'),
});

export const validateCurrency = (data) => {
  return currencySchema.safeParse(data);
};
