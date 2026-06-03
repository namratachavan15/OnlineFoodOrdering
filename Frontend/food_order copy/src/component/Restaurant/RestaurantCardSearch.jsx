import React from "react";
import { Card, CardImg, CardBody, CardTitle, CardText, Badge } from "reactstrap";
import { FaInstagram, FaTwitter, FaMapMarkerAlt } from "react-icons/fa";

const RestaurantCardSearch = ({ restaurant }) => {
  const address = restaurant.address;
  const contact = restaurant.contactInformation;

  return (
    <Card className="bg-dark text-white border border-secondary shadow-lg h-100">
      <CardImg
        top
        src={restaurant.images?.[0] || "https://via.placeholder.com/400x250?text=No+Image"}
        alt={restaurant.name}
        className="w-100"
        style={{ height: "200px", objectFit: "cover" }}
      />

      <CardBody className="d-flex flex-column">
        <CardTitle tag="h5" className="text-pink">{restaurant.name}</CardTitle>

        <CardText>
          <strong>Cuisine:</strong> {restaurant.cuisineType || "N/A"}
        </CardText>

        <CardText>
          <strong>Description:</strong> {restaurant.description || "No description."}
        </CardText>

        {address && (
          <CardText className="d-flex align-items-center">
            <FaMapMarkerAlt className="text-danger me-2" />
            <span>
              {`${address.streetAddress}, ${address.city}, ${address.state || ""} ${address.postalCode}, ${address.country}`}
            </span>
          </CardText>
        )}

        {contact?.mobile && (
          <CardText><strong>Contact:</strong> {contact.mobile}</CardText>
        )}

        {restaurant.openingHours && (
          <CardText><strong>Hours:</strong> {restaurant.openingHours}</CardText>
        )}

        <div className="mt-auto">
          <Badge color={restaurant.open ? "success" : "danger"}>
            {restaurant.open ? "Open Now" : "Closed"}
          </Badge>
        </div>
      </CardBody>
    </Card>
  );
};

export default RestaurantCardSearch;
