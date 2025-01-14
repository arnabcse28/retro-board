import noop from 'lodash/noop';
import groupBy from 'lodash/groupBy';
import values from 'lodash/values';
import { render, fireEvent } from '../../../../../testing';
import PostItem from '../Post';
import { Post, User, VoteExtract, VoteType } from 'common';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../../Theme';
import { SnackbarProvider } from 'notistack';
import { act } from '@testing-library/react';
import { vi } from 'vitest';

const u = (name: string): User => ({
  name,
  id: name,
  photo: null,
  email: null,
});

const renderWithRouter = (children: React.ReactNode) =>
  render(
    <SnackbarProvider>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={children} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </SnackbarProvider>
  );

function buildVotes(type: VoteType, users: User[], post: Post): VoteExtract[] {
  const grouped = groupBy(users, (u) => u.id);
  return values(grouped).map(
    (group) =>
      ({
        id: 'whatever',
        type,
        userId: group[0].id,
        userName: group[0].name,
      } as VoteExtract)
  );
}

const post: Post = {
  content: 'Foo',
  votes: [],
  user: u('Anne-Claire'),
  id: '1',
  column: 0,
  action: '',
  giphy: null,
  group: null,
  rank: '',
};

post.votes = [
  ...buildVotes('like', ['Charlotte', 'Apolline', 'Armand'].map(u), post),
  ...buildVotes('dislike', ['Didier', 'Danièle'].map(u), post),
];

describe('Post', () => {
  it('Initialise stuff', () => {
    renderWithRouter(
      <PostItem
        post={post}
        index={1}
        onEditGiphy={noop}
        onDelete={noop}
        onDislike={noop}
        onEdit={noop}
        onLike={noop}
        onEditAction={noop}
        onCancelVotes={noop}
        color="#123456"
      />
    );
  });
  it('Should properly display the post content', () => {
    const { getByLabelText } = renderWithRouter(
      <PostItem
        post={post}
        index={1}
        onEditGiphy={noop}
        onDelete={noop}
        onDislike={noop}
        onEdit={noop}
        onLike={noop}
        onEditAction={noop}
        onCancelVotes={noop}
        color="#123456"
      />
    );
    const display = getByLabelText(/post content/i);
    expect(display.textContent).toBe('Foo');
  });

  it('Should let the user like and dislike the post but not delete if he didnt write the post', () => {
    const deleteHandler = vi.fn();
    const likeHandler = vi.fn();
    const dislikeHandler = vi.fn();
    const { getByLabelText, queryByText } = renderWithRouter(
      <PostItem
        post={post}
        index={1}
        onEditGiphy={noop}
        onDelete={deleteHandler}
        onDislike={dislikeHandler}
        onEdit={noop}
        onLike={likeHandler}
        onEditAction={noop}
        onCancelVotes={noop}
        color="#123456"
      />
    );
    const deleteButton = queryByText(/delete/i);
    const likeButton = getByLabelText(/^like/i);
    const dislikeButton = getByLabelText(/dislike/i);

    expect(deleteButton).toBeNull();

    expect(likeButton).toHaveTextContent('3');
    expect(dislikeButton).toHaveTextContent('2');
    act(() => {
      likeButton.click();
    });
    expect(likeHandler).toHaveBeenCalledTimes(1);
    expect(dislikeHandler).not.toHaveBeenCalled();
    act(() => {
      dislikeButton.click();
    });
    expect(dislikeHandler).toHaveBeenCalledTimes(1);

    expect(deleteHandler).not.toHaveBeenCalled();
  });

  it('Should let the user edit the post if the author is the user', () => {
    const customPost: Post = {
      ...post,
      user: u('John Doe'),
    };
    const editHandler = vi.fn();

    const { getByLabelText } = renderWithRouter(
      <PostItem
        post={customPost}
        index={1}
        onEditGiphy={noop}
        onDelete={noop}
        onDislike={noop}
        onEdit={editHandler}
        onEditAction={noop}
        onLike={noop}
        onCancelVotes={noop}
        color="#123456"
      />
    );
    const editableLabel = getByLabelText(/Post content/i);
    act(() => {
      editableLabel.click();
    });

    expect(editHandler).not.toHaveBeenCalled();
    const editableInput = getByLabelText(/post content input/i);
    fireEvent.change(editableInput, { target: { value: 'Bar' } });
    fireEvent.keyPress(editableInput, { keyCode: 13 });
    expect(editHandler).toHaveBeenCalled();
    expect(editHandler).toHaveBeenCalledWith('Bar');
  });

  it('Should NOT let the user edit the post if the author is NOT the user', () => {
    const customPost: Post = {
      ...post,
      user: u('Somebody else'),
    };
    const editHandler = vi.fn();

    const { getByLabelText, queryByLabelText } = renderWithRouter(
      <PostItem
        post={customPost}
        index={1}
        onEditGiphy={noop}
        onDelete={noop}
        onDislike={noop}
        onEdit={editHandler}
        onEditAction={noop}
        onLike={noop}
        onCancelVotes={noop}
        color="#123456"
      />
    );
    const editableLabel = getByLabelText(/post content/i);
    act(() => {
      editableLabel.click();
    });
    const editableInput = queryByLabelText(/post content input/i);
    expect(editableInput).toBeNull();
    expect(editHandler).not.toHaveBeenCalled();
  });
});
