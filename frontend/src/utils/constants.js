export const FIXED_CREDENTIALS = {
  underwriter: {
    email: 'underwriter@riskguard.com',
    password: 'underwriter123'
  },
  admin: {
    email: 'admin@riskguard.com',
    password: 'admin123'
  }
};

export const INSURANCE_TYPES = [
  { id: 'health', name: 'Health Insurance' },
  { id: 'life', name: 'Life Insurance' },
  { id: 'motor', name: 'Motor Insurance' }
];

export const COVERAGE_LEVELS = ['Basic', 'Standard', 'Premium'];

export const APPLICATION_STATUS = ['pending', 'approved', 'rejected', 'review_required'];
