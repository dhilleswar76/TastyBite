import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI, reservationAPI, menuAPI, contactAPI } from '../services/api';
import { menuItems as fallbackMenu } from '../data/menuData';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'reservations', 'menu', 'contacts'
  const [loading, setLoading] = useState(true);

  // Data states
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [contacts, setContacts] = useState([]);

  // Search & filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [reservationSearch, setReservationSearch] = useState('');
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCatFilter, setMenuCatFilter] = useState('all');

  // Menu Modal State (Add / Edit)
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'starters',
    tag: 'Veg',
    image: '/pictures-restaurant/Paneer-Tikka.png',
    available: true,
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
      const [ordersRes, resRes, menuRes, contactsRes] = await Promise.allSettled([
        orderAPI.getAll('all'),
        reservationAPI.getAll(),
        menuAPI.getAll('all', true),
        contactAPI.getAll(),
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

  // --- MENU ITEM HANDLERS ---
  const handleOpenAddMenuModal = () => {
    setEditingMenuItem(null);
    setMenuFormData({
      name: '',
      description: '',
      price: '',
      category: 'starters',
      tag: 'Veg',
      image: '/pictures-restaurant/Paneer-Tikka.png',
      available: true,
    });
    setShowMenuModal(true);
  };

  const handleOpenEditMenuModal = (item) => {
    setEditingMenuItem(item);
    setMenuFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      tag: item.tag || 'Veg',
      image: item.image || '/pictures-restaurant/Paneer-Tikka.png',
      available: item.available !== false,
    });
    setShowMenuModal(true);
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
        ...menuFormData,
        price: Number(menuFormData.price),
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
      r.time?.toLowerCase().includes(q)
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

  // Calculate quick stats
  const totalRevenue = orders.reduce((acc, o) => acc + (o.pricing?.totalAmount || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing').length;
  const activeReservationsCount = reservations.filter((r) => r.status !== 'cancelled').length;

  return (
    <div className="admin-page-container">
      {/* Top Navbar */}
      <header className="admin-header">
        <div className="admin-header-brand">
          <Link to="/" className="admin-logo">
            <img src="/pictures-restaurant/restaurant-logo.png" alt="TastyBite" />
            <span>TastyBite <strong>Admin</strong></span>
          </Link>
          <span className="admin-badge-live">Live Operations</span>
        </div>

        <div className="admin-header-actions">
          <button className="admin-refresh-btn" onClick={loadAllData} title="Refresh data">
            ↻ Refresh Data
          </button>
          <Link to="/" className="admin-exit-btn">
            &larr; Back to Restaurant
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
          <div className="stat-icon orders">🛍️</div>
          <div className="stat-info">
            <span className="stat-label">Active Orders</span>
            <h3 className="stat-val">{pendingOrdersCount} <small>/ {orders.length} total</small></h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon reservations">📅</div>
          <div className="stat-info">
            <span className="stat-label">Table Bookings</span>
            <h3 className="stat-val">{activeReservationsCount} <small>/ {reservations.length} total</small></h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon menu">🍕</div>
          <div className="stat-info">
            <span className="stat-label">Menu Dishes</span>
            <h3 className="stat-val">{menuItems.length}</h3>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="admin-tabs-bar">
        <button
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          🛍️ Live Orders ({orders.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          📅 Reservations ({reservations.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          🍕 Menu Management ({menuItems.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          ✉️ Inquiries ({contacts.length})
        </button>
      </div>

      {/* Main Content Area */}
      <main className="admin-main-content">
        {loading ? (
          <div className="admin-loading-state">
            <div className="loading-spinner"></div>
            <p>Loading restaurant dashboard data...</p>
          </div>
        ) : (
          <>
            {/* --- TAB 1: LIVE ORDERS --- */}
            {activeTab === 'orders' && (
              <div className="admin-tab-panel">
                <div className="panel-header-toolbar">
                  <div className="panel-title-block">
                    <h3>Customer Orders</h3>
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
                          <th>Type & Address</th>
                          <th>Items</th>
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

            {/* --- TAB 2: RESERVATIONS --- */}
            {activeTab === 'reservations' && (
              <div className="admin-tab-panel">
                <div className="panel-header-toolbar">
                  <div className="panel-title-block">
                    <h3>Table Reservations</h3>
                    <p>Manage dine-in seating bookings and customer requests.</p>
                  </div>

                  <div className="panel-search-box">
                    <input
                      type="text"
                      placeholder="Search by guest name or email..."
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
                          <th>Contact</th>
                          <th>Date & Time</th>
                          <th>Party Size</th>
                          <th>Special Requests</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReservations.map((res) => (
                          <tr key={res._id}>
                            <td><strong>{res.name}</strong></td>
                            <td>{res.email}</td>
                            <td>
                              <strong>{new Date(res.date).toLocaleDateString()}</strong> at <strong>{res.time}</strong>
                            </td>
                            <td>
                              <span className="guests-count-badge">👥 {res.guests} Guests</span>
                            </td>
                            <td>
                              <span className="res-msg">{res.message || 'No special requests'}</span>
                            </td>
                            <td>
                              <span className={`status-pill status-${res.status}`}>
                                {res.status?.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <div className="action-btn-group">
                                {res.status !== 'confirmed' && (
                                  <button
                                    className="action-btn-mini confirm"
                                    onClick={() => handleUpdateReservationStatus(res._id, 'confirmed')}
                                    title="Confirm Booking"
                                  >
                                    ✓ Confirm
                                  </button>
                                )}
                                {res.status !== 'cancelled' && (
                                  <button
                                    className="action-btn-mini cancel"
                                    onClick={() => handleUpdateReservationStatus(res._id, 'cancelled')}
                                    title="Cancel Booking"
                                  >
                                    ✕ Cancel
                                  </button>
                                )}
                                <button
                                  className="action-icon-btn delete"
                                  onClick={() => handleDeleteReservation(res._id)}
                                  title="Delete Reservation"
                                >
                                  🗑️
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
            )}

            {/* --- TAB 3: MENU MANAGEMENT --- */}
            {activeTab === 'menu' && (
              <div className="admin-tab-panel">
                <div className="panel-header-toolbar">
                  <div className="panel-title-block">
                    <h3>Menu Items & Catalog</h3>
                    <p>Add new culinary dishes, modify pricing, or toggle item stock availability.</p>
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
                          <span className="card-cat-badge">{item.category}</span>
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

            {/* --- TAB 4: CONTACT INQUIRIES --- */}
            {activeTab === 'contacts' && (
              <div className="admin-tab-panel">
                <div className="panel-header-toolbar">
                  <div className="panel-title-block">
                    <h3>Customer Messages & Inquiries</h3>
                    <p>Inquiries received from the Contact Us form.</p>
                  </div>
                </div>

                {contacts.length === 0 ? (
                  <div className="admin-empty-table">
                    <p>No customer messages found yet.</p>
                  </div>
                ) : (
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Sender Name</th>
                          <th>Email Address</th>
                          <th>Message Content</th>
                          <th>Received Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((msg, idx) => (
                          <tr key={msg._id || idx}>
                            <td><strong>{msg.name}</strong></td>
                            <td><a href={`mailto:${msg.email}`} className="admin-link">{msg.email}</a></td>
                            <td><p className="msg-preview-text">{msg.message}</p></td>
                            <td>{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Recent'}</td>
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
                    <option value="fried-rice-noodles">Fried Rice & Noodles</option>
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

              <div className="form-group">
                <label>Image URL / Path *</label>
                <input
                  type="text"
                  required
                  placeholder="/pictures-restaurant/Paneer-Tikka.png or https://..."
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

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={menuFormData.available}
                    onChange={(e) => setMenuFormData({ ...menuFormData, available: e.target.checked })}
                  />
                  <span>Mark dish as Available in Stock</span>
                </label>
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
