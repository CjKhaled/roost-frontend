// src/store/listingsSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  listings: [
    {
      Id: 1,
      name: "Cozy Apartment",
      bedCount: 2,
      bathCount: 1,
      address: "123 Main St, Cityville",
      createdAt: "2023-10-01T12:00:00Z",
      updatedAt: "2023-10-01T12:00:00Z",
      createdById: "user-uuid-1",
    },
    {
      Id: 2,
      name: "Luxury Condo",
      bedCount: 3,
      bathCount: 2,
      address: "456 Market St, Townsville",
      createdAt: "2023-10-02T12:00:00Z",
      updatedAt: "2023-10-02T12:00:00Z",
      createdById: "user-uuid-2",
    },
    // Add more listings as needed
  ],
};

const listingsSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    setListings: (state, action) => {
      state.listings = action.payload;
    },
    addListing: (state, action) => {
      state.listings.push(action.payload);
    },
    updateListing: (state, action) => {
      const index = state.listings.findIndex(listing => listing.Id === action.payload.Id);
      if (index !== -1) {
        state.listings[index] = { ...state.listings[index], ...action.payload };
      }
    },
  },
});

export const { setListings, addListing, updateListing } = listingsSlice.actions;
export default listingsSlice.reducer;
