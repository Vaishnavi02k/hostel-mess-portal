import React, { useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase-config';
// import { v4 as uuidv4 } from "uuid";


const InventoryForm = () => {
  const userCollectionRef = collection(db,"inventory");
  const [formData, setFormData] = useState({productName: "", quantity: "", category: "" })
  const onFinish = async (values) => {
    setFormData((prevState) => ({
      ...prevState,
      ...values,
    }));
    await addDoc(userCollectionRef,{...formData});
    setTimeout(function () {
      window.location.reload();
    },300)
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,  // Dynamically updating the specific field
    }));
  };


  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category: value, // Updating category
    }));
  };



  return (
    <Form

      name="customized_form_controls"
      className='flex p-4  flex-wrap mt-30'
      onFinish={onFinish}
    >
      <Form.Item
        label={<span className='dark:text-white'>Product Name</span>}
        name="productName"
        wrapperCol={{ span: 12 }}
        rules={[
          {
            required: true,
            message: 'Please input the Product Name!',
          },
        ]}
      >
        <Input name="productName" value={formData.productName} onChange={handleChange} />
      </Form.Item>
      <Form.Item
        name="quantity"
        label="Quantity"
      >
        <Input name="quantity" value={formData.quantity} onChange={handleChange} />
      </Form.Item>
      <FormItem
        name="category"
        label="Category">
        <Select
          defaultValue="select"
          options={[
            {
              value: 'Kg',
              label: 'Kg',
            },
            {
              value: 'Ltr',
              label: 'Ltr',
            },

          ]}
          onChange={handleSelectChange}
          value={formData.category}
        />
      </FormItem>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default InventoryForm;