import React, { useEffect, useState } from 'react';
import { productAPI } from '../../utils/api';
import { INSURANCE_TYPES } from '../../utils/constants';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    minCoverage: '',
    maxCoverage: ''
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productAPI.getAll();
        const data = response.data || [];
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await productAPI.update(editingId, formData);
        setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...formData } : p));
        alert('Product updated successfully!');
      } else {
        const newProduct = await productAPI.create(formData);
        setProducts(prev => [...prev, newProduct]);
        alert('Product created successfully!');
      }
      resetForm();
    } catch (err) {
      alert('Error saving product');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      minCoverage: product.minCoverage,
      maxCoverage: product.maxCoverage
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
        alert('Product deleted successfully!');
      } catch (err) {
        alert('Error deleting product');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', basePrice: '', minCoverage: '', maxCoverage: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Product Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Product'}
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-group">
                  <label>Base Price</label>
                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Min Coverage</label>
                  <input
                    type="number"
                    name="minCoverage"
                    value={formData.minCoverage}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Max Coverage</label>
                  <input
                    type="number"
                    name="maxCoverage"
                    value={formData.maxCoverage}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-success">
                  {editingId ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Products ({products.length})</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <p className="text-center text-gray-600">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600">No products yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2 hidden sm:table-cell">Description</th>
                    <th className="text-left py-2">Base Price</th>
                    <th className="text-left py-2 hidden md:table-cell">Min Coverage</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-semibold">{product.name}</td>
                      <td className="py-3 hidden sm:table-cell text-sm text-gray-600">
                        {product.description?.substring(0, 40)}...
                      </td>
                      <td className="py-3 font-bold text-primary">${product.basePrice}</td>
                      <td className="py-3 hidden md:table-cell text-sm">${product.minCoverage}</td>
                      <td className="py-3 flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="btn-secondary text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="btn-danger text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
