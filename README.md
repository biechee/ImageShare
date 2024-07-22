# ImageShare

## Firebase
在Firebase中新增專案並且更改Firebase storage和Firestore database兩者的規則

## 前端部分（React）
1. 設置React項目

cmd
```
npx create-react-app image-share-frontend
cd image-share-frontend
npm install axios
```

在 src 目錄中創建 firebase.js 文件，並添加以下代碼：
```
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const firestore = firebase.firestore();

export { storage, firestore, firebase as default };

```

2.  創建圖片上傳和顯示功能

在src目錄中創建components資料夾，並創建ImageUpload.js和ImageList.js

ImageUpload.js
```javascript
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

```


ImageList.js
```javascript
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


```

App.js
```javascript
import React from 'react';
import ImageUpload from './components/ImageUpload';
import ImageList from './components/ImageList';

const App = () => {
    return (
        <div>
            <h1>Image Share</h1>
            <ImageUpload />
            <ImageList />
        </div>
    );
};

export default App;

```

## 串接Firebase資料庫
React中安裝firebase

```
npm install firebase
```

在src資料夾新增firebase.js

firebase.js
```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "AUTH_DOMAIN",
    projectId: "PROJECT_ID",
    storageBucket: "STORAGE_BUCKET",
    messagingSenderId: "MESSAGING_SENDER_ID",
    appId: "APP_ID",
    measurementId: "MEASUREMENT_ID"
};

// Initialize Firebase
// 初始化 Firebase 應用
const app = initializeApp(firebaseConfig);

// 獲取存儲和 Firestore 服務
const storage = getStorage(app);
const firestore = getFirestore(app);

export { storage, firestore };
```

更新 App.js
確保在 App.js 中正確引入並使用 ImageUpload 和 ImageList

App.js
```javascript
import React from 'react';
import ImageUpload from './components/ImageUpload';
import ImageList from './components/ImageList';

const App = () => {
    return (
        <div>
            <h1>Image Share</h1>
            <ImageUpload />
            <ImageList />
        </div>
    );
};

export default App;

```

## 運作 React 伺服
```
npm start
```

