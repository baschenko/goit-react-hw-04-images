import Modal from 'components/Modal';
import { useState } from 'react';
import { Image } from './ImageCard.styled';
import PropTypes from 'prop-types';

export default function ImageCard({ hit }) {
  const [isModal, setIsModal] = useState(false);

  const toggleModal = () => {
    setIsModal(prevState => !prevState);
  };

  return (
    <>
      <Image src={hit.webformatURL} alt={hit.tags} onClick={toggleModal} />
      {isModal && (
        <Modal onClose={toggleModal}>
          <img src={hit.largeImageURL} alt={hit.tags} />
        </Modal>
      )}
    </>
  );
}

ImageCard.propTypes = {
  hit: PropTypes.exact({
    webformatURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
  }),
};
