import React from 'react'
import MenuTable from './MenuTable'
import './Menu.css'

const Menu = () => {
  return (
    <div className="menu-dashboard">
      <div className="menu-header">
        <h1>Menu Management</h1>
        <p>Manage your restaurant menu items, prices, and availability</p>
      </div>
      <MenuTable />
    </div>
  )
}

export default Menu