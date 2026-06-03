import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import IngredientTable from './IngredientTable';
import IngredientCategoryTable from './IngredientCategoryTable';
import './Ingredients.css';

const Ingredients = () => {
  return (
    <div className="ingredients-dashboard">
      <Container fluid className="ingredients-container">
        <div className="ingredients-header">
          <h1>Ingredients Management</h1>
          <p>Manage your ingredients inventory and categories</p>
        </div>
        <Row className="ingredients-row">
          <Col xs={12} lg={8} className="ingredients-col">
            <IngredientTable />
          </Col>
          <Col xs={12} lg={4} className="categories-col">
            <IngredientCategoryTable />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Ingredients;