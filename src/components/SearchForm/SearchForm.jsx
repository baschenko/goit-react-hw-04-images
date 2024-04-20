import { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Form, Input, Label } from './SearchForm.styled';
import { ImSearch } from 'react-icons/im';
import PropTypes from 'prop-types';

export default function SearchForm({ onSubmit }) {
  const [imgName, setImgName] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    if (imgName.trim() === '') {
      toast.warn('Введите имя поиска', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }
    onSubmit(imgName);
  };

  const handleNameChange = e => {
    setImgName(e.currentTarget.value.toLowerCase());
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Button type="submit">
        <ImSearch />
        <Label>Search</Label>
      </Button>

      <Input
        type="text"
        autoComplete="off"
        value={imgName}
        onChange={handleNameChange}
        autoFocus
        placeholder="Search images and photos"
      />
    </Form>
  );
}

SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
