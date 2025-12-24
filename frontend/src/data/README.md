# Dummy Data Files

This directory contains dummy JSON data for development and testing.

## Files

### users.json
Contains dummy data for:
- **Customers**: 3 customer records with names, emails, and addresses
- **Underwriters**: 2 underwriter records with departments and experience
- **Admins**: 1 admin user with permissions

**Usage:**
```javascript
import usersData from '../../data/users.json'
const customers = usersData.customers
```

### products.json
Contains 3 insurance products:
- Life Insurance
- Health Insurance  
- Motor Insurance

Each product includes:
- Product ID, name, icon
- Description
- Features list
- Base price and max coverage

**Usage:**
```javascript
import productsData from '../../data/products.json'
const products = productsData.products
```

### policies.json
Contains 4 dummy insurance policies with:
- Policy ID and status (active/pending)
- Customer and product information
- Coverage amount and premium details
- Payment dates and policy numbers

**Usage:**
```javascript
import policiesData from '../../data/policies.json'
const policies = policiesData.policies
```

### applications.json
Contains 4 dummy insurance applications with:
- Application ID and status (approved/pending/under_review)
- Customer and product information
- Risk score (4.5 - 7.8)
- Review information and notes

**Usage:**
```javascript
import applicationsData from '../../data/applications.json'
const applications = applicationsData.applications
```

## Integration

All components now use these dummy data files instead of hardcoding data. This makes it easier to:
- Test components with different data
- Replace with real API calls later
- Maintain data structure consistency

## Example Component

```javascript
import productsData from '../../data/products.json'

function ProductCards() {
  return (
    <div className="grid grid-3">
      {productsData.products.map(product => (
        <div key={product.id} className="card">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  )
}
```

## Future Updates

When connecting to a real backend API, simply replace the import statements:

```javascript
// Before (dummy data)
import productsData from '../../data/products.json'

// After (API call)
useEffect(() => {
  fetch('/api/products')
    .then(res => res.json())
    .then(data => setProducts(data.products))
}, [])
```
