import { Button, Card, InputNumber, Typography } from 'antd';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../../firebase-config';
import { ShoppingCartOutlined } from '@ant-design/icons'; // Example graphic element (icon)
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify and ToastContainer

import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const { Text } = Typography;

const InventoryCard = ({ id, name, quantity, category }) => {
  const [productName, setProductName] = useState(name);
  const [productQuantity, setProductQuantity] = useState(quantity);
  const [productCategory, setProductCategory] = useState(category);
  const [visibility, setVisibility] = useState(false);
  const [newQuantity, setNewQuantity] = useState(0);

  

  function onUpdate() {
    setProductQuantity(newQuantity);

    const updateProduct = async (id) => {
      try {
        const inventoryRef = doc(db, 'inventory', id);
        await updateDoc(inventoryRef, {
          quantity: newQuantity,
        });
        toast.success('Product updated successfully!',{position: "top-right",});
      } catch (error) {
        toast.error('Failed to update product!', {position: "top-right",});
      }
    };

    updateProduct(id);
    setVisibility(false); // for hiding controls
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  function onEdit() {
    setVisibility(true); // show the update controls on click
  }

  const onDelete = async () => {
    try {
      const userDoc = doc(db, 'inventory', id);
      await deleteDoc(userDoc);
      toast.success('Product deleted successfully!',{position: "top-right",});
    } catch (error) {
      toast.error('Failed to delete product!',{position: "top-right",});
    }

    await setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="p-4 drop-shadow-2xl hover:scale-105 transition-all duration-300">
      <Card
        className="text-center border-2 rounded-lg shadow-lg hover:shadow-xl bg-white"
        title={productName}
        style={{
          width: 200,
          height:280,
          boxShadow: '0 8px 15px rgba(0, 0, 0, 0.15)', // Softer shadow for a more elegant look
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* Add Graphic Element here - Image */}
        <img
          src="/inventoryCard.jpg"
          alt={productName}
          className="w-24 h-24 mx-auto mb-4 object-cover "
        />

        <Text className="text-base text-green-600" type="warning">
          Available{' '}
          <span className="font-bold text-green-800">
            {productQuantity} {productCategory}
          </span>
        </Text>
        <br />
        {visibility ? (
          <div>
            <InputNumber
              size="small"
              min={0}
              defaultValue={0}
              onChange={(value) => setNewQuantity(value)}
              className="my-2 p-1 border-2 border-green-300"
              style={{ width: '100%' }}
            />
            <Button
              className="bg-green-600 text-white border-2 border-green-600 hover:bg-green-800 m-2 w-full"
              onClick={() => onUpdate()}
            >
              Update
            </Button>
          </div>
        ) : (
          <div className="flex justify-center space-x-2">
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-500 m-1 w-full"
              onClick={() => onEdit()}
            >
              Update
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white border-2 border-red-600 m-1 w-full"
              onClick={() => onDelete()}
            >
              Delete
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InventoryCard;
