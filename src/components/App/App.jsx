import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getImages } from '../services/getImages';
import { AppBox, Message, MessageQuery } from './App.styled';
import { Button } from '../Button/Button';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { Loader } from '../Loader/Loader';
import { Modal } from '../Modal/Modal';
import { Searchbar } from '../Searchbar/Searchbar';

export function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [totalHits, setTotalHits] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalAlt, setModalAlt] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const data = await getImages(query, page);
        const { hits, totalHits } = data;

        setImages(prevImages => [...prevImages, ...hits]);
        setTotalHits(totalHits);
        setIsLoading(false);
      } catch (error) {
        toast.error('Something went wrong, please try again later');
        setIsLoading(false);
      }
    }

    if (query.trim() !== '') {
      fetchData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page]);

  function handleFormSubmit(object) {
    const { query, page, images } = object;

    setQuery(query);
    setPage(page);
    setImages(images);
  }

  function loadMore() {
    setPage(prevPage => prevPage + 1);
  }

  function toggleModal(modalImage, modalAlt) {
    setShowModal(prevShowModal => !prevShowModal);
    setModalImage(modalImage);
    setModalAlt(modalAlt);
  }

  return (
    <AppBox>
      <Searchbar onSubmit={handleFormSubmit} />
      <ImageGallery openModal={toggleModal} images={images} />
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
      {totalHits / 12 >= page && !isLoading && <Button onClick={loadMore} />}
      {isLoading && <Loader />}
      {totalHits === 0 && (
        <Message>
          Sorry, there are no images matching your search:{' '}
          <MessageQuery>"{query}"</MessageQuery>. Please try again.
        </Message>
      )}
      {showModal && (
        <Modal
          modalImage={modalImage}
          modalAlt={modalAlt}
          closeModal={toggleModal}
        />
      )}
    </AppBox>
  );
}
