import React from 'react';
import { Card, Col } from 'react-bootstrap';

const CarouselItem = ({ image, title }) => {
  return (
    <Col className="text-center">
      <Card.Body>
        <img
          className="rounded-circle"
          src={image}
          alt={title}
          style={{ width: '10rem', height: '10rem', objectFit: 'cover' }}
        />
        <span className="d-block mt-3 white ">{title}</span>
        
      </Card.Body>
    </Col>
  );
};

export default CarouselItem;
