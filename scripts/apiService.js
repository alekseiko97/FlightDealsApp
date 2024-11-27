// apiService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/scrape';

export const fetchFlightDeals = async (filter) => {
  try {
    const params = {
        page: filter.currentPage,
        pageSize: filter.pageSize,
        sort: filter.sortColumn,
        sortOrder: filter.sortOrder,
        airline: filter.airline,
        outboundDate: filter.outboundDate,
        inboundDate: filter.inboundDate
    }

    const response = await axios.get(API_URL, { params });

    return response.data.flights;
  } catch (error) {
    console.error('Error fetching flight deals:', error);
    throw error;
  }
};