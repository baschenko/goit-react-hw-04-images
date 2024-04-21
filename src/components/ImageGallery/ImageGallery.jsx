import { useEffect, useState } from 'react';
import ImageGaleryErrorView from '../ImageGaleryErrorView/ImageGaleryErrorView';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import ImageGalleryPedingView from '../ImageGalleryPedingView/ImageGalleryPedingView';
import * as API from '../../service/api';
import { Button, ImageGellery } from './ImageGallery.styled';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

export default function ImageGallery({ imgInfo }) {
  const [capture, setCapture] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // обнуляємо стейт, якщо прийшов новий imgInfo
  useEffect(() => {
    setCurrentPage(1);
    setCapture(null);
    setImages([]);
    setError(false);
  }, [imgInfo]);

  useEffect(() => {
    // відключаємо useEffect доки не зявиться imgInfo
    if (!imgInfo) {
      return; 
    }

    // оголошуэмо функцію по запросу фото з серверу
    async function getImages() {
      try {
        setIsLoading(true); //включаємо спінер

        const capture = await API.getImages(imgInfo, currentPage); //запрос на сервер АРІ

        setCapture(capture);//зберегаємо об'єкт картинок з сервера у стейт 

        const totalPages = Math.ceil(capture.totalHits / 12); //розраховуємо кількість сторінок

        if (capture.total === 0) {
          throw new Error(`Oops! "${imgInfo}" - нема таких світлин`); //создаємо error, якщо повернувся пустий об'єкт
        }

        capture &&
          toast.success(
            `Знайдено ${capture.totalHits} світлин. Завантажено: ${currentPage} з ${totalPages} сторінок.` //виводимо повідомлення, кількість фото
          );

        const optimalImages = optimaizerImageList(capture.hits); //создаємо новий об'єкт без зайвої інфи

        setImages(prevImages => [...prevImages, ...optimalImages]); // добавляємо нові фото для виводу у стейт
        setIsLoading(false);                                        //виключаємо спінер
        setShowLoadMore(totalPages === currentPage ? false : true); //визначаємо чи виводити Load More
      } catch (error) {
        setError(error);          //зберыгаэио error у стейт
        setIsLoading(false);      //виключаємо спінер
        setShowLoadMore(false);   //виключаємо Load More

        toast.error(`${error}`);   //виводимо повідомлення з error

        console.log('error', error); //виводимо error у консоль
      }
    }

    getImages(); //запускаємо функцію
  }, [imgInfo, currentPage]);


// оптимызуэмо об'єкт фото
  const optimaizerImageList = images => {
    return images.map(({ id, tags, largeImageURL, webformatURL }) => ({
      id,
      tags,
      largeImageURL,
      webformatURL,
    }));
  };

  const handleClick = () => {
    setCurrentPage(prevState => prevState + 1);
  };

  return (
    <>
      {error && <ImageGaleryErrorView message={error.message} />}

      {capture !== null && (
        <ImageGellery>
          <ImageGalleryItem hits={images} />
        </ImageGellery>
      )}

      {isLoading && <ImageGalleryPedingView />}

      {showLoadMore && (
        <Button type="button" disabled={!showLoadMore} onClick={handleClick}>
          Загрузити ще
        </Button>
      )}
    </>
  );
}

ImageGallery.propTypes = {
  imgInfo: PropTypes.string.isRequired,
};
