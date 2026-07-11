import { useEffect, useState } from 'react';
import { menuApi, uploadApi } from '../../utils/api';
import { Plus, Trash2, Edit2, Upload, ChevronUp, ChevronDown, Save, X } from 'lucide-react';

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
  link?: string;
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
  const [activeTab, setActiveTab] = useState<'columns' | 'images'>('columns');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(false);
      const response = await menuApi.getAllMenuItems();
      if (response.success) {
        setMenuItems(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      showToast('Error fetching menu items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
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
        showToast('Menu item updated successfully', 'success');
      } else {
        await menuApi.createMenuItem({
          title: formData.title,
          slug: formData.slug,
          order: menuItems.length,
          columns: [],
          images: []
        });
        showToast('Menu item created successfully', 'success');
      }
      fetchMenuItems();
      setShowForm(false);
      setFormData({ title: '', slug: '', order: 0 });
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving menu item:', error);
      showToast('Error saving menu item', 'error');
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Are you sure? This cannot be undone.')) return;
    try {
      await menuApi.deleteMenuItem(id);
      fetchMenuItems();
      if (selectedMenuItem?._id === id) {
        setSelectedMenuItem(null);
      }
      showToast('Menu item deleted', 'success');
    } catch (error) {
      console.error('Error deleting menu item:', error);
      showToast('Error deleting menu item', 'error');
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
      const result = await uploadApi.uploadImage(file);

      if (result.success && result.imageUrl) {
        const newImage: Image = {
          imageUrl: result.imageUrl,
          imageTitle: 'New Image',
          link: '',
          order: (selectedMenuItem.images?.length || 0)
        };
        setSelectedMenuItem({
          ...selectedMenuItem,
          images: [...(selectedMenuItem.images || []), newImage]
        });
        showToast('Image uploaded successfully', 'success');
      } else {
        showToast('Upload failed', 'error');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Error uploading image', 'error');
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
      const updateData = {
        title: selectedMenuItem.title,
        slug: selectedMenuItem.slug,
        order: selectedMenuItem.order,
        isActive: selectedMenuItem.isActive,
        columns: selectedMenuItem.columns || [],
        images: selectedMenuItem.images || []
      };

      const result = await menuApi.updateMenuItem(selectedMenuItem._id, updateData);

      if (result.success) {
        showToast('Menu item saved successfully', 'success');
        await fetchMenuItems();
        setSelectedMenuItem(null);
      } else {
        showToast('Error saving menu item', 'error');
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      showToast('Error saving menu item', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E8E8E8] border-t-[#212121] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[13px] text-[#666]">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Poppins']">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 px-4 py-3 rounded-lg text-[13px] font-medium z-50 animate-in fade-in slide-in-from-right ${
          toast.type === 'success'
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#212121]">Menu Manager</h1>
          <p className="text-[13px] text-[#666] mt-1">Create and manage navigation menus</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
            setFormData({ title: '', slug: '', order: 0 });
          }}
          className="flex items-center justify-center px-4 py-2.5 bg-[#212121] hover:bg-black text-white rounded-lg transition-all text-[12px] font-semibold tracking-[0.05em]"
        >
          <Plus size={18} className="mr-2" />
          ADD MENU ITEM
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4 pt-8">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-[500px] mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[16px] font-bold text-[#212121]">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="p-1.5 hover:bg-[#F5F5F5] rounded-full transition-colors"
              >
                <X size={20} className="text-[#666]" />
              </button>
            </div>

            <form onSubmit={handleAddMenuItem} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.1em] text-[#999] font-semibold mb-2">Title</label>
                <input
                  type="text"
                  placeholder="e.g., Shop"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#D8D8D8] bg-white rounded-lg text-[13px] focus:border-[#212121] focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.1em] text-[#999] font-semibold mb-2">Slug</label>
                <input
                  type="text"
                  placeholder="e.g., shop"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#D8D8D8] bg-white rounded-lg text-[13px] focus:border-[#212121] focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.1em] text-[#999] font-semibold mb-2">Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-[#D8D8D8] bg-white rounded-lg text-[13px] focus:border-[#212121] focus:outline-none transition-colors"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-[#F0F0F0]">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#212121] text-white rounded-lg hover:bg-black transition-colors text-[12px] font-semibold tracking-[0.05em]"
                >
                  SAVE
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-[#D8D8D8] text-[#212121] rounded-lg hover:bg-[#F5F5F5] transition-colors text-[12px] font-semibold tracking-[0.05em]"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Items Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-[#E8E8E8] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E8E8E8] bg-[#F9F9F9]">
              <p className="text-[12px] uppercase tracking-[0.1em] text-[#999] font-semibold">
                Menu Items ({menuItems.length})
              </p>
            </div>
            <div className="divide-y divide-[#F0F0F0] max-h-[600px] overflow-y-auto">
              {menuItems.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-[13px] text-[#999]">No menu items yet</p>
                </div>
              ) : (
                menuItems.map((item) => (
                  <div
                    key={item._id}
                    className={`p-4 cursor-pointer transition-all border-l-4 ${
                      selectedMenuItem?._id === item._id
                        ? 'bg-neutral-100 border-l-[#212121]'
                        : 'bg-white border-l-transparent hover:bg-[#F9F9F9]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1" onClick={() => setSelectedMenuItem(item)}>
                        <p className="text-[13px] font-semibold text-[#212121]">{item.title}</p>
                        <p className="text-[11px] text-[#999]">/{item.slug}</p>
                        <p className="text-[10px] text-[#CCC] mt-1">{item.columns?.length || 0} columns · {item.images?.length || 0} images</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditMenuItem(item)}
                          className="p-1.5 hover:bg-blue-100 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(item._id)}
                          className="p-1.5 hover:bg-red-100 rounded transition-colors"
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
        </div>

        {/* Editor Panel */}
        {selectedMenuItem ? (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-[#E8E8E8] overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#E8E8E8] bg-[#F9F9F9] flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-[#212121]">
                  {selectedMenuItem.title}
                </h2>
                <button
                  onClick={() => setSelectedMenuItem(null)}
                  className="p-1.5 hover:bg-[#E8E8E8] rounded-full transition-colors"
                >
                  <X size={18} className="text-[#666]" />
                </button>
              </div>

              {/* Tabs */}
              <div className="px-6 pt-4 border-b border-[#E8E8E8] flex gap-6">
                <button
                  onClick={() => setActiveTab('columns')}
                  className={`pb-3 text-[12px] font-semibold uppercase tracking-[0.05em] transition-colors border-b-2 ${
                    activeTab === 'columns'
                      ? 'text-[#212121] border-b-[#212121]'
                      : 'text-[#999] border-b-transparent hover:text-[#555]'
                  }`}
                >
                  Columns ({selectedMenuItem.columns?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('images')}
                  className={`pb-3 text-[12px] font-semibold uppercase tracking-[0.05em] transition-colors border-b-2 ${
                    activeTab === 'images'
                      ? 'text-[#212121] border-b-[#212121]'
                      : 'text-[#999] border-b-transparent hover:text-[#555]'
                  }`}
                >
                  Images ({selectedMenuItem.images?.length || 0})
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'columns' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-[12px] uppercase tracking-[0.1em] text-[#999] font-semibold">Menu Columns</p>
                      <button
                        onClick={handleAddColumn}
                        className="flex items-center px-3 py-2 border border-[#212121] text-[#212121] hover:bg-[#212121] hover:text-white rounded-lg transition-colors text-[11px] font-semibold bg-white"
                      >
                        <Plus size={16} className="mr-1" />
                        ADD
                      </button>
                    </div>

                    {selectedMenuItem.columns?.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-[13px] text-[#999]">No columns yet. Add one to get started!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedMenuItem.columns?.map((column, colIndex) => (
                          <div key={colIndex} className="border border-[#E8E8E8] rounded-lg p-4 bg-[#F9F9F9]">
                            <div className="flex items-center gap-3 mb-4">
                              <input
                                type="text"
                                placeholder="Column heading"
                                value={column.heading}
                                onChange={(e) => handleUpdateColumn(colIndex, 'heading', e.target.value)}
                                className="flex-1 px-3 py-2 border border-[#D8D8D8] bg-white rounded-lg text-[12px] focus:border-[#212121] focus:outline-none"
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleMoveColumn(colIndex, 'up')}
                                  disabled={colIndex === 0}
                                  className="p-2 hover:bg-[#E8E8E8] rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                  title="Move up"
                                >
                                  <ChevronUp size={16} className="text-[#666]" />
                                </button>
                                <button
                                  onClick={() => handleMoveColumn(colIndex, 'down')}
                                  disabled={colIndex === selectedMenuItem.columns.length - 1}
                                  className="p-2 hover:bg-[#E8E8E8] rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                  title="Move down"
                                >
                                  <ChevronDown size={16} className="text-[#666]" />
                                </button>
                                <button
                                  onClick={() => handleDeleteColumn(colIndex)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            {/* Column Items */}
                            <div className="space-y-2 mb-4">
                              <p className="text-[11px] uppercase tracking-[0.1em] text-[#999] font-semibold">Items ({column.items?.length || 0})</p>
                              {column.items?.length === 0 ? (
                                <p className="text-[12px] text-[#CCC] py-2">No items yet</p>
                              ) : (
                                column.items?.map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex gap-2 bg-white p-2 rounded-lg border border-[#D8D8D8]">
                                    <input
                                      type="text"
                                      placeholder="Label"
                                      value={item.label}
                                      onChange={(e) => handleUpdateColumnItem(colIndex, itemIndex, 'label', e.target.value)}
                                      className="flex-1 px-2 py-1.5 border border-[#D8D8D8] rounded text-[11px] focus:border-[#212121] focus:outline-none bg-white"
                                    />
                                    <input
                                      type="text"
                                      placeholder="URL"
                                      value={item.link}
                                      onChange={(e) => handleUpdateColumnItem(colIndex, itemIndex, 'link', e.target.value)}
                                      className="flex-1 px-2 py-1.5 border border-[#D8D8D8] rounded text-[11px] focus:border-[#212121] focus:outline-none bg-white"
                                    />
                                    <button
                                      onClick={() => handleMoveColumnItem(colIndex, itemIndex, 'up')}
                                      disabled={itemIndex === 0}
                                      className="px-2 hover:bg-[#F5F5F5] rounded disabled:opacity-30 transition-colors text-[12px]"
                                      title="Move up"
                                    >
                                      ↑
                                    </button>
                                    <button
                                      onClick={() => handleMoveColumnItem(colIndex, itemIndex, 'down')}
                                      disabled={itemIndex === column.items.length - 1}
                                      className="px-2 hover:bg-[#F5F5F5] rounded disabled:opacity-30 transition-colors text-[12px]"
                                      title="Move down"
                                    >
                                      ↓
                                    </button>
                                    <button
                                      onClick={() => handleDeleteColumnItem(colIndex, itemIndex)}
                                      className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>

                            <button
                              onClick={() => handleAddColumnItem(colIndex)}
                              className="text-[11px] px-3 py-1.5 border border-[#212121] text-[#212121] hover:bg-[#212121] hover:text-white rounded transition-colors font-semibold bg-white"
                            >
                              + Add Item
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'images' && (
                  <div className="space-y-4">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-[#D8D8D8] rounded-lg p-8 text-center bg-[#F9F9F9] hover:bg-[#F5F5F5] transition-colors">
                      <label className="cursor-pointer flex flex-col items-center">
                        <Upload size={32} className="text-[#CCC] mb-2" />
                        <span className="text-[13px] font-semibold text-[#555]">
                          {uploadingImage ? 'Uploading...' : 'Click to upload image'}
                        </span>
                        <span className="text-[11px] text-[#999] mt-1">PNG, JPG up to 10MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Images Grid */}
                    {(() => {
                      const availableLinks: string[] = [];
                      if (selectedMenuItem) {
                        availableLinks.push(`/${selectedMenuItem.slug}`);
                        selectedMenuItem.columns?.forEach((col) => {
                          col.items?.forEach((item) => {
                            if (item.link && !availableLinks.includes(item.link)) {
                              availableLinks.push(item.link);
                            }
                          });
                        });
                      }

                      return selectedMenuItem.images?.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-[13px] text-[#999]">No images yet</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {selectedMenuItem.images?.map((image, imgIndex) => (
                            <div key={imgIndex} className="relative bg-[#F5F5F5] rounded-lg overflow-hidden border border-[#E8E8E8] group flex flex-col justify-between">
                              <div>
                                <div className="relative">
                                  <img
                                    src={image.imageUrl}
                                    alt={image.imageTitle}
                                    className="w-full h-32 object-cover"
                                  />
                                  <button
                                    onClick={() => handleDeleteImage(imgIndex)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                                <div className="p-3 space-y-3">
                                  <div>
                                    <label className="block text-[9px] uppercase tracking-[0.05em] text-[#999] mb-1 font-semibold">Image Title</label>
                                    <input
                                      type="text"
                                      placeholder="Image title"
                                      value={image.imageTitle}
                                      onChange={(e) => {
                                        const updatedImages = [...selectedMenuItem.images];
                                        updatedImages[imgIndex].imageTitle = e.target.value;
                                        setSelectedMenuItem({ ...selectedMenuItem, images: updatedImages });
                                      }}
                                      className="w-full px-2 py-1.5 border border-[#D8D8D8] rounded text-[11px] focus:outline-none focus:ring-1 focus:ring-[#212121] bg-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] uppercase tracking-[0.05em] text-[#999] mb-1 font-semibold">Select Redirect Link</label>
                                    <select
                                      value={image.link || ''}
                                      onChange={(e) => {
                                        const updatedImages = [...selectedMenuItem.images];
                                        updatedImages[imgIndex].link = e.target.value;
                                        setSelectedMenuItem({ ...selectedMenuItem, images: updatedImages });
                                      }}
                                      className="w-full px-2 py-1.5 border border-[#D8D8D8] rounded text-[11px] focus:outline-none bg-white"
                                    >
                                      <option value="">No Redirect Link</option>
                                      {availableLinks.map((linkOption) => (
                                        <option key={linkOption} value={linkOption}>
                                          {linkOption}
                                        </option>
                                      ))}
                                      {image.link && !availableLinks.includes(image.link) && (
                                        <option value={image.link}>{image.link} (Custom)</option>
                                      )}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] uppercase tracking-[0.05em] text-[#999] mb-1 font-semibold">Or Enter Custom Link</label>
                                    <input
                                      type="text"
                                      placeholder="e.g., /shop"
                                      value={image.link || ''}
                                      onChange={(e) => {
                                        const updatedImages = [...selectedMenuItem.images];
                                        updatedImages[imgIndex].link = e.target.value;
                                        setSelectedMenuItem({ ...selectedMenuItem, images: updatedImages });
                                      }}
                                      className="w-full px-2 py-1.5 border border-[#D8D8D8] rounded text-[11px] focus:outline-none bg-white"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#E8E8E8] bg-[#F9F9F9] flex gap-3">
                <button
                  onClick={handleSaveMenuItem}
                  className="flex-1 flex items-center justify-center px-4 py-2.5 bg-[#212121] hover:bg-black text-white rounded-lg transition-colors text-[12px] font-semibold tracking-[0.05em]"
                >
                  <Save size={16} className="mr-2" />
                  SAVE CHANGES
                </button>
                <button
                  onClick={() => setSelectedMenuItem(null)}
                  className="flex items-center justify-center px-4 py-2.5 border border-[#D8D8D8] text-[#212121] rounded-lg hover:bg-[#F5F5F5] transition-colors text-[12px] font-semibold tracking-[0.05em]"
                >
                  <X size={16} className="mr-2" />
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white rounded-lg border border-[#E8E8E8] p-12 text-center">
            <p className="text-[14px] text-[#999]">Select a menu item to edit</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManager;