import React from "react";
import { Button, Card, CardBody } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFailure = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#0D0D0D" }}
    >
      <Card
        className="text-center p-4 shadow-lg"
        style={{ maxWidth: "450px", backgroundColor: "#1E1E1E", color: "white" }}
      >
        <CardBody>
          <FaTimesCircle size={70} color="#E91E63" className="mb-3" />
          <h2 className="mb-3 text-danger">Payment Failed</h2>
          <p className="text-secondary">
            Oops! Something went wrong while processing your payment.
          </p>
          <p className="text-secondary mb-4">
            Please try again or use another payment method.
          </p>
          <Button
            color="danger"
            onClick={handleGoHome}
            style={{
              backgroundColor: "#E91E63",
              border: "none",
              width: "100%",
            }}
          >
            Go Back to Home
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default PaymentFailure;
