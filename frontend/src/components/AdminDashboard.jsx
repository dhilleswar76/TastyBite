import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI, reservationAPI, menuAPI, contactAPI, eventAPI, reviewAPI } from '../services/api';
import { menuItems as fallbackMenu } from '../data/menuData';

const PRESET_ADDONS = [
  { id: 'cheese', name: 'Extra Melted Cheese', price: 40, icon: '🧀' },
  { id: 'garlic-butter', name: 'Garlic Butter Tadka', price: 25, icon: '🧄' },
  { id: 'gravy', name: 'Extra Rich Gravy', price: 40, icon: '🍲' },
  { id: 'boiled-egg', name: 'Boiled Spiced Egg', price: 25, icon: '🥚' },
  { id: 'mint-chutney', name: 'Spiced Mint Chutney', price: 20, icon: '🌿' },
  { id: 'crispy-onions', name: 'Fried Birista Onions', price: 25, icon: '🧅' },
  { id: 'icecream', name: 'Vanilla Ice Cream Scoop', price: 50, icon: '🍨' },
  { id: 'choco-fudge', name: 'Chocolate Fudge Drizzle', price: 35, icon: '🍫' },
  { id: 'dry-fruits', name: 'Crushed Dry Fruits & Nuts', price: 35, icon: '🌰' },
  { id: 'desi-ghee', name: 'Pure Desi Ghee Drizzle', price: 20, icon: '🧈' },
  { id: 'schezwan', name: 'Fiery Schezwan Sauce', price: 25, icon: '🌶️' },
  { id: 'extra-meat', name: 'Extra Meat / Chicken Portion', price: 80, icon: '🍗' },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('kds'); // 'kds', 'orders', 'reservations', 'menu', 'events', 'analytics', 'qr'
  const [loading, setLoading] = useState(true);

  // Data states
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Search & filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [reservationSearch, setReservationSearch] = useState('');
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCatFilter, setMenuCatFilter] = useState('all');

  // Selected Table for QR Generator
  const [selectedTableForQR, setSelectedTableForQR] = useState(1);

  // Menu Modal State (Add / Edit)
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [newAddon, setNewAddon] = useState({ name: '', price: '', icon: '✨' });
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'starters',
    tag: 'Veg',
    image: '/pictures-restaurant/Paneer-Tikka.webp',
    available: true,
    spiceLevel: 2,
    isChefSpecial: false,
    calories: 340,
    protein: '16g',
    carbs: '28g',
    fats: '14g',
    customizable: true,
    customizationType: 'spicy',
    customizationOptions: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
    addOns: [
      { id: 'cheese', name: 'Extra Melted Cheese', price: 40, icon: '🧀' },
      { id: 'mint-chutney', name: 'Spiced Mint Chutney', price: 20, icon: '🌿' },
    ],
    allowsNotes: true,
  });
  const [actionFeedback, setActionFeedback] = useState(null);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'starters', label: 'Starters' },
    { id: 'biryanis', label: 'Biryanis' },
    { id: 'fried-rice-noodles', label: 'Fried Rice & Noodles' },
    { id: 'main-course', label: 'Main Course' },
    { id: 'indian-breads', label: 'Breads' },
    { id: 'beverages', label: 'Beverages' },
    { id: 'desserts', label: 'Desserts' },
  ];

  const showNotification = (msg, type = 'success') => {
    setActionFeedback({ msg, type });
    setTimeout(() => setActionFeedback(null), 3500);
  };

  // Fetch all admin data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [ordersRes, resRes, menuRes, contactsRes, eventsRes, reviewsRes] = await Promise.allSettled([
        orderAPI.getAll('all'),
        reservationAPI.getAll(),
        menuAPI.getAll('all', true),
        contactAPI.getAll(),
        eventAPI.getAll(),
        reviewAPI.getAll(),
      ]);

      if (ordersRes.status === 'fulfilled' && ordersRes.value?.data) {
        setOrders(ordersRes.value.data);
      }
      if (resRes.status === 'fulfilled' && resRes.value?.data) {
        setReservations(resRes.value.data);
      }
      if (menuRes.status === 'fulfilled' && menuRes.value?.data && menuRes.value.data.length > 0) {
        setMenuItems(menuRes.value.data);
      } else {
        setMenuItems(fallbackMenu);
      }
      if (contactsRes.status === 'fulfilled' && contactsRes.value?.data) {
        setContacts(contactsRes.value.data);
      }
      if (eventsRes.status === 'fulfilled' && eventsRes.value?.data) {
        setEvents(eventsRes.value.data);
      }
      if (reviewsRes.status === 'fulfilled' && reviewsRes.value?.data) {
        setReviews(reviewsRes.value.data);
      }
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- ORDER HANDLERS ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      showNotification(`Order status updated to "${newStatus}"!`);
    } catch (err) {
      showNotification(err.message || 'Failed to update order status', 'error');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await orderAPI.delete(orderId);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      showNotification('Order deleted successfully');
    } catch (err) {
      showNotification(err.message || 'Failed to delete order', 'error');
    }
  };

  // --- RESERVATION HANDLERS ---
  const handleUpdateReservationStatus = async (resId, newStatus) => {
    try {
      await reservationAPI.updateStatus(resId, newStatus);
      setReservations((prev) =>
        prev.map((r) => (r._id === resId ? { ...r, status: newStatus } : r))
      );
      showNotification(`Reservation marked as ${newStatus}!`);
    } catch (err) {
      showNotification(err.message || 'Failed to update reservation', 'error');
    }
  };

  const handleDeleteReservation = async (resId) => {
    if (!window.confirm('Delete this reservation?')) return;
    try {
      await reservationAPI.delete(resId);
      setReservations((prev) => prev.filter((r) => r._id !== resId));
      showNotification('Reservation deleted');
    } catch (err) {
      showNotification(err.message || 'Failed to delete reservation', 'error');
    }
  };

  // --- EVENT INQUIRY HANDLERS ---
  const handleUpdateEventStatus = async (eventId, status) => {
    try {
      await eventAPI.updateStatus(eventId, status);
      setEvents((prev) =>
        prev.map((ev) => (ev._id === eventId ? { ...ev, status } : ev))
      );
      showNotification(`Event inquiry marked as ${status}!`);
    } catch (err) {
      showNotification(err.message || 'Failed to update event status', 'error');
    }
  };

  // --- MENU ITEM HANDLERS ---
  const handleOpenAddMenuModal = () => {
    setEditingMenuItem(null);
    setNewAddon({ name: '', price: '', icon: '✨' });
    setMenuFormData({
      name: '',
      description: '',
      price: '',
      category: 'starters',
      tag: 'Veg',
      image: '/pictures-restaurant/Paneer-Tikka.webp',
      available: true,
      spiceLevel: 2,
      isChefSpecial: false,
      calories: 340,
      protein: '16g',
      carbs: '28g',
      fats: '14g',
      customizable: true,
      customizationType: 'spicy',
      customizationOptions: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
      addOns: [
        { id: 'cheese', name: 'Extra Melted Cheese', price: 40, icon: '🧀' },
        { id: 'mint-chutney', name: 'Spiced Mint Chutney', price: 20, icon: '🌿' },
      ],
      allowsNotes: true,
    });
    setShowMenuModal(true);
  };

  const handleOpenEditMenuModal = (item) => {
    setEditingMenuItem(item);
    setNewAddon({ name: '', price: '', icon: '✨' });
    const isBeverage = item.category === 'beverages';
    const isDessert = item.category === 'desserts';
    const isBread = item.category === 'indian-breads';

    const defaultType = isBeverage ? 'sweet' : isDessert ? 'temperature' : isBread ? 'none' : 'spicy';
    const defaultOptions = isBeverage
      ? ['Low Sugar', 'Normal Sweet', 'Extra Sweet', 'Sugar-Free (Stevia)']
      : isDessert
      ? ['Served Piping Hot', 'Warm', 'Room Temperature']
      : isBread
      ? ['Crispy Well-Done', 'Soft & Fluffy']
      : ['Mild', 'Medium', 'Hot', 'Extra Hot'];

    setMenuFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      tag: item.tag || 'Veg',
      image: item.image || '/pictures-restaurant/Paneer-Tikka.webp',
      available: item.available !== false,
      spiceLevel: item.spiceLevel || 2,
      isChefSpecial: item.isChefSpecial || false,
      calories: item.nutrition?.calories || 340,
      protein: item.nutrition?.protein || '16g',
      carbs: item.nutrition?.carbs || '28g',
      fats: item.nutrition?.fats || '14g',
      customizable: item.customizable !== false,
      customizationType: item.customization?.type || defaultType,
      customizationOptions: item.customization?.options || defaultOptions,
      addOns: item.customization?.addOns || [],
      allowsNotes: item.customization?.allowsNotes !== false,
    });
    setShowMenuModal(true);
  };

  const handleTogglePresetAddon = (preset) => {
    setMenuFormData((prev) => {
      const exists = prev.addOns.some((a) => a.id === preset.id || a.name === preset.name);
      if (exists) {
        return { ...prev, addOns: prev.addOns.filter((a) => a.id !== preset.id && a.name !== preset.name) };
      } else {
        return { ...prev, addOns: [...prev.addOns, preset] };
      }
    });
  };

  const handleRemoveAddon = (index) => {
    setMenuFormData((prev) => ({
      ...prev,
      addOns: prev.addOns.filter((_, idx) => idx !== index),
    }));
  };

  const handleAddCustomAddon = (e) => {
    e.preventDefault();
    if (!newAddon.name.trim() || !newAddon.price) {
      showNotification('Please provide add-on name and price', 'error');
      return;
    }
    const addonObj = {
      id: `custom-${Date.now()}`,
      name: newAddon.name.trim(),
      price: Number(newAddon.price),
      icon: newAddon.icon || '✨',
    };
    setMenuFormData((prev) => ({
      ...prev,
      addOns: [...prev.addOns, addonObj],
    }));
    setNewAddon({ name: '', price: '', icon: '✨' });
    showNotification(`Added custom option "${addonObj.name}"!`);
  };

  const handleCustomizationTypeChange = (type) => {
    let options = ['Mild', 'Medium', 'Hot', 'Extra Hot'];
    if (type === 'sweet') {
      options = ['Low Sugar', 'Normal Sweet', 'Extra Sweet', 'Sugar-Free (Stevia)'];
    } else if (type === 'temperature') {
      options = ['Served Piping Hot', 'Warm', 'Room Temperature', 'Chilled'];
    } else if (type === 'none') {
      options = ['Standard', 'Special Chef Style'];
    }
    setMenuFormData((prev) => ({
      ...prev,
      customizationType: type,
      customizationOptions: options,
    }));
  };

  const handleToggleMenuAvailability = async (item) => {
    const itemId = item._id || item.id;
    const newStatus = !item.available;
    try {
      if (item._id) {
        await menuAPI.update(item._id, { available: newStatus });
      }
      setMenuItems((prev) =>
        prev.map((i) => ((i._id || i.id) === itemId ? { ...i, available: newStatus } : i))
      );
      showNotification(`"${item.name}" marked as ${newStatus ? 'In Stock' : 'Sold Out'}!`);
    } catch (err) {
      showNotification(err.message || 'Failed to toggle availability', 'error');
    }
  };

  const handleDeleteMenuItem = async (item) => {
    const itemId = item._id || item.id;
    if (!window.confirm(`Are you sure you want to delete "${item.name}" from the menu?`)) return;
    try {
      if (item._id) {
        await menuAPI.delete(item._id);
      }
      setMenuItems((prev) => prev.filter((i) => (i._id || i.id) !== itemId));
      showNotification(`"${item.name}" removed from menu.`);
    } catch (err) {
      showNotification(err.message || 'Failed to delete menu item', 'error');
    }
  };

  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: menuFormData.name,
        description: menuFormData.description,
        price: Number(menuFormData.price),
        category: menuFormData.category,
        tag: menuFormData.tag,
        image: menuFormData.image,
        available: menuFormData.available,
        spiceLevel: Number(menuFormData.spiceLevel),
        isChefSpecial: Boolean(menuFormData.isChefSpecial),
        nutrition: {
          calories: Number(menuFormData.calories),
          protein: menuFormData.protein,
          carbs: menuFormData.carbs,
          fats: menuFormData.fats,
        },
        customizable: Boolean(menuFormData.customizable),
        customization: menuFormData.customizable
          ? {
              type: menuFormData.customizationType,
              options: menuFormData.customizationOptions,
              addOns: menuFormData.addOns,
              allowsNotes: menuFormData.allowsNotes !== false,
            }
          : {
              type: 'none',
              options: [],
              addOns: [],
              allowsNotes: false,
            },
      };

      if (editingMenuItem && editingMenuItem._id) {
        const res = await menuAPI.update(editingMenuItem._id, payload);
        const updated = res.data || { ...editingMenuItem, ...payload };
        setMenuItems((prev) =>
          prev.map((i) => (i._id === editingMenuItem._id ? updated : i))
        );
        showNotification(`Dish "${payload.name}" updated successfully!`);
      } else {
        const res = await menuAPI.create(payload);
        const created = res.data || { ...payload, _id: Date.now().toString() };
        setMenuItems((prev) => [created, ...prev]);
        showNotification(`New dish "${payload.name}" added to menu! 🎉`);
      }

      setShowMenuModal(false);
    } catch (err) {
      showNotification(err.message || 'Failed to save menu item', 'error');
    }
  };

  // Filtered lists
  const filteredOrders = orders.filter((o) =>
    orderStatusFilter === 'all' ? true : o.status === orderStatusFilter
  );

  const filteredReservations = reservations.filter((r) => {
    if (!reservationSearch.trim()) return true;
    const q = reservationSearch.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.time?.toLowerCase().includes(q) ||
      r.seatingZone?.toLowerCase().includes(q)
    );
  });

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCat = menuCatFilter === 'all' || item.category === menuCatFilter;
    const matchesSearch =
      !menuSearch.trim() ||
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Calculate quick stats & analytics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.pricing?.totalAmount || 0), 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing'
  ).length;
  const activeReservationsCount = reservations.filter((r) => r.status !== 'cancelled').length;

  // KDS Columns
  const kdsNew = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed');
  const kdsCooking = orders.filter((o) => o.status === 'preparing');
  const kdsReady = orders.filter((o) => o.status === 'ready');
  const kdsDelivered = orders.filter((o) => o.status === 'delivered');

  // QR URL
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const tableQRUrl = `${currentOrigin}/?table=${selectedTableForQR}`;
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(tableQRUrl)}`;

  return (
    <div className="admin-page-container">
      {/* Top Navbar */}
      <header className="admin-header">
        <div className="admin-header-brand">
          <Link to="/" className="admin-logo">
            <img src="/pictures-restaurant/restaurant-logo.png" alt="TastyBite" />
            <span>TastyBite <strong>Operations Control</strong></span>
          </Link>
          <span className="admin-badge-live">Live Kitchen &amp; Floor</span>
        </div>

        <div className="admin-header-actions">
          <button className="admin-refresh-btn" onClick={loadAllData} title="Refresh data">
            ↻ Refresh All
          </button>
          <Link to="/" className="admin-exit-btn">
            &larr; Return to Guest Site
          </Link>
        </div>
      </header>

      {/* Notification Toast */}
      {actionFeedback && (
        <div className={`admin-notification-toast ${actionFeedback.type}`}>
          {actionFeedback.msg}
        </div>
      )}

      {/* KPI Stats Overview */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-icon revenue">💰</div>
          <div className="stat-info">
            <span className="stat-label">Total Revenue</span>
            <h3 className="stat-val">₹{totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">👨‍🍳</div>
          <div className="stat-info">
            <span className="stat-label">Active Kitchen Orders</span>
            <h3 className="stat-val">{pendingOrdersCount} <small>active</small></h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon reservations">📅</div>
          <div className="stat-info">
            <span className="stat-label">Table Reservations</span>
            <h3 className="stat-val">{activeReservationsCount} <small>booked</small></h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon menu">🍾</div>
          <div className="stat-info">
            <span className="stat-label">Party &amp; Events</span>
            <h3 className="stat-val">{events.length} <small>inquiries</small></h3>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="admin-tabs-bar">
        <button
          className={`admin-tab-btn ${activeTab === 'kds' ? 'active' : ''}`}
          onClick={() => setActiveTab('kds')}
        >
          👨‍🍳 Kitchen KDS ({kdsNew.length + kdsCooking.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          🛍️ All Orders ({orders.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          📅 Table Bookings ({reservations.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          🍕 Menu Catalog ({menuItems.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'qr' ? 'active' : ''}`}
          onClick={() => setActiveTab('qr')}
        >
          📱 Table QR Generator
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Sales &amp; Trends
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          🎉 Event Inquiries ({events.length})
        </button>
      </div>

      {/* Main Content Area */}
      <main className="admin-main-content">
        {loading ? (
          <div className="admin-loading-state">
            <div className="loading-spinner"></div>
            <p>Loading restaurant operations data...</p>
          </div>
        ) : (
          <>
            {/* --- TAB 1: KITCHEN DISPLAY SYSTEM (KDS) --- */}
            {activeTab === 'kds' && (
              <div className="kds-dashboard-board">
                <div className="kds-header-bar">
                  <div>
                    <h3>👨‍🍳 Live Kitchen Order Board (KDS)</h3>
                    <p>Real-time order tickets for executive chefs, tandoor masters, and packers.</p>
                  </div>
                  <span className="live-clock-pill">🔴 Kitchen Live Stream</span>
                </div>

                <div className="kds-columns-grid">
                  {/* Column 1: New / Confirmed */}
                  <div className="kds-column col-new">
                    <div className="kds-col-header">
                      <h4>📋 New Orders ({kdsNew.length})</h4>
                    </div>
                    <div className="kds-cards-container">
                      {kdsNew.map((order) => (
                        <div key={order._id} className="kds-ticket-card">
                          <div className="ticket-top">
                            <strong className="ticket-code">{order.orderNumber}</strong>
                            <span className="ticket-type-badge">
                              {order.customer?.orderType === 'dine-in' ? `🍽️ Table #${order.customer?.tableNumber}` : '🛵 Delivery'}
                            </span>
                          </div>
                          <div className="ticket-items-body">
                            {order.items?.map((it, idx) => (
                              <div key={idx} className="ticket-item-line">
                                <strong>{it.quantity}x {it.name}</strong>
                                {it.spiceLevel && it.spiceLevel !== 'Default' && (
                                  <span className="kds-spice-tag">🌶️ {it.spiceLevel}</span>
                                )}
                                {it.addOns && it.addOns.length > 0 && (
                                  <div className="kds-addon-txt">+ {it.addOns.map((a) => a.name).join(', ')}</div>
                                )}
                                {it.cookingNotes && (
                                  <div className="kds-notes-txt">📝 {it.cookingNotes}</div>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="ticket-footer-action">
                            <button
                              className="kds-advance-btn start-cook"
                              onClick={() => handleUpdateOrderStatus(order._id, 'preparing')}
                            >
                              🔥 Start Cooking &rarr;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: In Kitchen / Cooking */}
                  <div className="kds-column col-cooking">
                    <div className="kds-col-header">
                      <h4>👨‍🍳 In Kitchen ({kdsCooking.length})</h4>
                    </div>
                    <div className="kds-cards-container">
                      {kdsCooking.map((order) => (
                        <div key={order._id} className="kds-ticket-card cooking">
                          <div className="ticket-top">
                            <strong className="ticket-code">{order.orderNumber}</strong>
                            <span className="ticket-type-badge">
                              {order.customer?.orderType === 'dine-in' ? `🍽️ Table #${order.customer?.tableNumber}` : '🛵 Delivery'}
                            </span>
                          </div>
                          <div className="ticket-items-body">
                            {order.items?.map((it, idx) => (
                              <div key={idx} className="ticket-item-line">
                                <strong>{it.quantity}x {it.name}</strong>
                                {it.spiceLevel && it.spiceLevel !== 'Default' && (
                                  <span className="kds-spice-tag">🌶️ {it.spiceLevel}</span>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="ticket-footer-action">
                            <button
                              className="kds-advance-btn mark-ready"
                              onClick={() => handleUpdateOrderStatus(order._id, 'ready')}
                            >
                              📦 Mark Ready / Dispatch &rarr;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Ready for Pickup / Out for Delivery */}
                  <div className="kds-column col-ready">
                    <div className="kds-col-header">
                      <h4>🛵 Ready / Out ({kdsReady.length})</h4>
                    </div>
                    <div className="kds-cards-container">
                      {kdsReady.map((order) => (
                        <div key={order._id} className="kds-ticket-card ready">
                          <div className="ticket-top">
                            <strong className="ticket-code">{order.orderNumber}</strong>
                            <span>{order.customer?.name} (📞 {order.customer?.phone})</span>
                          </div>
                          <div className="ticket-items-body">
                            <p>{order.items?.length} items packed and ready.</p>
                          </div>
                          <div className="ticket-footer-action">
                            <button
                              className="kds-advance-btn complete-order"
                              onClick={() => handleUpdateOrderStatus(order._id, 'delivered')}
                            >
                              ✅ Complete &amp; Served
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 4: Delivered / Completed */}
                  <div className="kds-column col-done">
                    <div className="kds-col-header">
                      <h4>✅ Completed Today ({kdsDelivered.length})</h4>
                    </div>
                    <div className="kds-cards-container">
                      {kdsDelivered.slice(0, 5).map((order) => (
                        <div key={order._id} className="kds-ticket-card done">
                          <div className="ticket-top">
                            <strong>{order.orderNumber}</strong>
                            <span>₹{order.pricing?.totalAmount}</span>
                          </div>
                          <span className="done-status-pill">Completed</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB 2: TABLE QR GENERATOR --- */}
            {activeTab === 'qr' && (
              <div className="admin-tab-panel">
                <div className="panel-header-toolbar">
                  <div className="panel-title-block">
                    <h3>📱 Table QR Code Ordering Station</h3>
                    <p>Print QR code table placards. Guests scan with their smartphones to order directly to their table number.</p>
                  </div>
                </div>

                <div className="qr-generator-layout">
                  <div className="qr-controls-card">
                    <label>Select Table Number to Generate:</label>
                    <div className="tables-btn-grid">
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((tbl) => (
                        <button
                          key={tbl}
                          type="button"
                          className={`table-select-btn ${selectedTableForQR === tbl ? 'selected' : ''}`}
                          onClick={() => setSelectedTableForQR(tbl)}
                        >
                          Table {tbl}
                        </button>
                      ))}
                    </div>

                    <div className="qr-link-preview-box">
                      <label>Target Guest Order URL:</label>
                      <input type="text" readOnly value={tableQRUrl} className="qr-url-input" />
                    </div>
                  </div>

                  <div className="qr-preview-card" id="printable-qr">
                    <div className="qr-placard-inner">
                      <img src="/pictures-restaurant/restaurant-logo.png" alt="TastyBite" className="qr-brand-logo" />
                      <h3>TastyBite Fine Dining</h3>
                      <div className="table-badge-big">TABLE #{selectedTableForQR}</div>
                      <img src={qrImageSrc} alt={`Table ${selectedTableForQR} QR Code`} className="qr-code-img" />
                      <p className="qr-scan-instr">📷 Scan with your camera to browse menu &amp; order dishes directly to your table.</p>
                      <button className="print-qr-btn" onClick={() => window.print()}>
                        🖨️ Print QR Table Standee
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB 3: SALES & TRENDS ANALYTICS --- */}
            {activeTab === 'analytics' && (
              <div className="admin-tab-panel">
                <div className="panel-header-toolbar">
                  <div className="panel-title-block">
                    <h3>📊 Sales &amp; Dining Trends Analytics</h3>
                    <p>Revenue velocity, peak ordering hours, and best-selling culinary dishes.</p>
                  </div>
                </div>

                {/* KPI Metrics */}
                <div className="analytics-metrics-grid">
                  <div className="metric-box">
                    <span>Average Order Value (AOV)</span>
                    <h3>₹{orders.length ? Math.round(totalRevenue / orders.length) : 0}</h3>
                    <small className="trend-up">▲ 14% vs last week</small>
                  </div>
                  <div className="metric-box">
                    <span>Dine-In vs Delivery Ratio</span>
                    <h3>62% Dine-In / 38% Delivery</h3>
                    <small>High table turnover rate</small>
                  </div>
                  <div className="metric-box">
                    <span>Loyalty Points Redeemed</span>
                    <h3>450 TastyPoints (₹225 discount)</h3>
                    <small>High customer retention</small>
                  </div>
                </div>

                {/* Peak Hours & Best Sellers */}
                <div className="analytics-charts-grid">
                  {/* Peak Dining Hours Chart */}
                  <div className="chart-card">
                    <h4>🕒 Peak Dining &amp; Ordering Hours</h4>
                    <div className="bar-chart-visual">
                      <div className="bar-col"><div className="bar-fill" style={{ height: '25%' }}></div><span>12 PM</span></div>
                      <div className="bar-col"><div className="bar-fill" style={{ height: '70%' }}></div><span>1 PM (Lunch)</span></div>
                      <div className="bar-col"><div className="bar-fill" style={{ height: '40%' }}></div><span>2 PM</span></div>
                      <div className="bar-col"><div className="bar-fill" style={{ height: '15%' }}></div><span>4 PM</span></div>
                      <div className="bar-col"><div className="bar-fill" style={{ height: '55%' }}></div><span>7 PM</span></div>
                      <div className="bar-col"><div className="bar-fill highlight" style={{ height: '95%' }}></div><span>8 PM (Peak Dinner)</span></div>
                      <div className="bar-col"><div className="bar-fill" style={{ height: '80%' }}></div><span>9 PM</span></div>
                      <div className="bar-col"><div className="bar-fill" style={{ height: '35%' }}></div><span>10 PM</span></div>
                    </div>
                  </div>

                  {/* Top 5 Best Sellers */}
                  <div className="chart-card">
                    <h4>⭐ Top 5 Best-Selling Dishes</h4>
                    <div className="bestsellers-list">
                      <div className="bestseller-row">
                        <span className="rank">1</span>
                        <div className="dish-name-info">
                          <strong>Chicken Dum Biryani</strong>
                          <span>Hyderabadi Royal Handi</span>
                        </div>
                        <strong className="sales-stat">142 orders (₹42,458)</strong>
                      </div>
                      <div className="bestseller-row">
                        <span className="rank">2</span>
                        <div className="dish-name-info">
                          <strong>Paneer Butter Masala</strong>
                          <span>Rich Cashew Gravy</span>
                        </div>
                        <strong className="sales-stat">118 orders (₹31,742)</strong>
                      </div>
                      <div className="bestseller-row">
                        <span className="rank">3</span>
                        <div className="dish-name-info">
                          <strong>Tandoori Chicken</strong>
                          <span>Charcoal Clay Oven</span>
                        </div>
                        <strong className="sales-stat">94 orders (₹30,926)</strong>
                      </div>
                      <div className="bestseller-row">
                        <span className="rank">4</span>
                        <div className="dish-name-info">
                          <strong>Garlic Naan</strong>
                          <span>Artisanal Tandoor Bread</span>
                        </div>
                        <strong className="sales-stat">210 orders (₹14,490)</strong>
                      </div>
                      <div className="bestseller-row">
                        <span className="rank">5</span>
                        <div className="dish-name-info">
                          <strong>Chocolate Lava Cake</strong>
                          <span>Molten Belgian Chocolate</span>
                        </div>
                        <strong className="sales-stat">88 orders (₹13,112)</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB 4: LIVE ORDERS LIST --- */}
            {activeTab === 'orders' && (
              <div className="admin-tab-panel">
                <div className="panel-header-toolbar">
                  <div className="panel-title-block">
                    <h3>Customer Orders History &amp; Tracking</h3>
                    <p>Track real-time delivery, takeaway, and table orders.</p>
                  </div>

                  <div className="panel-filter-controls">
                    <label>Filter Status:</label>
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="admin-select-input"
                    >
                      <option value="all">All Orders ({orders.length})</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing 👨‍🍳</option>
                      <option value="ready">Ready for Pickup / Out</option>
                      <option value="delivered">Delivered ✅</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="admin-empty-table">
                    <p>No orders found for the selected filter.</p>
                  </div>
                ) : (
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Customer</th>
                          <th>Type &amp; Address</th>
                          <th>Customized Items</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order._id || order.orderNumber}>
                            <td>
                              <strong className="order-code">{order.orderNumber}</strong>
                              <div className="order-time-sub">
                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                            <td>
                              <div className="cust-name"><strong>{order.customer?.name}</strong></div>
                              <div className="cust-phone">📞 {order.customer?.phone}</div>
                              <div className="cust-email">{order.customer?.email}</div>
                            </td>
                            <td>
                              <span className={`order-type-tag ${order.customer?.orderType}`}>
                                {order.customer?.orderType === 'delivery' && '🛵 Delivery'}
                                {order.customer?.orderType === 'takeaway' && '🥡 Takeaway'}
                                {order.customer?.orderType === 'dine-in' && `🍽️ Table #${order.customer?.tableNumber}`}
                              </span>
                              {order.customer?.address && (
                                <p className="order-addr-text">{order.customer?.address}</p>
                              )}
                              {order.customer?.notes && (
                                <p className="order-notes-text">📝 {order.customer?.notes}</p>
                              )}
                            </td>
                            <td>
                              <div className="order-items-compact">
                                {order.items?.map((it, i) => (
                                  <span key={i} className="order-item-pill">
                                    {it.quantity}x {it.name}
                                    {it.spiceLevel && it.spiceLevel !== 'Default' && ` (${it.spiceLevel})`}
                                    {it.addOns?.length > 0 && ` +${it.addOns.map((a) => a.name).join(',')}`}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td>
                              <strong className="order-total-val">₹{order.pricing?.totalAmount}</strong>
                              <div className="payment-method-sub">
                                {order.payment?.method?.toUpperCase()}
                              </div>
                            </td>
                            <td>
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                className={`status-dropdown status-${order.status}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="preparing">Preparing 👨‍🍳</option>
                                <option value="ready">Ready 📦</option>
                                <option value="delivered">Delivered ✅</option>
                                <option value="cancelled">Cancelled ❌</option>
                              </select>
                            </td>
                            <td>
                              <button
                                className="action-icon-btn delete"
                                onClick={() => handleDeleteOrder(order._id)}
                                title="Delete Order"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* --- TAB 5: RESERVATIONS --- */}
            {activeTab === 'reservations' && (
              <div className="admin-tab-panel">
                <div className="panel-header-toolbar">
                  <div className="panel-title-block">
                    <h3>Table Reservations &amp; Floor Seating</h3>
                    <p>Manage dine-in seating bookings, pre-orders, and seating zones.</p>
                  </div>

                  <div className="panel-search-box">
                    <input
                      type="text"
                      placeholder="Search by guest name, zone, or email..."
                      value={reservationSearch}
                      onChange={(e) => setReservationSearch(e.target.value)}
                      className="admin-search-input"
                    />
                  </div>
                </div>

                {filteredReservations.length === 0 ? (
                  <div className="admin-empty-table">
                    <p>No reservations found.</p>
                  </div>
                ) : (
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Guest Name</th>
                          <th>Zone &amp; Party</th>
                          <th>Date &amp; Time</th>
                          <th>Pre-Ordered Food</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReservations.map((res) => (
                          <tr key={res._id}>
                            <td>
                              <strong>{res.name}</strong>
                              <div className="cust-phone">📞 {res.phone || 'N/A'}</div>
                              <div className="cust-email">{res.email}</div>
                            </td>
                            <td>
                              <span className="zone-pill-badge">{res.seatingZone?.toUpperCase() || 'MAIN HALL'}</span>
                              <div className="guests-count-badge">👥 {res.guests} Guests</div>
                            </td>
                            <td>
                              <strong>{new Date(res.date).toLocaleDateString()}</strong> at <strong>{res.time}</strong>
                            </td>
                            <td>
                              {res.preOrderItems && res.preOrderItems.length > 0 ? (
                                <div className="preorder-mini-list">
                                  {res.preOrderItems.map((p, i) => (
                                    <span key={i} className="preorder-item-pill">
                                      {p.quantity}x {p.name}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="no-preorder-txt">None (Order at table)</span>
                              )}
                            </td>
                            <td>
                              <select
                                value={res.status}
                                onChange={(e) => handleUpdateReservationStatus(res._id, e.target.value)}
                                className={`status-dropdown status-${res.status}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="seated">Seated 🍽️</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="no-show">No-Show</option>
                              </select>
                            </td>
                            <td>
                              <button
                                className="action-icon-btn delete"
                                onClick={() => handleDeleteReservation(res._id)}
                                title="Delete Reservation"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* --- TAB 6: MENU MANAGEMENT --- */}
            {activeTab === 'menu' && (
              <div className="admin-tab-panel">
                <div className="panel-header-toolbar">
                  <div className="panel-title-block">
                    <h3>Menu Items &amp; Catalog</h3>
                    <p>Add new dishes, modify prices, nutritional values, and toggle stock availability.</p>
                  </div>

                  <div className="panel-menu-actions">
                    <input
                      type="text"
                      placeholder="Search menu..."
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      className="admin-search-input"
                    />

                    <select
                      value={menuCatFilter}
                      onChange={(e) => setMenuCatFilter(e.target.value)}
                      className="admin-select-input"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>

                    <button className="btn-primary-add" onClick={handleOpenAddMenuModal}>
                      + Add New Dish
                    </button>
                  </div>
                </div>

                <div className="admin-menu-cards-grid">
                  {filteredMenuItems.map((item) => {
                    const itemId = item._id || item.id;
                    const isAvailable = item.available !== false;

                    return (
                      <div key={itemId} className={`admin-menu-card ${!isAvailable ? 'out-of-stock-card' : ''}`}>
                        <div className="admin-card-img-wrap">
                          <img src={item.image || '/pictures-restaurant/restaurant-logo.png'} alt={item.name} />
                          <span className={`dish-tag-badge ${item.tag === 'Veg' ? 'veg' : 'non-veg'}`}>
                            {item.tag === 'Veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                          </span>
                          {item.isChefSpecial && <span className="card-special-badge">⭐ Special</span>}
                        </div>

                        <div className="admin-card-body">
                          <div className="admin-card-header">
                            <h4>{item.name}</h4>
                            <span className="admin-price">₹{item.price}</span>
                          </div>
                          <p className="admin-card-desc">{item.description}</p>

                          <div className="admin-card-footer">
                            <button
                              className={`stock-toggle-btn ${isAvailable ? 'in-stock' : 'sold-out'}`}
                              onClick={() => handleToggleMenuAvailability(item)}
                            >
                              {isAvailable ? '✅ In Stock' : '🚫 Sold Out'}
                            </button>

                            <div className="admin-card-mini-actions">
                              <button
                                className="action-btn-icon edit"
                                onClick={() => handleOpenEditMenuModal(item)}
                                title="Edit Dish"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                className="action-btn-icon delete"
                                onClick={() => handleDeleteMenuItem(item)}
                                title="Delete Dish"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- TAB 7: PARTY & EVENT BOOKINGS --- */}
            {activeTab === 'events' && (
              <div className="admin-tab-panel">
                <div className="panel-header-toolbar">
                  <div className="panel-title-block">
                    <h3>🎉 Event &amp; Catering Booking Inquiries</h3>
                    <p>Milestone birthdays, corporate feasts, and banquet reservations.</p>
                  </div>
                </div>

                {events.length === 0 ? (
                  <div className="admin-empty-table">
                    <p>No party &amp; catering inquiries received yet.</p>
                  </div>
                ) : (
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Client Name</th>
                          <th>Event Type &amp; Guests</th>
                          <th>Target Date</th>
                          <th>Menu Package &amp; Est. Budget</th>
                          <th>Special Requirements</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((ev) => (
                          <tr key={ev._id}>
                            <td>
                              <strong>{ev.name}</strong>
                              <div className="cust-phone">📞 {ev.phone}</div>
                              <div className="cust-email">{ev.email}</div>
                            </td>
                            <td>
                              <span className="event-type-pill">{ev.eventType?.toUpperCase()}</span>
                              <div className="guests-count-badge">👥 {ev.guestCount} Guests</div>
                            </td>
                            <td>
                              <strong>{new Date(ev.eventDate).toLocaleDateString()}</strong>
                            </td>
                            <td>
                              <div>{ev.preferredMenu}</div>
                              <strong className="event-price-tag">₹{ev.estimatedBudget?.toLocaleString()}</strong>
                            </td>
                            <td>
                              <p className="event-req-text">{ev.specialRequirements || 'Standard arrangement'}</p>
                            </td>
                            <td>
                              <select
                                value={ev.status}
                                onChange={(e) => handleUpdateEventStatus(ev._id, e.target.value)}
                                className={`status-dropdown status-${ev.status}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="in-review">In Review 💬</option>
                                <option value="approved">Approved &amp; Booked ✅</option>
                                <option value="declined">Declined</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* --- ADD / EDIT MENU ITEM MODAL --- */}
      {showMenuModal && (
        <div className="admin-modal-overlay" onClick={() => setShowMenuModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingMenuItem ? 'Edit Dish' : 'Add New Dish to Menu'}</h3>
              <button className="modal-close-x" onClick={() => setShowMenuModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="admin-modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Dish Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Special Chicken Biryani"
                    value={menuFormData.name}
                    onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 299"
                    value={menuFormData.price}
                    onChange={(e) => setMenuFormData({ ...menuFormData, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={menuFormData.category}
                    onChange={(e) => setMenuFormData({ ...menuFormData, category: e.target.value })}
                  >
                    <option value="starters">Starters</option>
                    <option value="biryanis">Biryanis</option>
                    <option value="fried-rice-noodles">Fried Rice &amp; Noodles</option>
                    <option value="main-course">Main Course</option>
                    <option value="indian-breads">Indian Breads</option>
                    <option value="beverages">Beverages</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Dietary Tag *</label>
                  <select
                    value={menuFormData.tag}
                    onChange={(e) => setMenuFormData({ ...menuFormData, tag: e.target.value })}
                  >
                    <option value="Veg">🟢 Pure Veg</option>
                    <option value="Non-Veg">🔴 Non-Veg</option>
                    <option value="">None / Beverage</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Spice Level</label>
                  <select
                    value={menuFormData.spiceLevel}
                    onChange={(e) => setMenuFormData({ ...menuFormData, spiceLevel: e.target.value })}
                  >
                    <option value="1">🌿 Mild</option>
                    <option value="2">🌶️ Medium</option>
                    <option value="3">🔥 Hot</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Calories (kcal)</label>
                  <input
                    type="number"
                    value={menuFormData.calories}
                    onChange={(e) => setMenuFormData({ ...menuFormData, calories: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL / Path *</label>
                <input
                  type="text"
                  required
                  placeholder="/pictures-restaurant/Paneer-Tikka.webp or https://..."
                  value={menuFormData.image}
                  onChange={(e) => setMenuFormData({ ...menuFormData, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe the flavors, spices, and ingredients..."
                  value={menuFormData.description}
                  onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={menuFormData.available}
                      onChange={(e) => setMenuFormData({ ...menuFormData, available: e.target.checked })}
                    />
                    <span>Available in Stock</span>
                  </label>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={menuFormData.isChefSpecial}
                      onChange={(e) => setMenuFormData({ ...menuFormData, isChefSpecial: e.target.checked })}
                    />
                    <span>Chef's Spotlight Special</span>
                  </label>
                </div>
              </div>

              {/* ==========================================================================
                  CUSTOMIZATION TOGGLE & BUILDER SECTION
                  ========================================================================== */}
              <div className="admin-customization-builder-box">
                <div className="custom-toggle-header-row">
                  <label className="checkbox-label-prominent">
                    <input
                      type="checkbox"
                      checked={menuFormData.customizable}
                      onChange={(e) => setMenuFormData({ ...menuFormData, customizable: e.target.checked })}
                    />
                    <div>
                      <strong>✨ Enable Item Customization</strong>
                      <p>Allow diners to customize spice, sweetness, and add extras.</p>
                    </div>
                  </label>
                </div>

                {menuFormData.customizable && (
                  <div className="custom-builder-content">
                    {/* Choice Type Selector */}
                    <div className="form-group">
                      <label>Primary Choice Type</label>
                      <select
                        value={menuFormData.customizationType}
                        onChange={(e) => handleCustomizationTypeChange(e.target.value)}
                        className="admin-select-input"
                      >
                        <option value="spicy">🌶️ Spiciness (Mild, Medium, Hot, Extra Hot)</option>
                        <option value="sweet">🍯 Sweetness (Low Sugar, Normal, Extra Sweet, Sugar-Free)</option>
                        <option value="temperature">🌡️ Serving Temperature (Hot, Warm, Chilled)</option>
                        <option value="none">✨ Style / Add-ons Only</option>
                      </select>
                    </div>

                    {/* Active Add-ons for this dish */}
                    <div className="custom-addons-manager-group">
                      <label className="sub-lbl">
                        Active Add-ons for this Dish ({menuFormData.addOns?.length || 0}):
                      </label>
                      {menuFormData.addOns && menuFormData.addOns.length > 0 ? (
                        <div className="active-addons-chips-wrap">
                          {menuFormData.addOns.map((addon, idx) => (
                            <span key={idx} className="addon-active-chip">
                              <span className="chip-icon">{addon.icon || '✨'}</span>
                              <span className="chip-name">{addon.name}</span>
                              <strong className="chip-price">+₹{addon.price}</strong>
                              <button
                                type="button"
                                className="chip-remove-btn"
                                onClick={() => handleRemoveAddon(idx)}
                                title="Remove add-on"
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="no-addons-tip">No add-ons selected yet. Choose from presets below or create a custom one.</p>
                      )}
                    </div>

                    {/* Quick Presets Library */}
                    <div className="presets-library-section">
                      <label className="sub-lbl">⚡ Quick Pick from Add-on Presets:</label>
                      <div className="preset-pills-grid">
                        {PRESET_ADDONS.map((preset) => {
                          const isAlreadyAdded = menuFormData.addOns?.some(
                            (a) => a.id === preset.id || a.name === preset.name
                          );
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              className={`preset-pill-btn ${isAlreadyAdded ? 'added' : ''}`}
                              onClick={() => handleTogglePresetAddon(preset)}
                            >
                              <span>{preset.icon} {preset.name} (+₹{preset.price})</span>
                              <strong className="plus-minus-tag">{isAlreadyAdded ? '✓' : '+'}</strong>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Create New Custom Add-on for this product */}
                    <div className="create-custom-addon-bar">
                      <label className="sub-lbl">➕ Create New Custom Option for this Product:</label>
                      <div className="custom-addon-inputs-row">
                        <input
                          type="text"
                          placeholder="Icon (e.g. 🧀)"
                          value={newAddon.icon}
                          onChange={(e) => setNewAddon({ ...newAddon, icon: e.target.value })}
                          className="addon-icon-input"
                          maxLength="4"
                        />
                        <input
                          type="text"
                          placeholder="Add-on Name (e.g. Truffle Butter)"
                          value={newAddon.name}
                          onChange={(e) => setNewAddon({ ...newAddon, name: e.target.value })}
                          className="addon-name-input"
                        />
                        <input
                          type="number"
                          placeholder="Price (₹)"
                          min="0"
                          value={newAddon.price}
                          onChange={(e) => setNewAddon({ ...newAddon, price: e.target.value })}
                          className="addon-price-input"
                        />
                        <button
                          type="button"
                          className="add-addon-action-btn"
                          onClick={handleAddCustomAddon}
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowMenuModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingMenuItem ? 'Save Changes' : 'Add to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
