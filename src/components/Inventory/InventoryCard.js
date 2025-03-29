import { Button, Card, InputNumber, Typography } from 'antd'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../firebase-config';
const { Text } = Typography

const InventoryCard = ({ id, name, quantity, category }) => {
    const [productName, setProductName] = useState(name);
    const [productQuantity, setProductQuantity] = useState(quantity);
    const [productCategory, setProductCategory] = useState(category);
    const [visibility, setVisibility] = useState(false);
    const [newQuantity, setNewQuantity] = useState(0);


    function onUpdate() {
        setProductQuantity(newQuantity);

        const updateProduct = async (id) => {
            const inventoryRef = doc(db, "inventory", id);
            await updateDoc(inventoryRef, {
                quantity: newQuantity,
            })
        };

        updateProduct(id);
        setVisibility(false); // for hiding controls
        setTimeout(() => {
            window.location.reload();
        }, 1000)
    }

    function onEdit() {
        setVisibility(true); // show the update controls on click
    }

    const onDelete = async () => {
        const userDoc = doc(db, "inventory", id);
        await deleteDoc(userDoc);
        await setTimeout(() => {
            window.location.reload();
        }, 1000)
    };


    return (
        <div className='p-2 drop-shadow-xl  '>
            <Card className='text-center border-gray-300 '
                title={productName}
                style={{
                    backgroundPosition: 'center',
                    // backgroundSize: 'cover',
                    // backgroundRepeat: 'no-repeat',
                    width: 220,

                }} />
            <Text className='text-base' type='warning'>Available <span className='font-bold'>{productQuantity} {productCategory}</span></Text>
            <br />
            {visibility ? (
                <div><InputNumber
                    size="small"
                    min={0}
                    defaultValue={0}
                    onChange={value => setNewQuantity(value)}
                />
                    <Button className='border-2  m-2'
                        onClick={() => onUpdate()}
                    >
                        Update</Button>
                </div>

            ) : (
                <div className='flex'>
                    <Button className='border-2 border-yellow-300 m-1' onClick={() => onEdit()}>Update</Button>
                    <Button className='border-2 border-red-300 m-1 ' onClick={() => onDelete()}>Delete</Button>
                </div>
            )}
        </div>
    );
};

export default InventoryCard;
