import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
// import userEvent from '@testing-library/user-event';
import Blog from '../../src/components/Blog';

describe('Blog component', () => {
   const blog = {
      _id: '1',
      title: 'Test Blog',
      user: 'Test Author',
      url: 'http://test-url.com',
      likes: 10,
   };
   const userBlogs = ['1'];

   test('renders title and author by default', () => {
      render(<Blog blog={blog} userBlogs={userBlogs} />);
      expect(screen.getByText(`${blog.title} ${blog.user}`)).toBeInTheDocument();

      expect(screen.queryByText(blog.url)).toBeNull();
      expect(screen.queryByText(`likes ${blog.likes}`)).toBeNull();
   });

   test('renders URL and likes when "view" button is clicked', () => {
      render(<Blog blog={blog} userBlogs={userBlogs} />);
      fireEvent.click(screen.getByText('view'));

      expect(screen.getByText(`${blog.title} ${blog.user}`)).toBeInTheDocument();
      expect(screen.getByText(blog.url)).toBeInTheDocument();
      expect(screen.getByText(`likes ${blog.likes}`)).toBeInTheDocument();
   });
   
   test('calls addLike function twice when like button is clicked twice', () => {
      const addLikeMoc = jest.fn(); // Mock the showNotification function
      render(<Blog blog={blog} userBlogs={userBlogs} addLike={addLikeMoc} />);

      // Click the "like" button twice
      fireEvent.click(screen.getByText('view'));
      fireEvent.click(screen.getByText('like'));
      fireEvent.click(screen.getByText('like'));
      // Check that the addLike function is called twice
      expect(addLikeMoc).toHaveBeenCalledTimes(2);
   });
});
