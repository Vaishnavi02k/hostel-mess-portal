import React from 'react'
import InventoryHeader from './InventoryHeader'
import InventoryForm from './InventoryForm'
import InventoryMapCard from './InventoryMapCard'
import { ToastContainer } from 'react-toastify'

const Inventory = () => {
  return (
    <div className="min-h-screen bg-white px-4 md:px-16 py-6">
      {/* Toast container */}
      <ToastContainer autoClose={5000} position="top-right" />

      {/* Header with graphics */}
      <InventoryHeader />

      {/* Form Centered */}
      <div className="flex  flex-row justify-center mb-6">
        <InventoryForm />
      </div>

      {/* Inventory cards */}
      <InventoryMapCard />
    </div>
  )
}

export default Inventory
