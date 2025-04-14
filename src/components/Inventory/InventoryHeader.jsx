import React from 'react'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Typography } from 'antd'

const { Title, Paragraph } = Typography

const InventoryHeader = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-green-50 p-6 rounded-xl shadow-md mb-6">
      <ShoppingCartOutlined className="text-5xl text-green-600 mb-4" />
      <Title level={2} className="text-green-700">Inventory Management</Title>
      <Paragraph className="max-w-xl text-gray-700">
        Manage your stock effortlessly. Add new products, view available quantity,
        and update or delete items as needed. Stay organized and never run out of stock!
      </Paragraph>
    </div>
  )
}

export default InventoryHeader
