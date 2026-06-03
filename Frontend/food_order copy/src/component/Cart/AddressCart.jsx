import React from 'react';
import { Card, Button } from 'reactstrap';
import { FaHome, FaMapMarkerAlt } from 'react-icons/fa';

const AddressCart = ({ item, showButton, handleSelectAddress }) => {
  return (
    <Card className="d-flex flex-row gap-3 p-4 w-100 flex-wrap"  style={{backgroundColor:"#191919"}}>
      <FaHome size={35} className="text-white" />
      <div className="space-y-3 text-gray-500">
        <h1 className="font-semibold text-sm" style={{ fontFamily: "Roboto, Helvetica, Arial, sans-serif" }}>Mumbai, New Shivam Building, Gokuldham Market, Maha India</h1>
       
        {showButton && (
        <Button
        outline
        block
        onClick={() => handleSelectAddress(item)}
        style={{
          color: '#E91E63',       // Set the text color
          borderColor: '#E91E63', // Set the outline border color
          backgroundColor: 'transparent', // Keep the background transparent
        }}
      >
        SELECT
      </Button>
      
        )}
      </div>
    </Card>
  );
};

export default AddressCart;
