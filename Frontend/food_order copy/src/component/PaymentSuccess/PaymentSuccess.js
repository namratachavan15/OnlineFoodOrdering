import { useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import { api } from "../Config/api";

const PaymentSuccess = () => {
  const { orderId } = useParams();
  const [params] = useSearchParams();
  const paymentId = params.get("payment_id");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { data } = await api.get(
          `/api/payments?order_id=${orderId}&payment_id=${paymentId}`
        );
        console.log("✅ Payment verified:", data);
      } catch (err) {
        console.error("❌ Payment verification failed", err);
      }
    };
    verifyPayment();
  }, [orderId, paymentId]);

  return (
    <Container
      fluid
      className="min-vh-100 d-flex justify-content-center align-items-center px-5"
    >
      <Row className="w-100 justify-content-center">
        <Col xs="12" lg="4" className="d-flex flex-column align-items-center">
          <Card
            className="p-5 w-100 rounded"
            style={{
              backgroundColor: "#191919",
              border: "0.5rem solid",
              color: "white",
            }}
          >
            <FaCheckCircle
              size={80}
              color="green"
              style={{ marginLeft: "150px" }}
            />
            <h1 className="py-3 text-center font-weight-bold">
              Payment Successful
            </h1>
            <p className="text-center text-gray-600">
              Thank you for your order!
            </p>
            <Button
              onClick={() => navigate("/")}
              className="w-100 py-3"
              style={{ marginTop: "1rem", backgroundColor: "#E91E63" }}
            >
              Go To Home
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentSuccess;
