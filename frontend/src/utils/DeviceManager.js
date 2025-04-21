/**
 * DeviceManager.js
 * Singleton Pattern implementation for managing smart home devices
 * Updated with API integration for backend communication
 */

import axios from 'axios';

class DeviceManager {
  constructor() {
    // Private instance - will hold the single instance of DeviceManager
    if (DeviceManager.instance) {
      return DeviceManager.instance;
    }

    // Initialize devices array
    this.devices = [];
    
    // API base URL
    this.apiBaseUrl = 'http://localhost:8000/api';
    
    // Adafruit IO API configuration
    this.adafruitBaseUrl = 'https://io.adafruit.com/api/v2';
    this.username = 'An_Loi'; // Lấy từ UsagePage.jsx

    // Set the instance
    DeviceManager.instance = this;
    
    // Fetch devices from API when instance is created
    this.fetchDevices();
  }

  /**
   * Get all devices
   * @returns {Array} Array of all devices
   */
  getAllDevices() {
    return this.devices;
  }
  
  /**
   * Fetch devices from backend API
   * @returns {Promise<Array>} Promise resolving to array of devices
   */
  async fetchDevices() {
    try {
      // Fetch all devices from backend API
      const response = await axios.get(`${this.apiBaseUrl}/devices/all`)
      
      // Clear the current devices array without reassigning it
      this.devices.length = 0;
      
      let devicesData = [];
      if (response.data && Array.isArray(response.data)) {
        devicesData = response.data;
      } else if (response.data && response.data.devices && Array.isArray(response.data.devices)) {
        // Handle case where API returns { devices: [...] } format
        devicesData = response.data.devices;
      }
      
      // Add each device to the existing array
      devicesData.forEach(device => this.devices.push(device));
      return this.devices;

    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  }

  /**
   * Get a device by ID
   * @param {number} id - Device ID
   * @returns {Object|null} Device object or null if not found
   */
  getDeviceById(id) {
    return this.devices.find(device => device._id === id) || null;
  }

  /**
   * Add a new device
   * @param {Object} device - Device object
   * @returns {Promise<Object>} Promise resolving to added device with generated ID
   */
  async addDevice(device) {
    try {
      // Create a new device object without the speed property
      const deviceToAdd = { ...device };
      
      // Only include speed if it's a fan device
      if (device.type !== 'fan' && 'speed' in deviceToAdd) {
        delete deviceToAdd.speed;
      }
      
      // Create device on server first
      const response = await axios.post(`${this.apiBaseUrl}/devices`, deviceToAdd);
      const serverDevice = response.data;
      this.devices.push(serverDevice);
      return serverDevice;

    } catch (error) {
      console.error('Error adding device on server:', error);
      // Fallback code is commented out
    }
  }

  /**
   * Update a device
   * @param {number} id - Device ID
   * @param {Object} updates - Object with properties to update
   * @returns {Promise<Object|null>} Promise resolving to updated device or null if not found
   */
  async updateDevice(id, updates) {
    const index = this.devices.findIndex(device => device._id === id);
    if (index === -1) return null;
    
    try {
        const response = await axios.put(`${this.apiBaseUrl}/devices/${id}`, updates);
        if (response.data) {
          // Use the device returned from the server
          const serverDevice = response.data;
          this.devices[index] = serverDevice;
          return serverDevice;
        }

      return this.devices[index];
    } catch (error) {
      console.error('Error updating device on server:', error);
    }
  }

  /**
   * Delete a device
   * @param {number} id - Device ID
   * @returns {Promise<boolean>} Promise resolving to true if deleted, false if not found
   */
  async deleteDevice(id) {
    const index = this.devices.findIndex(device => device._id === id);
    if (index === -1) return false;
    
    try {
      // Delete device on server first
        await axios.delete(`${this.apiBaseUrl}/devices/${id}`);
      
      
      // Then remove from local array
      this.devices.splice(index, 1);
      return true;
    } catch (error) {
      // Fallback to local deletion
      this.devices.splice(index, 1);
      return true;
    }
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
   * Sync device with Adafruit IO
   * @param {number} id - Device ID
   * @param {string} value - Value to send to Adafruit IO
   * @returns {Promise<boolean>} Promise resolving to true if synced successfully
   */
  async syncWithAdafruitIO(id, value) {
    const device = this.getDeviceById(id);
    if (!device || !device.feedKey) return false;
    
    try {
      const url = `${this.adafruitBaseUrl}/${this.username}/feeds/${device.feedKey}/data`;
      await axios.post(url, {
        value: value
      }, {
        headers: {
          'X-AIO-Key': device.aioKey || localStorage.getItem('adafruitKey'),
          'Content-Type': 'application/json'
        }
      });
      return true;
    } catch (error) {
      console.error('Error syncing with Adafruit IO:', error);
      return false;
    }
  }
  
  /**
   * Get latest data from Adafruit IO feed
   * @param {string} feedKey - Adafruit IO feed key
   * @returns {Promise<Object|null>} Promise resolving to feed data or null if error
   */
  async getLatestFeedData(feedKey) {
    if (!feedKey) return null;
    
    try {
      const response = await axios.get(`${this.adafruitBaseUrl}/${this.username}/feeds/${feedKey}/data/last`);
      return response.data;
    } catch (error) {
      console.error(`Error getting latest data for feed ${feedKey}:`, error);
      return null;
    }
  }
  
}

// Create and export a single instance
const deviceManager = new DeviceManager();
Object.freeze(deviceManager); // Prevent modification of the instance

export default deviceManager;