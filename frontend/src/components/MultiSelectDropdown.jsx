import React, { useState } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  color: #406170;
  display: inline-block;
  margin: 5px;
  font-size: 13px;
  transition-duration: 0.4s;
`;

const DropdownContent = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: absolute;
  background-color: #CCC8B2;
  border-radius: 5px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  width: 100%;
`;

const DropdownItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: normal;
  &:hover {
    background-color: #ddd;
    font-weight: bold;
  }
  background-color: ${(props) =>
    props.selected ? "#a8a09a" : "transparent"}; /* Add selected color */
`;

const DropdownButton = styled.button`
  color: #406170;
  background-color: #CCC8B2;
  padding: 5px 20px;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  border-radius: 50px;
  font-size: 14px;
  font-weight: bold;
  /* Add this to make sure button doesn't behave like a submit button */
  type: button;
`;

function MultiSelectDropdown({
  items,
  selectedItems,
  onSelectItem,
  placeholder,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = (e) => {
    e.preventDefault(); // prevent default form submit
    e.stopPropagation(); // prevent event bubbling
    setIsOpen(!isOpen);
  };

  const handleItemClick = (value, e) => {
    e.preventDefault(); // prevent default form submit
    e.stopPropagation();
    onSelectItem(value);
  };

  return (
    <DropdownContainer>
      <DropdownButton type="button" onClick={handleButtonClick}> {/* Add type="button" */}
        {selectedItems.length > 0
          ? `${selectedItems.length} selected`
          : placeholder}
      </DropdownButton>
      <DropdownContent show={isOpen}>
        {items.map((item) => (
          <DropdownItem
            key={item.id}
            onClick={(e) => handleItemClick(item.id, e)}
            selected={selectedItems.includes(item.id)}
          >
            {item.name}
          </DropdownItem>
        ))}
      </DropdownContent>
    </DropdownContainer>
  );
}

export default MultiSelectDropdown;
