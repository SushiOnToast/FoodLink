import React, { useState } from "react";
import styled from "styled-components";

// Styled component for the container of the dropdown
const DropdownContainer = styled.div`
  position: relative;
  color: #FDFAE7;
  display: inline-block;
  font-size: 13px;
  transition-duration: 0.4s;
`;

// Styled component for the dropdown content (list of items)
const DropdownContent = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: absolute;
  background-color: black;
  border-radius: 5px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  width: 100%;
`;

// Styled component for each item in the dropdown
const DropdownItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  &:hover {
    background-color: #6c6c6c;
  }
  background-color: ${(props) =>
    props.selected ? "#6c6c6c" : "transparent"}; /* Highlight selected items */
`;

// Styled component for the dropdown button
const DropdownButton = styled.button`
  color: #FDFAE7;
  background-color: black;
  padding: 7px 20px;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 400;
  type: button; /* Ensure button doesn't act like a form submit button */
`;

function MultiSelectDropdown({
  items,
  selectedItems,
  onSelectItem,
  placeholder,
}) {
  // Stat#afaeaeack whether the dropdown is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the dropdown visibility when the button is clicked
  const handleButtonClick = (e) => {
    e.preventDefault(); // Prevent default form submission (if inside a form)
    e.stopPropagation(); // Prevent event bubbling
    setIsOpen(!isOpen); // Toggle the dropdown's open/close state
  };

  // Handle selection of an item from the dropdown
  const handleItemClick = (value, e) => {
    e.preventDefault(); // Prevent default form submission
    e.stopPropagation(); // Prevent event bubbling
    onSelectItem(value); // Pass the selected item's value to the parent component
  };

  return (
    <DropdownContainer>
      {/* Button to open/close the dropdown, displaying the number of selected items */}
      <DropdownButton type="button" onClick={handleButtonClick}>
        {selectedItems.length > 0
          ? `${selectedItems.length} selected`
          : placeholder}{" "}
        {/* Show placeholder when no items are selected */}
      </DropdownButton>

      {/* Dropdown menu content */}
      <DropdownContent show={isOpen}>
        {/* Map over the items to display each as a selectable option */}
        {items.map((item) => (
          <DropdownItem
            key={item.id}
            onClick={(e) => handleItemClick(item.id, e)}
            selected={selectedItems.includes(item.id)} // Highlight selected items
          >
            {item.name} {/* Display the item's name */}
          </DropdownItem>
        ))}
      </DropdownContent>
    </DropdownContainer>
  );
}

export default MultiSelectDropdown;
