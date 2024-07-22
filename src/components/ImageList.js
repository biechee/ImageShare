import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const ImageList = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'images'));
                const imagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log('Fetched images:', imagesData); // 調試用
                setImages(imagesData);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    return (
        <div>
            <h2>Uploaded Images</h2>
            {images.length > 0 ? (
                images.map((image, index) => (
                    <div key={index}>
                        <h3>{image.title}</h3>
                        <p>{image.description}</p>
                        <img src={image.image} alt={image.title} width="300" />
                    </div>
                ))
            ) : (
                <p>No images uploaded yet.</p>
            )}
        </div>
    );
};

export default ImageList;
