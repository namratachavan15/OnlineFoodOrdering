import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import EventCard from './EventCard';
import { useRestaurantContext } from '../../component/State/Restaurant/RestaurantContext';

const Events = () => {
  const { events, loading, error, getAllEvents } = useRestaurantContext(); // Removed createEvent and usersRestaurant
  const [formValues, setFormValues] = useState({
    image: '',
    location: '',
    name: '',
    startedAt: '', // Default for datetime-local
    endsAt: '', // Default for datetime-local
  });

  const jwt = localStorage.getItem('jwt');

  // Fetch events on mount
  useEffect(() => {
    getAllEvents(jwt);
  }, [jwt]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="mt-4">
        <h3>Events</h3>
        <div className="d-flex flex-wrap gap-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
