import React from 'react'
import { Card, CardImg, CardBody, CardTitle, CardText,Button } from 'reactstrap';
import { FaTrashAlt } from 'react-icons/fa';

const EventCard = () => {
  return (
    <Card style={{ width: '18rem', height:'361px' ,backgroundColor:'#191919',border:'0.5rem solid' }} className="mb-4">
      <CardImg 
        top 
        src="https://cdn.pixabay.com/photo/2017/01/13/03/02/burgers-1976198_1280.jpg" 
        alt="Event Image" 
        style={{ height: '150px', objectFit: 'cover' }}
      />
      <CardBody className='text-white'>
        <CardTitle tag="h5">Indian Fast Food</CardTitle>
        <CardText>50% off on your first order</CardText>
        <div className="py-2">
          <p>{"Mumbai"}</p>
          <p className="text-blue-700 small">February 14, 2024 12:00 AM</p>
          <p className="text-danger small">February 15, 2024 12:00 AM</p>
        </div>
      </CardBody>
      {false && (
        <div className="d-flex justify-content-end p-2">
          <Button color="danger">
            <FaTrashAlt /> Delete
          </Button>
        </div>
      )}

    </Card>
  )
}

export default EventCard
