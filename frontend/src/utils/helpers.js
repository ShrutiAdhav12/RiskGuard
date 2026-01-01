export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getStatusBadge = (status) => {
  const badges = {
    'pending': 'badge-warning',
    'approved': 'badge-success',
    'rejected': 'badge-danger',
    'review_required': 'badge-info',
    'active': 'badge-success',
    'inactive': 'badge-danger'
  };
  return badges[status] || 'badge-info';
};

export const calculateAge = (dob) => {
  if (!dob) return null;
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
