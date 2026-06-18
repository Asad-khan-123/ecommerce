import React, { useState, useEffect } from 'react';
import { bannerApi, menuApi, uploadApi, settingsApi } from '../../utils/api';
import { Plus, Edit2, Trash2, Loader2, X, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';

interface BannerData {
  _id: string;
  desktopImage: string;
  mobileImage: string;
  link: string;
  isActive: boolean;
  createdAt: string;
}

interface ColumnItem {
  _id?: string;
  label: string;
  link: string;
}

interface Column {
  _id: string;
  heading: string;
  items: ColumnItem[];
}

interface MenuItem {
  _id: string;
  title: string;
  slug: string;
  columns?: Column[];
}

export const BannerManager: React.FC = () => {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBanner, setEditBanner] = useState<BannerData | null>(null);

  // Form State
  const [desktopImage, setDesktopImage] = useState('');
  const [mobileImage, setMobileImage] = useState('');
  const [link, setLink] = useState('');
  const [isActive, setIsActive] = useState(true);

  // UI States
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Homepage highlights state
  const [highlights, setHighlights] = useState<any[]>([
    { menuItem: '', columnId: '', subMenuItemId: '' },
    { menuItem: '', columnId: '', subMenuItemId: '' },
    { menuItem: '', columnId: '', subMenuItemId: '' },
    { menuItem: '', columnId: '', subMenuItemId: '' }
  ]);
  const [savingHighlights, setSavingHighlights] = useState(false);

  // Global product accordion defaults state
  const [defaultFabric, setDefaultFabric] = useState('');
  const [defaultSizeModel, setDefaultSizeModel] = useState('');
  const [defaultFit, setDefaultFit] = useState('');
  const [defaultShipping, setDefaultShipping] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

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
      const [bannersRes, menuRes, highlightsRes, settingsRes] = await Promise.all([
        bannerApi.getAllBannersAdmin(),
        menuApi.getAllMenuItems(),
        bannerApi.getHighlights(),
        settingsApi.getSettings()
      ]);

      if (bannersRes.success) {
        setBanners(bannersRes.data || []);
      }
      if (menuRes.success) {
        setMenuItems(menuRes.data || []);
      }
      if (highlightsRes.success && highlightsRes.data) {
        const loaded = highlightsRes.data.map((h: any) => ({
          menuItem: h.menuItem,
          columnId: h.columnId,
          subMenuItemId: h.subMenuItemId
        }));
        const padded = [...loaded];
        while (padded.length < 4) {
          padded.push({ menuItem: '', columnId: '', subMenuItemId: '' });
        }
        setHighlights(padded);
      }
      if (settingsRes.success && settingsRes.data) {
        setDefaultFabric(settingsRes.data.fabricMaterials || '');
        setDefaultSizeModel(settingsRes.data.sizeModel || '');
        setDefaultFit(settingsRes.data.fitConstruction || '');
        setDefaultShipping(settingsRes.data.shippingReturns || '');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Failed to load banners, highlights and defaults', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const payload = {
        fabricMaterials: defaultFabric,
        sizeModel: defaultSizeModel,
        fitConstruction: defaultFit,
        shippingReturns: defaultShipping
      };
      const res = await settingsApi.saveSettings(payload);
      if (res.success) {
        showToast('Global Product Accordion Defaults saved successfully!');
      } else {
        showToast(res.message || 'Failed to save defaults', 'error');
      }
    } catch (err) {
      console.error('Save settings error:', err);
      showToast('Error saving global defaults', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleHighlightChange = (index: number, field: string, value: string) => {
    const updated = [...highlights];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    if (field === 'menuItem') {
      updated[index].columnId = '';
      updated[index].subMenuItemId = '';
    } else if (field === 'columnId') {
      updated[index].subMenuItemId = '';
    }
    setHighlights(updated);
  };

  const handleSaveHighlights = async () => {
    const validHighlights = highlights.filter(hl => hl.menuItem && hl.columnId && hl.subMenuItemId);
    
    setSavingHighlights(true);
    try {
      const res = await bannerApi.saveHighlights(validHighlights);
      if (res.success) {
        showToast('Homepage Highlights saved successfully!');
      } else {
        showToast(res.message || 'Failed to save highlights', 'error');
      }
    } catch (err) {
      console.error('Save highlights error:', err);
      showToast('Error saving highlights', 'error');
    } finally {
      setSavingHighlights(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditBanner(null);
    setDesktopImage('');
    setMobileImage('');
    setLink('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (banner: BannerData) => {
    setEditBanner(banner);
    setDesktopImage(banner.desktopImage);
    setMobileImage(banner.mobileImage);
    setLink(banner.link);
    setIsActive(banner.isActive);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'desktop') setUploadingDesktop(true);
    else setUploadingMobile(true);

    try {
      const res = await uploadApi.uploadImage(file);
      if (res.success && res.imageUrl) {
        if (type === 'desktop') setDesktopImage(res.imageUrl);
        else setMobileImage(res.imageUrl);
        showToast('Image uploaded successfully');
      } else {
        showToast(res.message || 'Image upload failed', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Error uploading image', 'error');
    } finally {
      if (type === 'desktop') setUploadingDesktop(false);
      else setUploadingMobile(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!desktopImage || !mobileImage) {
      showToast('Both desktop and mobile images are required', 'error');
      return;
    }

    const payload = {
      desktopImage,
      mobileImage,
      link,
      isActive
    };

    setActionLoading(true);
    try {
      let res;
      if (editBanner) {
        res = await bannerApi.updateBanner(editBanner._id, payload);
        if (res.success) {
          showToast('Banner updated successfully');
          setIsModalOpen(false);
          fetchData(); // Refresh to update active statuses
        } else {
          showToast(res.message || 'Error updating banner', 'error');
        }
      } else {
        res = await bannerApi.createBanner(payload);
        if (res.success) {
          showToast('Banner created successfully');
          setIsModalOpen(false);
          fetchData();
        } else {
          showToast(res.message || 'Error creating banner', 'error');
        }
      }
    } catch (error) {
      console.error('Submit banner error:', error);
      showToast('Network error saving banner', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    setActionLoading(true);
    try {
      const res = await bannerApi.deleteBanner(id);
      if (res.success) {
        showToast('Banner deleted successfully');
        setBanners(prev => prev.filter(b => b._id !== id));
      } else {
        showToast(res.message || 'Failed to delete banner', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Error deleting banner', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (banner: BannerData) => {
    try {
      const res = await bannerApi.updateBanner(banner._id, { isActive: !banner.isActive });
      if (res.success) {
        fetchData(); // Fetch all because other banners might have been set to inactive
        showToast(`Banner set to ${!banner.isActive ? 'Active' : 'Inactive'}`);
      } else {
        showToast('Failed to update banner state', 'error');
      }
    } catch (error) {
      console.error('Toggle active error:', error);
    }
  };

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
          <h1 className="text-2xl font-semibold text-[#212121]">Hero Banners</h1>
          <p className="text-sm text-gray-500">Manage dynamic homepage banners</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center px-5 py-2.5 bg-[#212121] hover:bg-neutral-800 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200"
        >
          <Plus size={16} className="mr-2" />
          Add Banner
        </button>
      </div>

      {/* Banners Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={32} className="animate-spin text-neutral-800" />
            <span className="text-sm text-gray-500">Loading banners...</span>
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-sm font-semibold text-gray-800">No banners found</h3>
            <p className="text-xs text-gray-500 mt-1">Try adding a new homepage banner.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Desktop Preview</th>
                  <th className="py-4 px-6">Mobile Preview</th>
                  <th className="py-4 px-6">Navigation Link</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {banners.map(banner => (
                  <tr key={banner._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="w-32 h-16 bg-gray-50 border border-gray-100 rounded overflow-hidden">
                        <img src={banner.desktopImage} alt="Desktop Banner" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="w-10 h-16 bg-gray-50 border border-gray-100 rounded overflow-hidden">
                        <img src={banner.mobileImage} alt="Mobile Banner" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-mono text-xs">
                      {banner.link ? `/${banner.link}` : <span className="text-gray-400 italic">No Link</span>}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleActive(banner)}
                        className="focus:outline-none transition-opacity hover:opacity-85"
                        title="Toggle Visibility"
                      >
                        {banner.isActive ? (
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
                          onClick={() => handleOpenEditModal(banner)}
                          className="p-1.5 hover:bg-neutral-100 text-gray-600 hover:text-black rounded-lg transition-colors"
                          title="Edit Banner"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner._id)}
                          disabled={actionLoading}
                          className="p-1.5 hover:bg-red-50 text-gray-450 hover:text-red-650 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Banner"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Homepage Highlights Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6">
        <div>
          <h2 className="text-lg font-semibold text-[#212121]">Homepage Category Highlights</h2>
          <p className="text-xs text-gray-500 mt-1">
            Choose exactly 4 submenus to feature as cards (502x547 dimension) on the homepage. The cover image will be dynamically fetched from the first product added to each submenu category.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
          {highlights.map((hl, index) => {
            const selectedMenu = menuItems.find(m => m._id === hl.menuItem);
            const selectedColumn = selectedMenu?.columns?.find(c => c._id === hl.columnId);

            return (
              <div key={index} className="border border-gray-100 bg-neutral-50/50 p-4 rounded-lg space-y-4 font-['Poppins']">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Card Slot #{index + 1}</h3>
                
                {/* Selector 1: MenuItem */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Parent Menu</label>
                  <select
                    value={hl.menuItem}
                    onChange={(e) => handleHighlightChange(index, 'menuItem', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#212121]"
                  >
                    <option value="">-- Select Menu --</option>
                    {menuItems.map(menu => (
                      <option key={menu._id} value={menu._id}>{menu.title}</option>
                    ))}
                  </select>
                </div>

                {/* Selector 2: Column */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Column Heading</label>
                  <select
                    value={hl.columnId}
                    onChange={(e) => handleHighlightChange(index, 'columnId', e.target.value)}
                    disabled={!hl.menuItem}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#212121] disabled:bg-gray-100 disabled:opacity-50"
                  >
                    <option value="">-- Select Column --</option>
                    {selectedMenu?.columns?.map(col => (
                      <option key={col._id} value={col._id}>{col.heading}</option>
                    ))}
                  </select>
                </div>

                {/* Selector 3: SubMenu Item */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Submenu Item</label>
                  <select
                    value={hl.subMenuItemId}
                    onChange={(e) => handleHighlightChange(index, 'subMenuItemId', e.target.value)}
                    disabled={!hl.columnId}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#212121] disabled:bg-gray-100 disabled:opacity-50"
                  >
                    <option value="">-- Select Submenu --</option>
                    {selectedColumn?.items?.map(item => {
                      const linkParts = item.link?.split('/').filter(Boolean);
                      const itemSlug = linkParts?.[linkParts.length - 1] || '';
                      return (
                        <option key={itemSlug} value={itemSlug}>{item.label}</option>
                      );
                    })}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={handleSaveHighlights}
            disabled={savingHighlights}
            className="flex items-center justify-center px-6 py-2.5 bg-[#212121] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg disabled:opacity-50 transition-colors"
          >
            {savingHighlights ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
            ) : null}
            Save Highlights Configuration
          </button>
        </div>
      </div>

      {/* Product Details Global Accordion Defaults Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6">
        <div>
          <h2 className="text-lg font-semibold text-[#212121]">Product Details Global Accordion Defaults</h2>
          <p className="text-xs text-gray-500 mt-1">
            Configure default specifications, size models, fits, and shipping details. When adding new products, if you leave their overrides blank, these global values will be shown automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 font-['Poppins']">
          {/* Fabric & Materials */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">Default Fabric & Materials</label>
            <textarea
              value={defaultFabric}
              onChange={(e) => setDefaultFabric(e.target.value)}
              rows={4}
              placeholder="e.g. Crafted from premium linen..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#212121] focus:border-[#212121]"
            />
          </div>

          {/* Size on Model */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">Default Size on Model</label>
            <textarea
              value={defaultSizeModel}
              onChange={(e) => setDefaultSizeModel(e.target.value)}
              rows={4}
              placeholder="e.g. Model is wearing size M..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#212121] focus:border-[#212121]"
            />
          </div>

          {/* Fit & Construction */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">Default Fit & Construction</label>
            <textarea
              value={defaultFit}
              onChange={(e) => setDefaultFit(e.target.value)}
              rows={4}
              placeholder="e.g. Loose fit with structured hems..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#212121] focus:border-[#212121]"
            />
          </div>

          {/* Shipping & Returns */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">Default Shipping & Returns</label>
            <textarea
              value={defaultShipping}
              onChange={(e) => setDefaultShipping(e.target.value)}
              rows={4}
              placeholder="e.g. Free shipping on domestic orders..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#212121] focus:border-[#212121]"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={handleSaveSettings}
            disabled={savingSettings}
            className="flex items-center justify-center px-6 py-2.5 bg-[#212121] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg disabled:opacity-50 transition-colors"
          >
            {savingSettings ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
            ) : null}
            Save Accordion Defaults
          </button>
        </div>
      </div>

      {/* Slide-out Panel / Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-gray-150 flex items-center justify-between bg-neutral-50">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editBanner ? 'Edit Banner' : 'Create New Banner'}
                  </h2>
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
                
                {/* Desktop Image */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Desktop Banner (1512x851 recommended) *</label>
                  {desktopImage ? (
                    <div className="relative aspect-video bg-neutral-50 border border-gray-150 rounded-lg overflow-hidden group">
                      <img src={desktopImage} alt="Desktop Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setDesktopImage('')}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="relative aspect-video border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-gray-50/50">
                      {uploadingDesktop ? (
                        <Loader2 size={24} className="animate-spin text-gray-400 mb-1" />
                      ) : (
                        <>
                          <ImageIcon size={24} className="text-gray-400 mb-1" />
                          <span className="text-xs font-medium text-gray-550">Upload Desktop Image</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'desktop')}
                        disabled={uploadingDesktop}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Mobile Image */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Banner (Vertical recommended) *</label>
                  {mobileImage ? (
                    <div className="relative w-1/2 aspect-[3/4] bg-neutral-50 border border-gray-150 rounded-lg overflow-hidden group">
                      <img src={mobileImage} alt="Mobile Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setMobileImage('')}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="relative w-1/2 aspect-[3/4] border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-gray-50/50">
                      {uploadingMobile ? (
                        <Loader2 size={24} className="animate-spin text-gray-400 mb-1" />
                      ) : (
                        <>
                          <ImageIcon size={24} className="text-gray-400 mb-1" />
                          <span className="text-xs font-medium text-gray-550 text-center px-2">Upload Mobile Image</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'mobile')}
                        disabled={uploadingMobile}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Link */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Navigation Link (Optional)</label>
                  <select
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#212121]"
                  >
                    <option value="">-- No Link --</option>
                    {menuItems.map(item => (
                      <option key={item._id} value={item.slug}>/{item.slug} ({item.title})</option>
                    ))}
                  </select>
                </div>

                {/* Active Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-gray-300 text-[#212121] focus:ring-[#212121]"
                  />
                  <span className="text-sm font-medium text-gray-700">Set as Active Banner</span>
                </label>
                <p className="text-[10px] text-gray-500">Only one banner can be active at a time. Saving as active will deactivate the current active banner.</p>

                {/* Submit */}
                <div className="pt-4 border-t border-gray-150">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full bg-[#212121] text-white py-3 rounded-lg text-sm font-medium hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading && <Loader2 size={16} className="animate-spin" />}
                    {editBanner ? 'Update Banner' : 'Create Banner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
