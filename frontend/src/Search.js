import React, { useEffect, useState } from "react";

function IBTSSearch() { 
  // ==================== STATE ====================
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [passengerCount, setPassengerCount] = useState("1");
  
  // Filter & Sort State
  const [sortOption, setSortOption] = useState("recommended");
  const [busTypeFilter, setBusTypeFilter] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [departureFilter, setDepartureFilter] = useState([]);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [selectedBusForBooking, setSelectedBusForBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState(true);

  // ==================== MOCK DATA ====================
  const popularRoutes = [
    { source: "Lucknow", destination: "Kanpur", icon: "🚍" },
    { source: "Varanasi", destination: "Prayagraj", icon: "🚍" },
    { source: "Gorakhpur", destination: "Lucknow", icon: "🚍" },
    { source: "Agra", destination: "Lucknow", icon: "🚍" },
  ];

  const busTypes = ["AC", "Non-AC", "Volvo", "Sleeper"];
  const departureSlots = [
    { label: "12:00 AM - 6:00 AM", value: "night" },
    { label: "6:00 AM - 12:00 PM", value: "morning" },
    { label: "12:00 PM - 6:00 PM", value: "afternoon" },
    { label: "6:00 PM - 12:00 AM", value: "evening" },
  ];

  // ==================== FETCH ====================
  useEffect(() => {
    fetch("http://localhost:4000/api/buses")
      .then((res) => res.json())
      .then((data) => {
        setBuses(data);
        setFilteredBuses(data);
      })
      .catch((err) => console.error("Error fetching buses:", err));
  }, []);

  // ==================== CALCULATIONS ====================
  const cheapestFare =
    filteredBuses.length > 0
      ? Math.min(...filteredBuses.map((bus) => bus.fare))
      : 0;

  const maxFare = buses.length > 0 ? Math.max(...buses.map((bus) => bus.fare)) : 5000;

  // ==================== FILTERING & SORTING ====================
  let displayedBuses = [...filteredBuses];

  // Apply type filter
  if (busTypeFilter.length > 0) {
    displayedBuses = displayedBuses.filter((bus) =>
      busTypeFilter.includes(bus.type)
    );
  }

  // Apply price filter
  displayedBuses = displayedBuses.filter(
    (bus) => bus.fare >= priceRange[0] && bus.fare <= priceRange[1]
  );

  // Apply departure time filter
  if (departureFilter.length > 0) {
    displayedBuses = displayedBuses.filter((bus) => {
      const hour = parseInt(bus.time.split(":")[0]);
      return departureFilter.some((slot) => {
        if (slot === "night") return hour >= 0 && hour < 6;
        if (slot === "morning") return hour >= 6 && hour < 12;
        if (slot === "afternoon") return hour >= 12 && hour < 18;
        if (slot === "evening") return hour >= 18 && hour < 24;
        return false;
      });
    });
  }

  // Apply sorting
  if (sortOption === "priceLow") {
    displayedBuses.sort((a, b) => a.fare - b.fare);
  } else if (sortOption === "priceHigh") {
    displayedBuses.sort((a, b) => b.fare - a.fare);
  } else if (sortOption === "departureEarly") {
    displayedBuses.sort(
      (a, b) =>
        new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`)
    );
  } else if (sortOption === "departureLate") {
    displayedBuses.sort(
      (a, b) =>
        new Date(`1970/01/01 ${b.time}`) - new Date(`1970/01/01 ${a.time}`)
    );
  } else if (sortOption === "rating") {
    displayedBuses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // ==================== HANDLERS ====================
  const handleSearch = async () => {
    if (!source.trim() || !destination.trim()) {
      alert("Please enter both source and destination");
      return;
    }

    if (source.toLowerCase() === destination.toLowerCase()) {
      alert("Source and destination cannot be the same");
      return;
    }

    setLoading(true);
    setSearchAttempted(true);

    try {
      const res = await fetch(
        `http://localhost:4000/api/buses/search?source=${source}&destination=${destination}`
      );
      const data = await res.json();
      setFilteredBuses(data || []);
      setSortOption("recommended");
      setBusTypeFilter([]);
      setDepartureFilter([]);
    } catch (err) {
      console.error("Search error:", err);
      setFilteredBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const swapLocations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const resetFilters = () => {
    setSortOption("recommended");
    setBusTypeFilter([]);
    setDepartureFilter([]);
    setPriceRange([0, maxFare]);
  };

  const resetAllSearch = () => {
    setSource("");
    setDestination("");
    setTravelDate("");
    setPassengerCount("1");
    setFilteredBuses(buses);
    setSearchAttempted(false);
    resetFilters();
  };

  const handleSelectBus = (bus) => {
    setSelectedBusForBooking(bus);
    setShowBookingModal(true);
  };

  const handleBusTypeChange = (type) => {
    setBusTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleDepartureChange = (slot) => {
    setDepartureFilter((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Poppins:wght@600;700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          font-family: 'Lato', sans-serif;
          color: #1f2937;
          line-height: 1.6;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          color: #111827;
        }

        /* ============ SCROLLBAR ============ */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* ============ HEADER ============ */
        .ibts-header {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #0f172a 100%);
          color: white;
          padding: 20px 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .header-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: white;
          flex-shrink: 0;
        }

        .logo-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 900;
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
        }

        .logo-text h1 {
          font-size: 18px;
          font-weight: 800;
          margin: 0;
          color: white;
          letter-spacing: 1px;
        }

        .logo-text p {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.75);
          margin: 0;
          font-style: italic;
          font-weight: 400;
        }

        .header-nav {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .nav-links {
          display: flex;
          gap: 24px;
        }

        .nav-links a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .nav-links a:hover {
          color: #fbbf24;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .user-menu:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: #fbbf24;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #1e40af;
          font-size: 14px;
        }

        /* ============ SEARCH SECTION ============ */
        .search-section {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #0f172a 100%);
          padding: 48px 20px;
          color: white;
        }

        .search-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .search-title {
          font-size: 36px;
          margin-bottom: 8px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .search-subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.75);
          margin-bottom: 32px;
        }

        .search-form {
          background: white;
          border-radius: 12px;
          padding: 28px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 14px;
          align-items: flex-end;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 11px;
          font-weight: 700;
          color: #374151;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input,
        .form-select {
          padding: 12px 14px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          font-family: 'Lato', sans-serif;
          transition: all 0.3s;
          background: white;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #1e40af;
          box-shadow: 0 0 0 4px rgba(30, 64, 175, 0.1);
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        .swap-btn {
          width: 44px;
          height: 44px;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.3s;
          color: #1e40af;
          font-weight: bold;
        }

        .swap-btn:hover {
          border-color: #1e40af;
          background: #f0f4f8;
          transform: rotate(180deg);
        }

        .search-actions {
          grid-column: 1 / -1;
          display: flex;
          gap: 12px;
        }

        .btn {
          flex: 1;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: 'Lato', sans-serif;
        }

        .btn-search {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          color: white;
        }

        .btn-search:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(30, 64, 175, 0.3);
        }

        .btn-reset {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-reset:hover {
          background: #e5e7eb;
        }

        /* ============ POPULAR ROUTES ============ */
        .popular-routes {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .routes-title {
          font-size: 20px;
          margin-bottom: 20px;
          color: #111827;
        }

        .routes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
        }

        .route-card {
          background: white;
          padding: 14px;
          border-radius: 10px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          text-align: center;
          text-decoration: none;
          color: #1f2937;
          font-weight: 600;
        }

        .route-card:hover {
          border-color: #1e40af;
          box-shadow: 0 8px 20px rgba(30, 64, 175, 0.15);
          transform: translateY(-2px);
        }

        .route-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }

        /* ============ MAIN LAYOUT ============ */
        .main-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 32px 20px;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 28px;
        }

        /* ============ SIDEBAR ============ */
        .filters-sidebar {
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .filter-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          margin-bottom: 16px;
        }

        .filter-header {
          padding: 16px;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.3s;
        }

        .filter-header:hover {
          background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
        }

        .filter-header h3 {
          font-size: 14px;
          margin: 0;
        }

        .filter-toggle {
          font-size: 16px;
          color: #6b7280;
        }

        .filter-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .filter-group-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #6b7280;
          letter-spacing: 0.5px;
          margin-top: 12px;
          margin-bottom: 8px;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background 0.3s;
        }

        .checkbox-wrapper:hover {
          background: #f9fafb;
        }

        .checkbox-wrapper input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #1e40af;
        }

        .checkbox-wrapper label {
          cursor: pointer;
          flex: 1;
          font-size: 13px;
          color: #374151;
          font-weight: 500;
        }

        .price-slider {
          width: 100%;
          accent-color: #1e40af;
        }

        .price-display {
          margin-top: 12px;
          padding: 12px;
          background: #f0f4f8;
          border-radius: 6px;
          text-align: center;
          font-weight: 700;
          color: #1e40af;
          font-size: 13px;
        }

        .btn-reset-filters {
          width: 100%;
          padding: 10px;
          background: #f3f4f6;
          border: none;
          border-radius: 6px;
          color: #374151;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-reset-filters:hover {
          background: #e5e7eb;
        }

        /* ============ RESULTS ============ */
        .results-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .results-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
        }

        .results-info {
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sort-dropdown {
          padding: 10px 14px;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          background: white;
          transition: all 0.3s;
        }

        .sort-dropdown:focus {
          outline: none;
          border-color: #1e40af;
          box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
        }

        /* ============ BUS CARD ============ */
        .bus-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 20px;
          align-items: center;
          border: 2px solid transparent;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .bus-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          border-color: #1e40af;
          transform: translateY(-2px);
        }

        .bus-card.cheapest {
          border-color: #10b981;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%);
        }

        .bus-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #1e40af 0%, #fbbf24 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .bus-card:hover::before {
          opacity: 1;
        }

        .bus-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
        }

        .bus-icon {
          font-size: 32px;
        }

        .bus-name {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .bus-meta {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }

        .bus-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .detail-icon {
          font-size: 18px;
          color: #1e40af;
        }

        .detail-content {
          font-size: 13px;
        }

        .detail-label {
          color: #6b7280;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: block;
          margin-bottom: 2px;
        }

        .detail-value {
          color: #1f2937;
          font-weight: 600;
          display: block;
        }

        .bus-amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .amenity-badge {
          display: inline-block;
          padding: 4px 10px;
          background: #f3f4f6;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: #374151;
        }

        .amenity-badge.wifi {
          background: rgba(59, 130, 246, 0.1);
          color: #1e40af;
        }

        .amenity-badge.power {
          background: rgba(251, 191, 36, 0.1);
          color: #92400e;
        }

        .amenity-badge.water {
          background: rgba(14, 165, 233, 0.1);
          color: #0369a1;
        }

        .price-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          min-width: 160px;
        }

        .price-tag {
          text-align: right;
        }

        .price-label {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: block;
          margin-bottom: 4px;
        }

        .price-value {
          font-size: 28px;
          font-weight: 900;
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cheapest-badge {
          display: inline-block;
          padding: 6px 12px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
        }

        .btn-book {
          padding: 12px 20px;
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
          width: 100%;
        }

        .btn-book:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(30, 64, 175, 0.3);
        }

        /* ============ EMPTY STATE ============ */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .empty-icon {
          font-size: 60px;
          margin-bottom: 16px;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .empty-text {
          color: #6b7280;
          font-size: 14px;
        }

        /* ============ LOADING ============ */
        .loading-container {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }

        .spinner {
          display: inline-block;
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top-color: #1e40af;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ============ MODAL ============ */
        .modal-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 2000;
        }

        .modal-overlay.active {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        /* ============ RESPONSIVE ============ */
        @media (max-width: 768px) {
          .main-content {
            grid-template-columns: 1fr;
          }

          .filters-sidebar {
            position: static;
          }

          .search-form {
            grid-template-columns: 1fr;
          }

          .bus-card {
            grid-template-columns: 1fr;
          }

          .price-section {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            min-width: auto;
          }

          .bus-details {
            grid-template-columns: 1fr;
          }

          .routes-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .search-title {
            font-size: 24px;
          }
        }
      `}</style>

      {/* ============ HEADER ============ */}
      <header className="ibts-header">
        <div className="header-container">
          <a href="#" className="logo-section">
            <div className="logo-icon">🚌</div>
            <div className="logo-text">
              <h1>IBTS</h1>
              <p>Intelligent Bus Transportation System</p>
            </div>
          </a>

          <nav className="header-nav">
            <div className="nav-links">
              <a href="#home">Home</a>
              <a href="#booking">Bookings</a>
              <a href="#tracking">Tracking</a>
              <a href="#about">About</a>
            </div>
            <div className="user-menu">
              <div className="user-avatar">👤</div>
              <span style={{ fontSize: "13px" }}>Guest</span>
            </div>
          </nav>
        </div>
      </header>

      {/* ============ SEARCH SECTION ============ */}
      <section className="search-section">
        <div className="search-container">
          <h2 className="search-title">Find Your Journey</h2>
          <p className="search-subtitle">
            Search, compare, and book buses across Uttar Pradesh
          </p>

          <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
            <div className="form-group">
              <label className="form-label">From</label>
              <input
                type="text"
                className="form-input"
                placeholder="Source city"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                list="cities"
              />
            </div>

            <button type="button" className="swap-btn" onClick={swapLocations} title="Swap locations">
              ⇄
            </button>

            <div className="form-group">
              <label className="form-label">To</label>
              <input
                type="text"
                className="form-input"
                placeholder="Destination city"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                list="cities"
              />
            </div>

            <datalist id="cities">
              {["Lucknow", "Kanpur", "Varanasi", "Prayagraj", "Gorakhpur", "Agra", "Meerut", "Ghaziabad"].map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Passengers</label>
              <select
                className="form-select"
                value={passengerCount}
                onChange={(e) => setPassengerCount(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} Passenger{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-actions">
              <button type="submit" className="btn btn-search">
                🔍 Search Buses
              </button>
              <button type="button" className="btn btn-reset" onClick={resetAllSearch}>
                Reset
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ============ POPULAR ROUTES ============ */}
      {!searchAttempted && (
        <section className="popular-routes">
          <h2 className="routes-title">🔥 Popular Routes</h2>
          <div className="routes-grid">
            {popularRoutes.map((route, idx) => (
              <button
                key={idx}
                className="route-card"
                onClick={() => {
                  setSource(route.source);
                  setDestination(route.destination);
                }}
              >
                <div className="route-icon">{route.icon}</div>
                <div>
                  <strong>{route.source}</strong>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>→</div>
                  <strong>{route.destination}</strong>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ============ MAIN CONTENT ============ */}
      {searchAttempted && (
        <div className="main-content">
          {/* ============ SIDEBAR ============ */}
          <aside className="filters-sidebar">
            <div className="filter-card">
              <div className="filter-header">
                <h3>🔍 Filters</h3>
                <span className="filter-toggle">▼</span>
              </div>
              <div className="filter-content">
                {/* Bus Type Filter */}
                <div>
                  <div className="filter-group-title">Bus Type</div>
                  {busTypes.map((type) => (
                    <label key={type} className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={busTypeFilter.includes(type)}
                        onChange={() => handleBusTypeChange(type)}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>

                {/* Price Filter */}
                <div>
                  <div className="filter-group-title" style={{ marginTop: "16px" }}>
                    Price Range
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxFare}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="price-slider"
                  />
                  <div className="price-display">
                    ₹0 - ₹{priceRange[1]}
                  </div>
                </div>

                {/* Departure Time Filter */}
                <div>
                  <div className="filter-group-title" style={{ marginTop: "16px" }}>
                    Departure Time
                  </div>
                  {departureSlots.map((slot) => (
                    <label key={slot.value} className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={departureFilter.includes(slot.value)}
                        onChange={() => handleDepartureChange(slot.value)}
                      />
                      <span>{slot.label}</span>
                    </label>
                  ))}
                </div>

                <button className="btn-reset-filters" onClick={resetFilters}>
                  Clear All Filters
                </button>
              </div>
            </div>
          </aside>

          {/* ============ RESULTS ============ */}
          <div className="results-container">
            <div className="results-toolbar">
              <div className="results-info">
                {loading ? (
                  "Loading..."
                ) : (
                  <>
                    {displayedBuses.length} Bus{displayedBuses.length !== 1 ? "es" : ""} Found
                  </>
                )}
              </div>
              <select
                className="sort-dropdown"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="departureEarly">Departure: Early</option>
                <option value="departureLate">Departure: Late</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p style={{ marginTop: "16px" }}>Searching for buses...</p>
              </div>
            ) : displayedBuses.length > 0 ? (
              displayedBuses.map((bus) => (
                <div
                  key={bus._id}
                  className={`bus-card ${bus.fare === cheapestFare ? "cheapest" : ""}`}
                >
                  {/* Left Side */}
                  <div>
                    <div className="bus-header">
                      <div className="bus-icon">🚌</div>
                      <div>
                        <h3 className="bus-name">{bus.name}</h3>
                        <p className="bus-meta">{bus.type} • {bus.route?.from} to {bus.route?.to}</p>
                      </div>
                    </div>

                    <div className="bus-details">
                      <div className="detail-item">
                        <span className="detail-icon">🕒</span>
                        <div className="detail-content">
                          <span className="detail-label">Departure</span>
                          <span className="detail-value">{bus.time}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">⏱️</span>
                        <div className="detail-content">
                          <span className="detail-label">Duration</span>
                          <span className="detail-value">{bus.duration || "~5 hrs"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bus-amenities">
                      <span className="amenity-badge wifi">📶 WiFi</span>
                      <span className="amenity-badge power">🔌 Power</span>
                      <span className="amenity-badge water">💧 Water</span>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="price-section">
                    <div className="price-tag">
                      <span className="price-label">Starting From</span>
                      <div className="price-value">₹{bus.fare}</div>
                    </div>
                    {bus.fare === cheapestFare && (
                      <span className="cheapest-badge">⭐ Best Price</span>
                    )}
                    <button
                      className="btn-book"
                      onClick={() => handleSelectBus(bus)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🚫</div>
                <h3 className="empty-title">No Buses Found</h3>
                <p className="empty-text">
                  Try searching for different routes or adjust your filters
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ BOOKING MODAL ============ */}
      <div className={`modal-overlay ${showBookingModal ? "active" : ""}`}>
        {selectedBusForBooking && (
          <div className="modal-content">
            <h2 style={{ marginBottom: "16px" }}>Complete Your Booking</h2>
            <p style={{ color: "#6b7280", marginBottom: "16px" }}>
              Bus: <strong>{selectedBusForBooking.name}</strong>
            </p>
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>
              {selectedBusForBooking.route?.from} → {selectedBusForBooking.route?.to}
            </p>
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>
              Passengers: <strong>{passengerCount}</strong>
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                className="btn btn-search"
                style={{ flex: 1 }}
                onClick={() => {
                  alert(`Booking confirmed for ${passengerCount} passenger(s) on ${selectedBusForBooking.name}`);
                  setShowBookingModal(false);
                }}
              >
                Proceed to Payment
              </button>
              <button
                className="btn btn-reset"
                style={{ flex: 1 }}
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IBTSSearch;
