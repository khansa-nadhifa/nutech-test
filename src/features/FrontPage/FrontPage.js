import React, { useState } from 'react';
import styles from './FrontPage.module.css';
import { Table, Card, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, FormText, Alert } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { addBarang, updateBarang, deleteBarang } from './FrontPageSlice';
import { Formik, Field, Form } from 'formik';

function FrontPage() {
  const dispatch = useDispatch();
  const barang = useSelector((state) => state.barang);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [showTypeWarning, setShowTypeWarning] = useState(false);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // FileReader onLoad event
      reader.onload = () => {
        resolve(reader.result);
      };

      // FileReader onError event
      reader.onerror = () => {
        reject(new Error('Failed to read the file.'));
      };

      // Read the file as data URL (base64 encoded)
      reader.readAsDataURL(file);
    });
  };

  //file upload with restrictions regarding size and type
  const handleFileChange = async (event, setFieldValue) => {
    const file = event.target.files[0];
    const fileSizeKB = file.size / 1024;
    const maxSizeKB = 100;

    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      setShowTypeWarning(true);

      setFieldValue('imgPath', null); // Clear the picture field in Formik

      return;
    }

    if (fileSizeKB > maxSizeKB) {
      setShowSizeWarning(true);
      setFieldValue('imgPath', null);

      return;
    }

    setShowSizeWarning(false);
    const base64 = await fileToBase64(file);
    setFieldValue('imgPath', base64);

  };

  //modal open to add item
  const addItem = () => {
    setModalAdd(true);
  };

  //modal close to add item
  const closeModalAdd = () => {
    setModalAdd(false);
  };

  //handle submit add item
  const handleAdd = (values) => {
    dispatch(addBarang(values));
    setModalAdd(false);
  };

  //modal open to update item and find content based on id
  const updateItem = (itemId) => {
    setModalUpdate(true);
    const item = barang.find((jualan) => jualan.id === itemId);
    setSelectedItem(item);
  };

  //handle submit update item
  const handleFormUpdateSubmit = (itemId) => {
    setModalUpdate(false);
    dispatch(updateBarang(itemId));
    setSelectedItem(null);
  };

  //modal close to update item
  const closeModalUpdate = () => {
    setModalUpdate(false);
  };

  //modal open to delete item and find content based on id
  const deleteItem = (itemId) => {
    setModalDelete(true);
    const item = barang.find((jualan) => jualan.id === itemId);
    setSelectedItem(item);
  };

  //close modal delete item
  const closeModalDelete = () => {
    setModalDelete(false);
  };

  //handle confirmation delete item 
  const handleDelete = (itemId) => {
    dispatch(deleteBarang(itemId));
    setModalDelete(false);
  };

  return (
    <div className='FrontPage'>
      <Card className={styles.card}>
        <Button onClick={() => addItem()}>Add New Item</Button>
        <Table hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Foto Barang</th>
              <th>Nama Barang</th>
              <th>Harga Beli</th>
              <th>Harga Jual</th>
              <th>Stok</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {barang.map((barang) => (
              <tr key={barang.id}>
                <th scope='row'>{barang.id}</th>
                <td>
                  <img src={barang.imgPath} alt={barang.name} className={styles.barangImage}></img>
                </td>
                <td>{barang.name}</td>
                <td>{barang.hargaBeli}</td>
                <td>{barang.hargaJual}</td>
                <td>{barang.stok}</td>
                <td>
                  <Button onClick={() => updateItem(barang.id)}>Update</Button>
                  <br />
                  <br />
                  <Button onClick={() => deleteItem(barang.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* modal add */}
      <Modal isOpen={modalAdd} toggle={closeModalAdd}>
        <ModalHeader toggle={closeModalAdd}>Update Item</ModalHeader>
        <ModalBody>
          {showSizeWarning && <Alert color='danger'>Tolong pilih foto (max 100KB)</Alert>}
          {showTypeWarning && <Alert color='danger'>Hanya diperbolehkan untuk upload foto dengan format JPG dan PNG</Alert>}
          <Formik initialValues={{ imgPath: null, name: '', hargaBeli: '', hargaJual: '', stok: '' }} onSubmit={handleAdd}>
            {({ handleSubmit, setFieldValue, values }) => (
              <Form>
                <FormGroup>
                  <Label for='foto'>Foto barang</Label>
                  <Input name='imgPath' type='file' onChange={(e) => handleFileChange(e, setFieldValue)} />
                  {values.imgPath && <img src={values.imgPath} alt='upload preview' />}
                </FormGroup>
                <FormGroup>
                  <Label for='nama'>Nama barang</Label>
                  <Field as={Input} type='text' name='name' placeholder='Nama Barang' />
                </FormGroup>
                <FormGroup>
                  <Label for='beli'>Harga beli</Label>
                  <Field as={Input} type='number' name='hargaBeli' placeholder='Harga Beli' />
                </FormGroup>
                <FormGroup>
                  <Label for='jual'>Harga jual</Label>
                  <Field as={Input} type='number' name='hargaJual' placeholder='Harga Jual' />
                </FormGroup>
                <FormGroup>
                  <Label for='stok'>Stok</Label>
                  <Field as={Input} type='number' name='stok' placeholder='Stok' />
                </FormGroup>
                <Button color='primary' onClick={handleSubmit} type='submit'>
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={closeModalAdd}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* modal update */}
      <Modal isOpen={modalUpdate} toggle={closeModalUpdate}>
        <ModalHeader toggle={closeModalUpdate}>Update Item</ModalHeader>
        <ModalBody>
          <Formik initialValues={selectedItem} onSubmit={handleFormUpdateSubmit}>
            {({ handleSubmit, setFieldValue, values }) => (
              <Form>
                <FormGroup>
                  <Label for='foto'>Foto barang</Label>
                  <Input name='imgPath' type='file' onChange={(e) => handleFileChange(e, setFieldValue)} />
                  {values.imgPath && <img src={values.imgPath} alt='upload preview' />}
                  <FormText>max 100Kb</FormText>
                </FormGroup>
                <FormGroup>
                  <Label for='nama'>Nama barang</Label>
                  <Field as={Input} type='text' name='name' placeholder={selectedItem?.name ?? ''} />
                </FormGroup>
                <FormGroup>
                  <Label for='beli'>Harga beli</Label>
                  <Field as={Input} type='number' name='hargaBeli' placeholder={selectedItem?.hargaBeli ?? 0} />
                </FormGroup>
                <FormGroup>
                  <Label for='jual'>Harga jual</Label>
                  <Field as={Input} type='number' name='hargaJual' placeholder={selectedItem?.hargaJual ?? 0} />
                </FormGroup>
                <FormGroup>
                  <Label for='stok'>Stok</Label>
                  <Field as={Input} type='number' name='stok' placeholder={selectedItem?.stok ?? 0} />
                </FormGroup>
                <Button color='primary' onClick={handleSubmit} type='submit'>
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={closeModalUpdate}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* modal delete */}
      <Modal isOpen={modalDelete} toggle={closeModalDelete}>
        <ModalHeader toggle={closeModalDelete}>Hapus Barang</ModalHeader>
        <ModalBody>Apa anda yakin ingin menghapus barang?</ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={() => handleDelete(selectedItem.id)}>
            Hapus
          </Button>{' '}
          <Button color='secondary' onClick={closeModalDelete}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default FrontPage;
