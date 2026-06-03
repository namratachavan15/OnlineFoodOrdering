import React from 'react';
import MenuTable from './../Menu/MenuTable';
import OrderTable from '../Orders/OrderTable';
import { Container, Row, Col } from 'reactstrap';

const Dashboard = () => {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col xs="12">
          <div className="table-responsive">
            <MenuTable />
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <div className="table-responsive">
            <OrderTable filterValue={"ALL"} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;