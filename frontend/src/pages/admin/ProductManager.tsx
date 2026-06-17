import React, { useState, useEffect } from 'react';
import { productApi, menuApi, uploadApi } from '../../utils/api';
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  Image as ImageIcon,
  Search,
  Sliders,
  DollarSign,
  Tag,
  Package,
  Layers,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';

interface MenuItemData {
  _id: string;
  title: string;
  slug: string;
  columns: Column[];
  images: any[];
}

interface Column {
  _id: string;
  heading: string;
  items: ColumnItem[];
}

interface ColumnItem {
  _id: string;
  label: string;
  link: string;
}

interface ProductData {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  inventory: number;
  menuItem: string | MenuItemData | null;
  columnId: string | null;
  subMenuItemId: string | null;
  isActive: boolean;
  createdAt: string;
  tag?: string;
}

export const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductData | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [inventory, setInventory] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [inStock, setInStock] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [tag, setTag] = useState('');

  // Categorization Form State
  const [selectedMenuId, setSelectedMenuId] = useState('');
  const [selectedColumnId, setSelectedColumnId] = useState('');
  const [selectedSubMenuId, setSelectedSubMenuId] = useState('');

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [menuFilter, setMenuFilter] = useState('');

  // UI States
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Available standard sizes helper
  const commonSizes = ['Free Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, menuRes] = await Promise.all([
        productApi.getAllProductsAdmin(),
        menuApi.getAllMenuItems()
      ]);

      if (productsRes.success) {
        setProducts(productsRes.data || []);
      }
      if (menuRes.success) {
        setMenuItems(menuRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Failed to load products and menus', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditProduct(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setPrice('');
    setCompareAtPrice('');
    setInventory('10');
    setIsActive(true);
    setInStock(true);
    setImages([]);
    setSizes(['Free Size']);
    setColors([]);
    setTag('');
    setSelectedMenuId('');
    setSelectedColumnId('');
    setSelectedSubMenuId('');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (product: ProductData) => {
    setEditProduct(product);
    setTitle(product.title);
    setSlug(product.slug);
    setDescription(product.description || '');
    setPrice(String(product.price));
    setCompareAtPrice(product.compareAtPrice ? String(product.compareAtPrice) : '');
    setInventory(String(product.inventory));
    setIsActive(product.isActive);
    setInStock(product.inStock);
    setImages(product.images || []);
    setSizes(product.sizes || []);
    setColors(product.colors || []);
    setTag(product.tag || '');

    // Resolve categorization
    const menuId = typeof product.menuItem === 'object' && product.menuItem
      ? product.menuItem._id
      : (product.menuItem as string || '');

    setSelectedMenuId(menuId);
    setSelectedColumnId(product.columnId || '');
    setSelectedSubMenuId(product.subMenuItemId || '');
    setIsModalOpen(true);
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadApi.uploadImage(file);
        if (res.success && res.imageUrl) {
          uploadedUrls.push(res.imageUrl);
        } else {
          showToast(res.message || 'Image upload failed', 'error');
        }
      }
      setImages(prev => [...prev, ...uploadedUrls]);
      showToast(`Successfully uploaded ${uploadedUrls.length} image(s)`);
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Error uploading image', 'error');
    } finally {
      setUploadingImage(false);
      // Reset file input value
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
  };

  // Sizes management
  const addSize = (size: string) => {
    const formatted = size.trim().toUpperCase();
    if (formatted && !sizes.includes(formatted)) {
      setSizes(prev => [...prev, formatted]);
    }
    setNewSize('');
  };

  const removeSize = (sizeToRemove: string) => {
    setSizes(prev => prev.filter(size => size !== sizeToRemove));
  };

  // Colors management
  const addColor = () => {
    const formatted = newColor.trim();
    if (formatted && !colors.includes(formatted)) {
      setColors(prev => [...prev, formatted]);
    }
    setNewColor('');
  };

  const removeColor = (colorToRemove: string) => {
    setColors(prev => prev.filter(color => color !== colorToRemove));
  };

  // Save Product (Submit Create/Edit Form)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Product title is required', 'error');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }

    const inventoryNum = parseInt(inventory);

    const productPayload = {
      title,
      slug: slug.trim() || undefined,
      description,
      price: priceNum,
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
      images,
      sizes,
      colors,
      isActive,
      inStock: inventoryNum > 0 ? inStock : false,
      inventory: isNaN(inventoryNum) ? 0 : inventoryNum,
      menuItem: selectedMenuId || null,
      columnId: selectedColumnId || null,
      subMenuItemId: selectedSubMenuId || null,
      tag: tag.trim() || null
    };

    setActionLoading(true);
    try {
      let res;
      if (editProduct) {
        res = await productApi.updateProduct(editProduct._id, productPayload);
        if (res.success) {
          showToast('Product updated successfully');
          setProducts(prev => prev.map(p => p._id === editProduct._id ? res.data : p));
          setIsModalOpen(false);
        } else {
          showToast(res.message || 'Error updating product', 'error');
        }
      } else {
        res = await productApi.createProduct(productPayload);
        if (res.success) {
          showToast('Product created successfully');
          setProducts(prev => [res.data, ...prev]);
          setIsModalOpen(false);
        } else {
          showToast(res.message || 'Error creating product', 'error');
        }
      }
    } catch (error) {
      console.error('Submit product error:', error);
      showToast('Network error saving product', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    setActionLoading(true);
    try {
      const res = await productApi.deleteProduct(id);
      if (res.success) {
        showToast('Product deleted successfully');
        setProducts(prev => prev.filter(p => p._id !== id));
      } else {
        showToast(res.message || 'Failed to delete product', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Error deleting product', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Quick toggle active status
  const handleToggleActive = async (product: ProductData) => {
    try {
      const res = await productApi.updateProduct(product._id, { isActive: !product.isActive });
      if (res.success) {
        setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isActive: res.data.isActive } : p));
        showToast(`Product set to ${res.data.isActive ? 'Active' : 'Inactive'}`);
      } else {
        showToast('Failed to update product state', 'error');
      }
    } catch (error) {
      console.error('Toggle active error:', error);
    }
  };

  // Resolve Names for table rendering
  const getMenuDetails = (product: ProductData) => {
    const menuObj = menuItems.find(m => {
      const menuId = typeof product.menuItem === 'object' && product.menuItem
        ? product.menuItem._id
        : product.menuItem;
      return m._id === menuId;
    });

    if (!menuObj) return null;

    const columnObj = menuObj.columns?.find(c => c._id === product.columnId);

    // Match subMenuItemId (which is now a slug) with the slug extracted from link
    const subMenuItemObj = columnObj?.items?.find(i => {
      const linkParts = i.link?.split('/').filter(Boolean);
      const itemSlug = linkParts?.[linkParts.length - 1] || '';
      return itemSlug === product.subMenuItemId;
    });

    return {
      menuTitle: menuObj.title,
      columnHeading: columnObj?.heading,
      subMenuLabel: subMenuItemObj?.label
    };
  };

  // Helpers for category tree navigation within form
  const selectedMenu = menuItems.find(item => item._id === selectedMenuId);
  const selectedColumn = selectedMenu?.columns?.find(col => col._id === selectedColumnId);

  // Filter products by query & categories
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const menuId = typeof p.menuItem === 'object' && p.menuItem ? p.menuItem._id : p.menuItem;
    const matchesMenuFilter = !menuFilter || menuId === menuFilter;

    return matchesSearch && matchesMenuFilter;
  });

  return (
    <div className="space-y-6 font-['Poppins']">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center px-6 py-3 rounded-lg shadow-xl text-white transition-all transform duration-300 ${toast.type === 'error' ? 'bg-red-600' : 'bg-neutral-900'
          }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#212121]">Products</h1>
          <p className="text-sm text-gray-500">Add, edit and organize luxury catalog items linked to navigation menus</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center px-5 py-2.5 bg-[#212121] hover:bg-neutral-800 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200"
        >
          <Plus size={16} className="mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters Panel */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#212121] focus:border-[#212121] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Sliders size={16} className="text-gray-400 hidden sm:block" />
          <select
            value={menuFilter}
            onChange={(e) => setMenuFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#212121] focus:border-[#212121] transition-all"
          >
            <option value="">All Menu Links</option>
            {menuItems.map(m => (
              <option key={m._id} value={m._id}>{m.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={32} className="animate-spin text-neutral-800" />
            <span className="text-sm text-gray-500">Loading catalog items...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-sm font-semibold text-gray-800">No products found</h3>
            <p className="text-xs text-gray-500 mt-1">Try adding a new product or altering filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Navigation Linkage</th>
                  <th className="py-4 px-6">Inventory</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredProducts.map(product => {
                  const links = getMenuDetails(product);
                  return (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon size={18} className="text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-950 truncate max-w-[200px]" title={product.title}>
                              {product.title}
                            </h4>
                            <span className="text-xs text-gray-400 font-mono truncate block max-w-[200px]">
                              {product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">₹{product.price}</span>
                          {product.compareAtPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{product.compareAtPrice}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        {links ? (
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-600">
                            <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded font-medium">
                              {links.menuTitle}
                            </span>
                            {links.columnHeading && (
                              <>
                                <ChevronRight size={12} className="text-gray-400" />
                                <span className="bg-neutral-50 border border-neutral-150 px-2 py-0.5 rounded text-gray-600">
                                  {links.columnHeading}
                                </span>
                              </>
                            )}
                            {links.subMenuLabel && (
                              <>
                                <ChevronRight size={12} className="text-gray-400" />
                                <span className="bg-white border border-gray-200 px-2 py-0.5 rounded font-medium text-[#212121]">
                                  {links.subMenuLabel}
                                </span>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No Menu Link</span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${product.inventory > 5
                            ? 'bg-green-500'
                            : product.inventory > 0
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                            }`} />
                          <span className="font-medium text-gray-700">
                            {product.inventory} items
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className="focus:outline-none transition-opacity hover:opacity-85"
                          title="Toggle Visibility"
                        >
                          {product.isActive ? (
                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                              <Eye size={12} /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-gray-150 text-gray-500 px-2.5 py-0.5 rounded-full text-xs font-medium">
                              <EyeOff size={12} /> Inactive
                            </span>
                          )}
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 hover:bg-neutral-100 text-gray-600 hover:text-black rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id, product.title)}
                            disabled={actionLoading}
                            className="p-1.5 hover:bg-red-50 text-gray-450 hover:text-red-650 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-out Panel / Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-gray-150 flex items-center justify-between bg-neutral-50">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editProduct ? 'Edit Product Details' : 'Create New Product'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Define your inventory, media and menu association</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-200 text-gray-500 hover:text-black rounded-full transition-colors focus:outline-none"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* 1. Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-gray-450 uppercase tracking-wider border-b border-gray-100 pb-1.5">
                    Basic Info
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Product Title *</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          if (!editProduct) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                        }}
                        placeholder="e.g. Classic Silk Sari"
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#212121] focus:border-[#212121]"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">URL Slug (leave blank to auto-generate)</label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="e.g. classic-silk-sari"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#212121] focus:border-[#212121]"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Product Tag (e.g. New Season, Limited Edition)</label>
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        placeholder="e.g. New Season"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#212121] focus:border-[#212121]"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Describe the material, fit, and elegance of this designer piece..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#212121] focus:border-[#212121]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Pricing & Inventory */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-gray-450 uppercase tracking-wider border-b border-gray-100 pb-1.5">
                    Pricing & Inventory
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Price (INR) *</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">₹</span>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="8500"
                          min="0"
                          required
                          className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#212121] focus:border-[#212121]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Compare At Price</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">₹</span>
                        <input
                          type="number"
                          value={compareAtPrice}
                          onChange={(e) => setCompareAtPrice(e.target.value)}
                          placeholder="12000"
                          min="0"
                          className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#212121] focus:border-[#212121]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Stock Level</label>
                      <input
                        type="number"
                        value={inventory}
                        onChange={(e) => setInventory(e.target.value)}
                        placeholder="10"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#212121] focus:border-[#212121]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Media Files */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-gray-450 uppercase tracking-wider border-b border-gray-100 pb-1.5 flex items-center justify-between">
                    <span>Media Uploads</span>
                    <span className="text-[10px] lowercase text-gray-400">supports multi-select</span>
                  </h3>

                  <div className="grid grid-cols-4 gap-3">
                    {images.map((url, idx) => (
                      <div key={idx} className="relative aspect-[3/4] bg-neutral-50 border border-gray-150 rounded-lg overflow-hidden group">
                        <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/40 px-1 rounded text-[9px] text-white">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}

                    <label className="relative aspect-[3/4] border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-gray-50/50">
                      {uploadingImage ? (
                        <>
                          <Loader2 size={24} className="animate-spin text-gray-400 mb-1" />
                          <span className="text-[10px] text-gray-500 text-center px-1">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={24} className="text-gray-400 mb-1" />
                          <span className="text-[10px] font-medium text-gray-550 text-center px-1">Add Image(s)</span>
                        </>
                      )}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* 4. Categorization (Hierarchical Selectors) */}
                <div className="space-y-4 bg-neutral-50/70 p-4 rounded-xl border border-gray-150">
                  <h3 className="text-xs font-semibold text-[#212121] uppercase tracking-wider flex items-center gap-1.5 pb-1">
                    <Layers size={14} className="text-gray-500" /> Catalog Categorization
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Selector 1: Top-Level MenuItem */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Top-level Menu Link</label>
                      <select
                        value={selectedMenuId}
                        onChange={(e) => {
                          setSelectedMenuId(e.target.value);
                          setSelectedColumnId('');
                          setSelectedSubMenuId('');
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#212121]"
                      >
                        <option value="">-- Select Menu --</option>
                        {menuItems.map(item => (
                          <option key={item._id} value={item._id}>{item.title}</option>
                        ))}
                      </select>
                    </div>

                    {/* Selector 2: Columns (Heading) */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Column Heading Section</label>
                      <select
                        value={selectedColumnId}
                        onChange={(e) => {
                          setSelectedColumnId(e.target.value);
                          setSelectedSubMenuId('');
                        }}
                        disabled={!selectedMenuId}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#212121] disabled:bg-gray-100 disabled:opacity-60"
                      >
                        <option value="">-- Select Column --</option>
                        {selectedMenu?.columns?.map(col => (
                          <option key={col._id} value={col._id}>{col.heading}</option>
                        ))}
                      </select>
                    </div>

                    {/* Selector 3: SubMenu Items */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Submenu Link Item</label>
                      <select
                        value={selectedSubMenuId}
                        onChange={(e) => setSelectedSubMenuId(e.target.value)}
                        disabled={!selectedColumnId}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#212121] disabled:bg-gray-100 disabled:opacity-60"
                      >
                        <option value="">-- Select Submenu --</option>
                        {selectedColumn?.items?.map(sub => {
                          // Extract slug from link (e.g., "/shop/flora" -> "flora")
                          const linkParts = sub.link?.split('/').filter(Boolean);
                          const itemSlug = linkParts?.[linkParts.length - 1] || '';
                          return (
                            <option key={sub._id} value={itemSlug}>{sub.label}</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-450 mt-1">
                    Associating items correctly will render them on specific Category / Collection landing grids.
                  </p>
                </div>

                {/* 5. Variant Attributes (Sizes & Colors) */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Sizes Variant */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-gray-650 uppercase tracking-wide">
                      Sizes / Dimensions
                    </label>

                    {/* Common Sizes tags wrapper */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {commonSizes.map(s => {
                        const hasSize = sizes.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => hasSize ? removeSize(s) : addSize(s)}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${hasSize
                              ? 'bg-[#212121] text-white border-[#212121]'
                              : 'bg-white text-gray-650 border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSize}
                        onChange={(e) => setNewSize(e.target.value)}
                        placeholder="Add custom size (e.g. S-M)"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize(newSize))}
                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => addSize(newSize)}
                        className="px-3 bg-neutral-200 hover:bg-neutral-300 text-xs font-medium rounded-lg"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {sizes.map(s => (
                        <span key={s} className="inline-flex items-center bg-gray-100 text-[#212121] px-2.5 py-0.5 rounded text-xs">
                          {s}
                          <button type="button" onClick={() => removeSize(s)} className="ml-1 text-gray-450 hover:text-black">
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Colors Variant */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-gray-650 uppercase tracking-wide">
                      Color Shades
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        placeholder="e.g. Emerald Green, Charcoal"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addColor}
                        className="px-3 bg-neutral-200 hover:bg-neutral-300 text-xs font-medium rounded-lg"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {colors.map(color => (
                        <span key={color} className="inline-flex items-center bg-gray-100 text-[#212121] px-2.5 py-0.5 rounded text-xs">
                          {color}
                          <button type="button" onClick={() => removeColor(color)} className="ml-1 text-gray-450 hover:text-black">
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 6. Settings (Active & Stock) */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-gray-450 uppercase tracking-wider border-b border-gray-100 pb-1.5">
                    Catalog Display Settings
                  </h3>

                  <div className="flex flex-col sm:flex-row gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="rounded border-gray-300 text-[#212121] focus:ring-[#212121] h-4 w-4"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-950 block">Active Status</span>
                        <span className="text-[10px] text-gray-500">Enable to show product on the storefront</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                        className="rounded border-gray-300 text-[#212121] focus:ring-[#212121] h-4 w-4"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-950 block">In Stock</span>
                        <span className="text-[10px] text-gray-500">Show as purchaseable vs "Sold Out" badge</span>
                      </div>
                    </label>
                  </div>
                </div>

              </form>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-150 flex items-center justify-end gap-3 bg-neutral-50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#212121] hover:bg-neutral-800 text-white text-sm font-medium rounded-lg shadow-sm transition-colors focus:outline-none flex items-center"
                >
                  {actionLoading && <Loader2 size={16} className="animate-spin mr-2" />}
                  {editProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
