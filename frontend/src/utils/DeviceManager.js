/**
 * DeviceManager.js
 * Singleton Pattern implementation for managing smart home devices
 */

class DeviceManager {
  constructor() {
    // Private instance - will hold the single instance of DeviceManager
    if (DeviceManager.instance) {
      return DeviceManager.instance;
    }

    // Initialize devices array
    this.devices = [];
    
    // Load devices from localStorage if available
    this.loadFromLocalStorage();

    // Set the instance
    DeviceManager.instance = this;
  }

  /**
   * Get all devices
   * @returns {Array} Array of all devices
   */
  getAllDevices() {
    return this.devices;
  }

  /**
   * Get a device by ID
   * @param {number} id - Device ID
   * @returns {Object|null} Device object or null if not found
   */
  getDeviceById(id) {
    return this.devices.find(device => device.id === id) || null;
  }

  /**
   * Add a new device
   * @param {Object} device - Device object
   * @returns {Object} Added device with generated ID
   */
  addDevice(device) {
    const newId = this.devices.length > 0 
      ? Math.max(...this.devices.map(d => d.id)) + 1 
      : 1;
    
    const newDevice = {
      ...device,
      id: newId,
      lastActive: 'Just now'
    };
    
    this.devices.push(newDevice);
    this.saveToLocalStorage();
    return newDevice;
  }

  /**
   * Update a device
   * @param {number} id - Device ID
   * @param {Object} updates - Object with properties to update
   * @returns {Object|null} Updated device or null if not found
   */
  updateDevice(id, updates) {
    const index = this.devices.findIndex(device => device.id === id);
    if (index === -1) return null;
    
    this.devices[index] = {
      ...this.devices[index],
      ...updates,
      lastActive: 'Just now'
    };
    
    this.saveToLocalStorage();
    return this.devices[index];
  }

  /**
   * Toggle device status (on/off)
   * @param {number} id - Device ID
   * @returns {Object|null} Updated device or null if not found
   */
  toggleDeviceStatus(id) {
    const device = this.getDeviceById(id);
    if (!device) return null;
    
    return this.updateDevice(id, { status: !device.status });
  }

  /**
   * Delete a device
   * @param {number} id - Device ID
   * @returns {boolean} True if deleted, false if not found
   */
  deleteDevice(id) {
    const initialLength = this.devices.length;
    this.devices = this.devices.filter(device => device.id !== id);
    const deleted = this.devices.length !== initialLength;
    
    if (deleted) {
      this.saveToLocalStorage();
    }
    
    return deleted;
  }

  /**
   * Search devices by name
   * @param {string} query - Search query
   * @returns {Array} Array of matching devices
   */
  searchDevices(query) {
    if (!query) return this.devices;
    
    const normalizedQuery = query.toLowerCase();
    return this.devices.filter(device => 
      device.name.toLowerCase().includes(normalizedQuery)
    );
  }
  
  /**
   * Save devices to localStorage
   */
  saveToLocalStorage() {
    localStorage.setItem('devices', JSON.stringify(this.devices));
  }
  
  /**
   * Load devices from localStorage
   */
  loadFromLocalStorage() {
    const savedDevices = localStorage.getItem('devices');
    if (savedDevices) {
      this.devices = JSON.parse(savedDevices);
    }
  }
}

// Create and export a single instance
const deviceManager = new DeviceManager();
Object.freeze(deviceManager); // Prevent modification of the instance

export default deviceManager;