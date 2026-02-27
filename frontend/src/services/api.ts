const BASE_URL = 'http://localhost:8080/api';

export const apiService = {
  // Helper to get headers (including Token if it exists)
  getHeaders() {
    const headers: any = {
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('token'); // Check if user is logged in
    if (token) {
      headers['Authorization'] = `Bearer ${token}`; // Send token to Java
    }
    return headers;
  },

  async createBooking(bookingData: any) {
    try {
      console.log("Sending booking to Java:", bookingData);

      const response = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: apiService.getHeaders(), // Use the helper above
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Booking failed.");
      }
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async getServices() {
    try {
      const response = await fetch(`${BASE_URL}/services`, {
        headers: apiService.getHeaders()
      });
      if (!response.ok) throw new Error("Failed to fetch services");
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  }
};