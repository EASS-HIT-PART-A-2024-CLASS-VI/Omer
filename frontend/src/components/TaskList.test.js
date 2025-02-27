import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import TaskList from './TaskList';

// Mock the axios module
jest.mock('axios');

const MockTaskList = () => {
  return (
    <BrowserRouter>
      <TaskList tasks={[]} />
    </BrowserRouter>
  );
};

test('renders task list component', () => {
  render(<MockTaskList />);
  const addTaskButton = screen.getByText('Create New Task');
  expect(addTaskButton).toBeInTheDocument();
}); 