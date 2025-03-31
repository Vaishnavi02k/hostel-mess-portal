import React, { useEffect, useState } from 'react'
import InventoryCard from './InventoryCard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';

const InventoryMapCard = () => {
    const [products, setProducts] = useState([]);
    const inventoryRef=collection(db,"inventory");

    useEffect(()=>{
        const getProducts = async()=>{
            const data = await getDocs (inventoryRef);
            console.log(data);
            
            setProducts(data.docs.map((doc)=>({
                ...doc.data(),id:doc.id
            })));
        }
        getProducts();
        // console.log(products);   

    },[])
    return (
        <div className=' dark:bg-gray-900 justify-center grid  min-[550px]:grid-cols-2 max-[763px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
            {
                products.map((product)=>{
                    return(
                        <InventoryCard
                        key={product.id}
                        id={product.id}
                        name={product.productName}
                        quantity={product.quantity}
                        category={product.category}
                        />
                    )
                })
            }
        </div>
    )
}

export default InventoryMapCard