import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import BlogForm from '../../src/components/BlogForm';

describe('BlogForm', () => {
   it('submits form with correct data', async () => {
      const createBlogMock = jest.fn();
      const renderComponent = () => {
         return render(<BlogForm createBlog={createBlogMock} />);
      };
      const { getByLabelText, getByText } = renderComponent();

      fireEvent.change(getByLabelText('Title:'), { target: { value: 'Test Title' } });
      fireEvent.change(getByLabelText('URL:'), { target: { value: 'http://example.com' } });

      fireEvent.submit(getByText('Create'));

      await waitFor(() => {
         expect(createBlogMock).toHaveBeenCalledTimes(1);

         expect(createBlogMock).toHaveBeenCalledWith({
            title: 'Test Title',
            url: 'http://example.com',
         });
      });
   });
});
