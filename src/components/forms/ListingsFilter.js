// \src\components\forms\ListingsFilter.js

import React from "react";
import tw from "twin.macro";
import styled from "styled-components";

const FilterContainer = tw.div`p-8 bg-white shadow-md rounded-lg max-w-4xl mx-auto`;

const FormContainer = styled.div`
  ${tw`grid grid-cols-1 md:grid-cols-2 gap-8`}
`;

const InputContainer = styled.div`
  ${tw`flex flex-col`}
`;

const Label = tw.label`text-sm font-semibold mb-2 text-gray-700`;
const Select = tw.select`border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-500`;

const FilterButton = tw.button`mt-6 px-6 py-2 bg-primary-500 text-white font-bold rounded-lg shadow-md hover:bg-primary-700 transition duration-300`;

const ListingsFilter = ({ onSortChange, onFilterChange }) => {
  return (
    <FilterContainer>
      <FormContainer>
        <InputContainer>
          <Label htmlFor="sort">Sort By</Label>
          <Select id="sort" onChange={onSortChange}>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </Select>
        </InputContainer>

        <InputContainer>
          <Label htmlFor="filter">Filter By</Label>
          <Select id="filter" onChange={onFilterChange}>
            <option value="all">All Listings</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
          </Select>
        </InputContainer>
      </FormContainer>

      <FilterButton type="button">Apply Filters</FilterButton>
    </FilterContainer>
  );
};

export default ListingsFilter;
