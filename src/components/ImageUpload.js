import React, { useState } from 'react';
import { storage, firestore } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const ImageUpload = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            alert('Please select an image to upload.');
            return;
        }

        console.log('Uploading image:', image);

        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                console.log('Upload progress:', snapshot.bytesTransferred, '/', snapshot.totalBytes);
            },
            (error) => {
                console.error('Error uploading image', error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log('Image uploaded, download URL:', downloadURL);
                    await addDoc(collection(firestore, 'images'), {
                        title,
                        description,
                        image: downloadURL,
                        uploadedAt: new Date()
                    });
                    alert('Image uploaded successfully!');
                    setTitle('');
                    setDescription('');
                    setImage(null);
                } catch (error) {
                    console.error('Error adding document', error);
                }
            }
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
                <label>Image:</label>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
            </div>
            <button type="submit">Upload</button>
        </form>
    );
};

export default ImageUpload;
