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
        console.log('All devices fetched from API:', response.data);
        devicesData = response.data;
      } else if (response.data && response.data.devices && Array.isArray(response.data.devices)) {
        // Handle case where API returns { devices: [...] } format
        devicesData = response.data.devices;
      }
      
      // Add each device to the existing array
      devicesData.forEach(device => this.devices.push(device));
      console.log('All devices fetched from API:', this.devices);
      
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
      // Create device on server first
        const response = await axios.post(`${this.apiBaseUrl}/devices`, device);
        const serverDevice = response.data;
        this.devices.push(serverDevice);
        return serverDevice;

    } catch (error) {
      console.error('Error adding device to server:', error);
      
      // Fallback to local device creation
      const newId = this.devices.length > 0 
        ? Math.max(...this.devices.map(d => d.id)) + 1 
        : 1;
      
      const newDevice = {
        ...device,
        id: newId,
        lastActive: 'Just now'
      };
      
      this.devices.push(newDevice);
      return newDevice;
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
    // const device_id = id;
    // console.log('Updating device with ID:', device_id);
    // console.log('Updating device with index pos:', index);
    if (index === -1) return null;
    
    try {
        const response = await axios.put(`${this.apiBaseUrl}/devices/${id}`, updates);
        console.log('Device updated on server:', response.data);
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

  // /**
  //  * Toggle device status (on/off)
  //  * @param {number} id - Device ID
  //  * @returns {Promise<Object|null>} Promise resolving to updated device or null if not found
  //  */
  // async toggleDeviceStatus(id) {
  //   const device = this.getDeviceById(id);
  //   if (!device) return null;
    
  //   try {
          // Update device status on Adafruit IO if feed key is available
  //     if (device.feedKey) {
  //       const newStatus = !device.status;
  //       const value = newStatus ? '1' : '0';
        
           // Send to Adafruit IO
  //       const url = `${this.adafruitBaseUrl}/${this.username}/feeds/${device.feedKey}/data`;
  //       await axios.post(url, {
  //         value: value
  //       }, {
  //         headers: {
  //           'X-AIO-Key': device.aioKey || localStorage.getItem('adafruitKey'),
  //           'Content-Type': 'application/json'
  //         }
  //       });
  //     }
      
      // Then update in our system
  //     return await this.updateDevice(id, { status: !device.status });
  //   } catch (error) {
  //     console.error('Error toggling device status:', error);
      // Fallback to local toggle
  //     return this.updateDevice(id, { status: !device.status });
  //   }
  // }

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
      console.error('Error deleting device from server:', error);
      
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