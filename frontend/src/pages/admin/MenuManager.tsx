import { useEffect, useState } from 'react';
import { menuApi, uploadApi } from '../../utils/api';
import { Plus, Trash2, Edit2, Upload, ChevronUp, ChevronDown } from 'lucide-react';

interface ColumnItem {
  label: string;
  link: string;
  order: number;
}

interface Column {
  heading: string;
  order: number;
  items: ColumnItem[];
}

interface Image {
  imageUrl: string;
  imageTitle: string;
  order: number;
}

interface MenuItem {
  _id: string;
  title: string;
  slug: string;
  order: number;
  isActive: boolean;
  columns: Column[];
  images: Image[];
}

export const MenuManager = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', slug: '', order: 0 });
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuApi.getAllMenuItems();
      if (response.success) {
        setMenuItems(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      alert('Error fetching menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await menuApi.updateMenuItem(editingItem._id, {
          title: formData.title,
          slug: formData.slug,
          order: formData.order,
          columns: editingItem.columns,
          images: editingItem.images
        });
      } else {
        await menuApi.createMenuItem({
          title: formData.title,
          slug: formData.slug,
          order: menuItems.length,
          columns: [],
          images: []
        });
      }
      fetchMenuItems();
      setShowForm(false);
      setFormData({ title: '', slug: '', order: 0 });
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Error saving menu item');
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      try {
        await menuApi.deleteMenuItem(id);
        fetchMenuItems();
        if (selectedMenuItem?._id === id) {
          setSelectedMenuItem(null);
        }
      } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Error deleting menu item');
      }
    }
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({ title: item.title, slug: item.slug, order: item.order });
    setShowForm(true);
  };

  const handleAddColumn = () => {
    if (!selectedMenuItem) return;
    const newColumn: Column = {
      heading: 'New Column',
      order: (selectedMenuItem.columns?.length || 0),
      items: []
    };
    setSelectedMenuItem({
      ...selectedMenuItem,
      columns: [...(selectedMenuItem.columns || []), newColumn]
    });
  };

  const handleAddColumnItem = (columnIndex: number) => {
    if (!selectedMenuItem) return;
    const newItem: ColumnItem = {
      label: 'New Item',
      link: '#',
      order: (selectedMenuItem.columns?.[columnIndex]?.items?.length || 0)
    };
    const updatedColumns = [...selectedMenuItem.columns];
    updatedColumns[columnIndex].items = [...(updatedColumns[columnIndex].items || []), newItem];
    setSelectedMenuItem({ ...selectedMenuItem, columns: updatedColumns });
  };

  const handleUpdateColumn = (columnIndex: number, field: string, value: string | number) => {
    if (!selectedMenuItem) return;
    const updatedColumns = [...selectedMenuItem.columns];
    (updatedColumns[columnIndex] as any)[field] = value;
    setSelectedMenuItem({ ...selectedMenuItem, columns: updatedColumns });
  };

  const handleUpdateColumnItem = (columnIndex: number, itemIndex: number, field: string, value: string | number) => {
    if (!selectedMenuItem) return;
    const updatedColumns = [...selectedMenuItem.columns];
    (updatedColumns[columnIndex].items[itemIndex] as any)[field] = value;
    setSelectedMenuItem({ ...selectedMenuItem, columns: updatedColumns });
  };

  const handleDeleteColumn = (columnIndex: number) => {
    if (!selectedMenuItem) return;
    setSelectedMenuItem({
      ...selectedMenuItem,
      columns: selectedMenuItem.columns.filter((_, i) => i !== columnIndex)
    });
  };

  const handleDeleteColumnItem = (columnIndex: number, itemIndex: number) => {
    if (!selectedMenuItem) return;
    const updatedColumns = [...selectedMenuItem.columns];
    updatedColumns[columnIndex].items = updatedColumns[columnIndex].items.filter((_, i) => i !== itemIndex);
    setSelectedMenuItem({ ...selectedMenuItem, columns: updatedColumns });
  };

  const handleMoveColumn = (columnIndex: number, direction: 'up' | 'down') => {
    if (!selectedMenuItem) return;
    const newColumns = [...selectedMenuItem.columns];
    if (direction === 'up' && columnIndex > 0) {
      [newColumns[columnIndex], newColumns[columnIndex - 1]] = [newColumns[columnIndex - 1], newColumns[columnIndex]];
      newColumns.forEach((col, idx) => col.order = idx);
    } else if (direction === 'down' && columnIndex < newColumns.length - 1) {
      [newColumns[columnIndex], newColumns[columnIndex + 1]] = [newColumns[columnIndex + 1], newColumns[columnIndex]];
      newColumns.forEach((col, idx) => col.order = idx);
    }
    setSelectedMenuItem({ ...selectedMenuItem, columns: newColumns });
  };

  const handleMoveColumnItem = (columnIndex: number, itemIndex: number, direction: 'up' | 'down') => {
    if (!selectedMenuItem) return;
    const updatedColumns = [...selectedMenuItem.columns];
    const items = [...updatedColumns[columnIndex].items];
    if (direction === 'up' && itemIndex > 0) {
      [items[itemIndex], items[itemIndex - 1]] = [items[itemIndex - 1], items[itemIndex]];
      items.forEach((item, idx) => item.order = idx);
    } else if (direction === 'down' && itemIndex < items.length - 1) {
      [items[itemIndex], items[itemIndex + 1]] = [items[itemIndex + 1], items[itemIndex]];
      items.forEach((item, idx) => item.order = idx);
    }
    updatedColumns[columnIndex].items = items;
    setSelectedMenuItem({ ...selectedMenuItem, columns: updatedColumns });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedMenuItem) return;

    try {
      setUploadingImage(true);
      console.log('Uploading image:', file.name);
      const result = await uploadApi.uploadImage(file);
      console.log('Upload result:', result);

      if (result.success && result.imageUrl) {
        const newImage: Image = {
          imageUrl: result.imageUrl,
          imageTitle: 'New Image',
          order: (selectedMenuItem.images?.length || 0)
        };
        setSelectedMenuItem({
          ...selectedMenuItem,
          images: [...(selectedMenuItem.images || []), newImage]
        });
        alert('Image uploaded successfully! Remember to save the menu item.');
      } else {
        alert('Upload failed: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + (error as any).message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = (imageIndex: number) => {
    if (!selectedMenuItem) return;
    setSelectedMenuItem({
      ...selectedMenuItem,
      images: selectedMenuItem.images.filter((_, i) => i !== imageIndex)
    });
  };

  const handleSaveMenuItem = async () => {
    if (!selectedMenuItem) return;
    try {
      console.log('Saving menu item:', selectedMenuItem);
      const updateData = {
        title: selectedMenuItem.title,
        slug: selectedMenuItem.slug,
        order: selectedMenuItem.order,
        isActive: selectedMenuItem.isActive,
        columns: selectedMenuItem.columns || [],
        images: selectedMenuItem.images || []
      };
      console.log('Update payload:', updateData);

      const result = await menuApi.updateMenuItem(selectedMenuItem._id, updateData);
      console.log('Update result:', result);

      if (result.success) {
        alert('Menu item updated successfully!');
        await fetchMenuItems();
        setSelectedMenuItem(null);
      } else {
        alert('Error: ' + (result.message || 'Failed to update'));
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Error saving menu item: ' + (error as any).message);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading menu items...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Menu Manager</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
            setFormData({ title: '', slug: '', order: 0 });
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} className="mr-2" />
          Add Menu Item
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>
          <form onSubmit={handleAddMenuItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g., Shop"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                placeholder="e.g., shop"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Items List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Menu Items</h2>
          <div className="bg-white rounded-lg shadow p-4 space-y-2 max-h-96 overflow-y-auto">
            {menuItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No menu items yet</p>
            ) : (
              menuItems.map((item) => (
                <div
                  key={item._id}
                  className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${selectedMenuItem?._id === item._id
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex-1 min-w-0"
                      onClick={() => setSelectedMenuItem(item)}
                    >
                      <p className="font-semibold text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">/{item.slug}</p>
                      <p className="text-xs text-gray-400">{item.columns?.length || 0} columns</p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => handleEditMenuItem(item)}
                        className="p-1 hover:bg-blue-200 rounded transition"
                        title="Edit"
                      >
                        <Edit2 size={16} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteMenuItem(item._id)}
                        className="p-1 hover:bg-red-200 rounded transition"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Editor Panel */}
        {selectedMenuItem && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900">{selectedMenuItem.title} - Columns & Items</h2>

              {/* Columns Section */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Columns</h3>
                  <button
                    onClick={handleAddColumn}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Column
                  </button>
                </div>

                {selectedMenuItem.columns?.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No columns yet. Add one to get started!</p>
                ) : (
                  <div className="space-y-4">
                    {selectedMenuItem.columns?.map((column, colIndex) => (
                      <div key={colIndex} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Column Heading</label>
                            <input
                              type="text"
                              placeholder="e.g., Categories"
                              value={column.heading}
                              onChange={(e) => handleUpdateColumn(colIndex, 'heading', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex gap-1 ml-2">
                            <button
                              onClick={() => handleMoveColumn(colIndex, 'up')}
                              disabled={colIndex === 0}
                              className="px-2 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
                              title="Move up"
                            >
                              <ChevronUp size={18} />
                            </button>
                            <button
                              onClick={() => handleMoveColumn(colIndex, 'down')}
                              disabled={colIndex === selectedMenuItem.columns.length - 1}
                              className="px-2 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
                              title="Move down"
                            >
                              <ChevronDown size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteColumn(colIndex)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                              title="Delete column"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Column Items */}
                        <div className="space-y-2 mb-3">
                          <label className="block text-sm font-medium text-gray-700">Items in this column:</label>
                          {column.items?.length === 0 ? (
                            <p className="text-gray-500 text-sm py-2">No items yet</p>
                          ) : (
                            column.items?.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex gap-2 bg-white p-2 rounded-lg border border-gray-200">
                                <input
                                  type="text"
                                  placeholder="Label"
                                  value={item.label}
                                  onChange={(e) => handleUpdateColumnItem(colIndex, itemIndex, 'label', e.target.value)}
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  placeholder="Link"
                                  value={item.link}
                                  onChange={(e) => handleUpdateColumnItem(colIndex, itemIndex, 'link', e.target.value)}
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                  onClick={() => handleMoveColumnItem(colIndex, itemIndex, 'up')}
                                  disabled={itemIndex === 0}
                                  className="px-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
                                  title="Move up"
                                >
                                  ↑
                                </button>
                                <button
                                  onClick={() => handleMoveColumnItem(colIndex, itemIndex, 'down')}
                                  disabled={itemIndex === column.items.length - 1}
                                  className="px-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
                                  title="Move down"
                                >
                                  ↓
                                </button>
                                <button
                                  onClick={() => handleDeleteColumnItem(colIndex, itemIndex)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                                  title="Delete item"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                        <button
                          onClick={() => handleAddColumnItem(colIndex)}
                          className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                        >
                          + Add Item to Column
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Images Section */}
              <div className="space-y-4 mb-6 border-t pt-6">
                <h3 className="font-bold text-gray-900">Mega Menu Images (Right Side)</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                  <label className="cursor-pointer flex flex-col items-center">
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <span className="text-gray-600 font-medium">
                      {uploadingImage ? 'Uploading...' : 'Click to upload image'}
                    </span>
                    <span className="text-gray-500 text-sm mt-1">PNG, JPG up to 10MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {selectedMenuItem.images?.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No images yet</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedMenuItem.images?.map((image, imgIndex) => (
                      <div key={imgIndex} className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                        <img
                          src={image.imageUrl}
                          alt={image.imageTitle}
                          className="w-full h-40 object-cover"
                        />
                        <input
                          type="text"
                          placeholder="Image title"
                          value={image.imageTitle}
                          onChange={(e) => {
                            const updatedImages = [...selectedMenuItem.images];
                            updatedImages[imgIndex].imageTitle = e.target.value;
                            setSelectedMenuItem({ ...selectedMenuItem, images: updatedImages });
                          }}
                          className="w-full px-2 py-1 border-t border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleDeleteImage(imgIndex)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                          title="Delete image"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 border-t pt-6">
                <button
                  onClick={handleSaveMenuItem}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setSelectedMenuItem(null)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
