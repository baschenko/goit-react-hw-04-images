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

  useEffect(() => {
    setCurrentPage(1);
    setCapture(null);
    setImages([]);
    setError(false);
  }, [imgInfo]);

  useEffect(() => {
    if (!imgInfo) {
      return;
    }

    setIsLoading(true);

    const capture = API.getImages(imgInfo, currentPage);

    capture
      .then(capture => {
        setCapture(capture);
        const totalPages = Math.ceil(capture.totalHits / 12);

        if (capture.total === 0) {
          throw new Error(`Oops! "${imgInfo}" - нема таких світлин`);
        }

        capture &&
          toast.success(
            `Знайдено ${capture.totalHits} світлин. Завантажено: ${currentPage} з ${totalPages} сторінок.`
          );

        const optimalImages = optimaizerImageList(capture.hits);

        setCapture(capture);
        setImages(prevImages => [...prevImages, ...optimalImages]);
        setIsLoading(false);
        setShowLoadMore(totalPages === currentPage ? false : true);
      })
      .catch(error => {
        setError(error);
        setIsLoading(false);
        setShowLoadMore(false);

        toast.error(`${error}`);

        console.log('error', error);
      });
  }, [imgInfo, currentPage]);

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
