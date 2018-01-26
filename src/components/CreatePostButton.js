import React from 'react';
import $ from 'jquery';
import { Modal, Button, message } from 'antd';
import { WrappedCreatePostForm } from './CreatePostForm';
import { API_ROOT, TOKEN_KEY, AUTH_PREFIX, POS_KEY } from '../constants';
import { PropTypes } from 'prop-types';
import { LOC_SHAKE} from '../constants'


export class CreatePostButton extends React.Component {
  static propTypes = {
    loadNearbyPosts: PropTypes.func.isRequired,
  }

  state = {
    ModalText: 'Content of the modal',
    visible: false,
    confirmLoading: false,
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    // 1. get value
    // 2. submit form
    // 3. close form
    const form = this.form.getWrappedForm();
    form.validateFields((err, values) => {
      if (err) { return; }
      console.log('Received values of form: ', values);

      // Prepare formData
      const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
      const formData = new FormData();
      formData.set('lat', lat + Math.random() * LOC_SHAKE * 2 - LOC_SHAKE); // adjust offset
      formData.set('lon', lon + Math.random() * LOC_SHAKE * 2 - LOC_SHAKE);
      formData.set('message', form.getFieldValue('message'));
      formData.set('image', form.getFieldValue('image')[0]);

      // Send request
      this.setState({confirmLoading: true});
      $.ajax({
        method: 'POST',
        url: `${API_ROOT}/post`,
        headers: {
          Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
        },
        processData: false,
        contentType: false,
        dataType: 'text',
        data: formData,
      }).then(() => {
        message.success('created a post successfully.');
        form.resetFields();
      }, (error) => {
        message.error(error.responseText);
        form.resetFields();
      }).then(() => {
        this.props.loadNearbyPosts().then(() => {
          this.setState({visible: false, confirmLoading: false});
        });
      }).catch((e) => {
        message.error('create post failed.');
        console.error(e);
      });
    });
  }

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
    const form = this.form.getWrappedForm();
    form.resetFields();
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  render() {
    const { visible, confirmLoading} = this.state;
    return (
        <div>
          <Button type="primary" onClick={this.showModal}>Create New Post</Button>
          <Modal title="Create New Post"
                 visible={visible}
                 onOk={this.handleOk}
                 okText="Create"
                 confirmLoading={confirmLoading}
                 onCancel={this.handleCancel}
                 cancelText="Cancel"
          >
            <WrappedCreatePostForm wrappedComponentRef={this.saveFormRef}/>
          </Modal>
        </div>
    );
  }
}