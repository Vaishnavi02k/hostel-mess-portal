import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { toast } from 'react-toastify';
import { PlusCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const InventoryForm = () => {
  const [form] = Form.useForm();
  const userCollectionRef = collection(db, "inventory");

  const onFinish = async (values) => {
    try {
      await addDoc(userCollectionRef, values);
      toast.success("✅ Product added successfully!");
      form.resetFields();
    } catch (error) {
      toast.error("❌ Failed to add product.");
      console.error(error);
    }
    await setTimeout(() => {
      window.location.reload();
    }, 1000); 
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 px-6 py-6 rounded-2xl shadow-xl max-w-6xl mx-auto">

      <Form
        form={form}
        layout="inline"
        name="inventory_form"
        onFinish={onFinish}
        className="flex flex-wrap justify-center gap-4"
      >
        <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center justify-center gap-2">
          Add New Item
        </h2>
        <Form.Item
          name="productName"
          rules={[{ required: true, message: 'Enter product name' }]}
        >
          <Input
            placeholder="Product Name"
            className="rounded-lg border-green-300 focus:border-green-500"
          />
        </Form.Item>

        <Form.Item
          name="quantity"
          rules={[{ required: true, message: 'Enter quantity' }]}
        >
          <Input
            type="number"
            placeholder="Quantity"
            className="rounded-lg border-green-300 focus:border-green-500"
          />
        </Form.Item>

        <Form.Item
          name="category"
          rules={[{ required: true, message: 'Select category' }]}
        >
          <Select
            placeholder="Category"
            style={{ width: 120 }}
            className="rounded-lg border-green-300"
          >
            <Option value="Kg">Kg</Option>
            <Option value="Ltr">Ltr</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-green-500 hover:bg-green-600 transition-all duration-300"
          >
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InventoryForm;
