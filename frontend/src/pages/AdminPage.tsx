import React, { useEffect, useState } from 'react';
import Book from '../core/models/Book';
import User from '../core/models/User';
import { PurchaseHistory } from '../core/models/PurchaseHistory';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../core/redux/store';
import { getSelf, getSelfRole } from '../core/api';
import { setUser } from '../core/redux/userSlice';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('purchases');
  const user: User | null = useSelector((state: RootState) => state.user.user);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>();
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newBook, setNewBook] = useState<Book>({
    Id: 0,
    Preview: '',
    Title: '',
    Author: '',
    Description: '',
    Price: 0,
    Genre: '',
  });

  useEffect(() => {
    const token: string | null = localStorage.getItem('token');
    console.log(user);
    const fetch = async () => {
      const _user: User = await getSelf();
      const role: string[] = await getSelfRole();
      const _role: string = role[0]

      if (_role != 'Admin') {
        navigate('/', { replace: true });
      }

      dispatch(setUser({role: _role, ..._user}));
    }

    if (token && !user) {
      fetch();
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="container custom-scrollbar custom-cursor">
      <h1>Admin Page</h1>

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'purchases' ? 'active' : ''}`}
            onClick={() => handleTabChange('purchases')}
          >
            Purchases
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => handleTabChange('books')}
          >
            Books
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
          >
            Users
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'purchases' && (
          <div className="tab-pane fade show active">
            <h2>Purchases</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Book</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
              {purchaseHistory ? purchaseHistory.map((purchase) => {
                const book = books ? books.find((b) => b.Id === purchase.ProductId) : null;
                if (book) {
                  return (
                    <tr key={purchase.Id}>
                      <td>{purchase.Id}</td>
                      <td>{purchase.Timestamp.toString()}</td>
                      <td>{book.Title}</td>
                      <td>{book.Author}</td>
                      <td>{book.Description}</td>
                      <td>{book.Price}</td>
                      <td>{book.Genre}</td>
                    </tr>
                  );
                }
                return null;
              }): ''}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'books' && (
          <div className="tab-pane fade show active">
            <h2>Books</h2>
            <form>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newBook.Title}
                  onChange={(e) => setNewBook({ ...newBook, Title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Author:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newBook.Author}
                  onChange={(e) => setNewBook({ ...newBook, Author: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  className="form-control"
                  value={newBook.Description}
                  onChange={(e) =>
                    setNewBook({ ...newBook, Description: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  className="form-control"
                  value={newBook.Price}
                  onChange={(e) => setNewBook({ ...newBook, Price: parseInt(e.target.value, 10) })}
                />
              </div>
              <div className="form-group">
                <label>Genre:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newBook.Genre}
                  onChange={(e) => setNewBook({ ...newBook, Genre: e.target.value })}
                />
              </div>
              <button type="button" className="btn btn-primary">
                Add Book
              </button>
            </form>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Genre</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.Id}>
                    <td>{book.Id}</td>
                    <td>{book.Title}</td>
                    <td>{book.Author}</td>
                    <td>{book.Description}</td>
                    <td>{book.Price}</td>
                    <td>{book.Genre}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        //onClick={() => deleteBook(book.Id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="tab-pane fade show active">
            <h2>Users</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.Id}>
                    <td>{user.Id}</td>
                    <td>{user.FullName}</td>
                    <td>{user.Email}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        //onClick={() => deleteUser(user.Id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
  );
};

export default AdminPage;