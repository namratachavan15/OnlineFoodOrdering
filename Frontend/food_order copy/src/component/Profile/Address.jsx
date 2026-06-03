// Address.js - Professional Redesign

import React, { useState } from "react";
import { Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from "reactstrap";
import { FaMapMarkerAlt, FaHome, FaBriefcase, FaEdit, FaTrashAlt, FaPlus, FaPhone, FaCity, FaBuilding, FaGlobe } from "react-icons/fa";
import { useAuth } from "../Auth/AuthContext";
import "./Address.css";

const Address = () => {
  const { user } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const getAddressIcon = (type) => {
    switch(type) {
      case 'home': return <FaHome />;
      case 'work': return <FaBriefcase />;
      default: return <FaMapMarkerAlt />;
    }
  };

  const getAddressTypeLabel = (type) => {
    switch(type) {
      case 'home': return 'Home Address';
      case 'work': return 'Work Address';
      default: return 'Other Address';
    }
  };

  const handleEdit = (address) => {
    setSelectedAddress(address);
    setEditModalOpen(true);
  };

  const handleDelete = (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      // Add delete logic here
      console.log("Delete address:", addressId);
    }
  };

  const handleSetDefault = (addressId) => {
    // Add set default logic here
    console.log("Set default address:", addressId);
  };

  if (!user?.address || user.address.length === 0) {
    return (
      <div className="address-container">
        <div className="address-header">
          <h2>
            <FaMapMarkerAlt /> Saved Addresses
          </h2>
          <p>Manage your delivery addresses</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">
            <FaMapMarkerAlt />
          </div>
          <h3>No Addresses Saved</h3>
          <p>Add your first address to start ordering</p>
          <button className="empty-action-btn" onClick={() => setEditModalOpen(true)}>
            <FaPlus /> Add New Address
          </button>
        </div>

        {/* Add Address Modal */}
        <Modal isOpen={editModalOpen} toggle={() => setEditModalOpen(false)} className="address-modal">
          <ModalHeader toggle={() => setEditModalOpen(false)}>
            <div className="modal-title">
              <FaMapMarkerAlt /> Add New Address
            </div>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Full Name</Label>
              <Input type="text" placeholder="Enter full name" />
            </FormGroup>
            <FormGroup>
              <Label>Phone Number</Label>
              <Input type="tel" placeholder="Enter phone number" />
            </FormGroup>
            <FormGroup>
              <Label>Street Address</Label>
              <Input type="text" placeholder="House number, street name" />
            </FormGroup>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>City</Label>
                  <Input type="text" placeholder="City" />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>State</Label>
                  <Input type="text" placeholder="State" />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Postal Code</Label>
                  <Input type="text" placeholder="Pincode" />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Country</Label>
                  <Input type="text" placeholder="Country" defaultValue="India" />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label>Address Type</Label>
              <Input type="select">
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>
                <input type="checkbox" /> Set as default address
              </Label>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button color="primary" style={{ backgroundColor: '#E91E63', border: 'none' }}>Save Address</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }

  return (
    <div className="address-container">
      <div className="address-header">
        <h2>
          <FaMapMarkerAlt /> Saved Addresses
        </h2>
        <p>Manage your delivery addresses</p>
      </div>

      <div className="address-grid">
        {user.address.map((address) => (
          <div key={address.id} className="address-card">
            {address.isDefault && <span className="default-badge">Default</span>}
            
            <div className="address-card-header">
              <div className="address-icon-wrapper">
                {getAddressIcon(address.type)}
              </div>
              <div className="address-name">
                <h4>{address.fullName || user.fullName}</h4>
                <div className="address-type">
                  {getAddressTypeLabel(address.type)}
                </div>
              </div>
            </div>

            <div className="address-card-body">
              <div className="address-line">
                <FaMapMarkerAlt />
                <span>
                  <strong>Address:</strong> {address.streetAddress}
                </span>
              </div>
              <div className="address-line">
                <FaCity />
                <span>
                  <strong>City:</strong> {address.city}, {address.state}
                </span>
              </div>
              <div className="address-line">
                <FaBuilding />
                <span>
                  <strong>Postal Code:</strong> {address.postalCode}
                </span>
              </div>
              <div className="address-line">
                <FaGlobe />
                <span>
                  <strong>Country:</strong> {address.country || "India"}
                </span>
              </div>
              <div className="address-phone">
                <FaPhone />
                <span>{address.phoneNumber || user.phone || "+91 98765 43210"}</span>
              </div>
            </div>

            <div className="address-card-actions">
              <button className="action-icon-btn" onClick={() => handleSetDefault(address.id)}>
                <FaMapMarkerAlt /> Set Default
              </button>
              <button className="action-icon-btn" onClick={() => handleEdit(address)}>
                <FaEdit /> Edit
              </button>
              <button className="action-icon-btn delete" onClick={() => handleDelete(address.id)}>
                <FaTrashAlt /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="add-address-btn" onClick={() => setEditModalOpen(true)}>
        <FaPlus /> Add New Address
      </button>

      {/* Edit Address Modal */}
      <Modal isOpen={editModalOpen} toggle={() => setEditModalOpen(false)} className="address-modal">
        <ModalHeader toggle={() => setEditModalOpen(false)}>
          <div className="modal-title">
            <FaEdit /> {selectedAddress ? "Edit Address" : "Add New Address"}
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Full Name</Label>
            <Input type="text" placeholder="Enter full name" defaultValue={selectedAddress?.fullName || user.fullName} />
          </FormGroup>
          <FormGroup>
            <Label>Phone Number</Label>
            <Input type="tel" placeholder="Enter phone number" defaultValue={selectedAddress?.phoneNumber || user.phone} />
          </FormGroup>
          <FormGroup>
            <Label>Street Address</Label>
            <Input type="text" placeholder="House number, street name" defaultValue={selectedAddress?.streetAddress} />
          </FormGroup>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>City</Label>
                <Input type="text" placeholder="City" defaultValue={selectedAddress?.city} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>State</Label>
                <Input type="text" placeholder="State" defaultValue={selectedAddress?.state} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Postal Code</Label>
                <Input type="text" placeholder="Pincode" defaultValue={selectedAddress?.postalCode} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Country</Label>
                <Input type="text" placeholder="Country" defaultValue={selectedAddress?.country || "India"} />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label>Address Type</Label>
            <Input type="select" defaultValue={selectedAddress?.type || "home"}>
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>
              <input type="checkbox" defaultChecked={selectedAddress?.isDefault} /> Set as default address
            </Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button color="primary" style={{ backgroundColor: '#E91E63', border: 'none' }}>
            {selectedAddress ? "Update Address" : "Save Address"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Address;