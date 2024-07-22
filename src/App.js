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
