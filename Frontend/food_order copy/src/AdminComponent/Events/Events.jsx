import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { IoMdClose, IoMdCalendar, IoMdTime, IoMdPin, IoMdImage } from 'react-icons/io';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import EventCard from './EventCard';
import { useRestaurantContext } from '../../component/State/Restaurant/RestaurantContext';
import './Events.css';

const initialValues = {
  image: '',
  location: '',
  name: '',
  startedAt: '',
  endsAt: '',
  description: '',
};

const Events = () => {
  const { events, loading, error, getAllEvents, createEvent, usersRestaurant,getRestaurantEvents } = useRestaurantContext();
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const jwt = localStorage.getItem('jwt');

useEffect(() => {
  if (usersRestaurant?.id && jwt) {
    getRestaurantEvents({
      restaurantId: usersRestaurant.id,
      jwt
    });
  }
}, [usersRestaurant?.id]);


  const handleOpen = () => {
    setOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const handleClose = () => {
    setOpen(false);
    setFormValues(initialValues);
    document.body.style.overflow = 'auto';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!usersRestaurant || !usersRestaurant.id) {
      console.error("Restaurant ID is missing.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createEvent({ eventData: formValues, jwt, restaurantId: usersRestaurant.id });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        handleClose();
      }, 1500);
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="events-loading-state">
        <FaSpinner className="spinning" />
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-error-state">
        <div className="error-icon">⚠️</div>
        <h3>Error loading events</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="events-dashboard">
      <div className="events-header">
        <div className="events-header-content">
          <h1>Events Management</h1>
          <p>Create and manage special events, promotions, and offers</p>
        </div>
        <button onClick={handleOpen} className="create-event-btn">
          <IoMdCalendar /> Create Event
        </button>
      </div>

      <div className="events-container">
        {events && events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="empty-events-state">
            <div className="empty-icon">📅</div>
            <h3>No events yet</h3>
            <p>Create your first event to attract more customers</p>
            <button onClick={handleOpen} className="empty-create-btn">
              <IoMdCalendar /> Create Event
            </button>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {open && (
        <div className="event-modal-overlay" onClick={handleClose}>
          <div className="event-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-header">
              <div className="modal-title-section">
                <div className="modal-icon-wrapper">
                  <IoMdCalendar />
                </div>
                <h3>Create New Event</h3>
              </div>
              <button className="modal-close-btn" onClick={handleClose}>
                <IoMdClose />
              </button>
            </div>

            <div className="event-modal-body">
              {showSuccess && (
                <div className="success-toast-event">
                  <FaCheckCircle />
                  <span>Event created successfully!</span>
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <div className="form-header-event">
                  <div className="form-icon-event">
                    🎉
                  </div>
                  <h3>Event Details</h3>
                  <p>Fill in the information about your special event</p>
                </div>

                <FormGroup>
                  <Label for="name" className="form-label-event">
                    Event Name *
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={formValues.name}
                    onChange={handleFormChange}
                    placeholder="e.g., Summer Festival, Weekend Special"
                    required
                    className="form-input-event"
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="description" className="form-label-event">
                    Description
                  </Label>
                  <Input
                    type="textarea"
                    name="description"
                    id="description"
                    rows="3"
                    value={formValues.description}
                    onChange={handleFormChange}
                    placeholder="Describe the event, offers, and what customers can expect..."
                    className="form-textarea-event"
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="location" className="form-label-event">
                    <IoMdPin className="label-icon-event" /> Location
                  </Label>
                  <Input
                    type="text"
                    name="location"
                    id="location"
                    value={formValues.location}
                    onChange={handleFormChange}
                    placeholder="Event location or venue"
                    required
                    className="form-input-event"
                  />
                </FormGroup>

                <div className="event-datetime-row">
                  <FormGroup className="datetime-group">
                    <Label for="startedAt" className="form-label-event">
                      <IoMdTime className="label-icon-event" /> Start Date & Time
                    </Label>
                    <Input
                      type="datetime-local"
                      name="startedAt"
                      id="startedAt"
                      value={formValues.startedAt}
                      onChange={handleFormChange}
                      required
                      className="form-input-event datetime"
                    />
                  </FormGroup>

                  <FormGroup className="datetime-group">
                    <Label for="endsAt" className="form-label-event">
                      <IoMdTime className="label-icon-event" /> End Date & Time
                    </Label>
                    <Input
                      type="datetime-local"
                      name="endsAt"
                      id="endsAt"
                      value={formValues.endsAt}
                      onChange={handleFormChange}
                      required
                      className="form-input-event datetime"
                    />
                  </FormGroup>
                </div>

                <FormGroup>
                  <Label for="image" className="form-label-event">
                    <IoMdImage className="label-icon-event" /> Image URL
                  </Label>
                  <Input
                    type="text"
                    name="image"
                    id="image"
                    value={formValues.image}
                    onChange={handleFormChange}
                    placeholder="https://example.com/event-image.jpg"
                    className="form-input-event"
                  />
                </FormGroup>

                <div className="form-actions-event">
                  <Button type="button" className="cancel-btn-event" onClick={handleClose}>
                    <FaTimesCircle /> Cancel
                  </Button>
                  <Button type="submit" className="submit-btn-event" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="spinning-small" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        Create Event
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;