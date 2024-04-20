import { useState } from 'react';
import { Container } from './App.styled';
import { Searchbar } from './Searchbar/Searchbar';
import { ToastContainer } from 'react-toastify';
import ImageGallery from './ImageGallery/ImageGallery';
import 'react-toastify/dist/ReactToastify.css';

export function App() {
  const [imgName, setImgName] = useState('');

  return (
    <Container>
      <Searchbar onSubmit={setImgName} />
      <ImageGallery imgInfo={imgName} />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Container>
  );
}
