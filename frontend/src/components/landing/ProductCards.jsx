import productsData from '../../data/products.json'

function ProductCards() {
  return (
    <section className="products-section">
      <div className="container">
        <h2 className="section-title">Our Insurance Products</h2>
        <p className="products-subtitle">Choose the coverage that best fits your needs</p>
        
        <div className="grid grid-3">
          {productsData.products.map(product => (
            <div key={product.id} className="card">
              <div className="product-icon">{product.icon}</div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="text-muted">From ₹{product.basePrice}/month</p>
              
              <ul className="features-list">
                {product.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="checkmark">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductCards

