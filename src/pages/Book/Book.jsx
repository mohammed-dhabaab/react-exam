import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BOOKS_API, USERS_API } from '../../api';
import { MdFavorite } from 'react-icons/md';
import { FaReadme } from "react-icons/fa";
import { styles } from '../../styles';

function Book() {
    const { id } = useParams();
    const [books, setBooks] = useState([]);
    const [book, setBook] = useState({});
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const [user, setUser] = useState(null);

    const getUser = async () => {
        try {
            const res = await axios.get(`${USERS_API}/${userId}`);
            setUser(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const getBooks = async () => {
            try {
                const res = await axios.get(BOOKS_API);
                const data = res.data.results.books;
                setBooks(data);

            } catch (error) {
                console.log(error.message);
            }
        };

        getBooks();
        getUser();
    }, [id]);

    useEffect(() => {
        setBook(books.find(book => book.rank == id))
    }, [books])

    const addFav = async (book) => {
        if (!user) return;

        try {
            const isBookFav = user.favorites.find(favBook => favBook.title === book.title)
            if (!isBookFav) {
                const updatedFavBooks = [...user.favorites, book];
                setUser({ ...user, favorites: updatedFavBooks });
                await axios.patch(`${USERS_API}/${userId}`, {
                    favorites: updatedFavBooks
                });
            } else {
                const updatedFavBooks = user.favorites.filter(favBook => favBook.rank != book.rank)
                setUser({ ...user, favorites: updatedFavBooks });
                await axios.patch(`${USERS_API}/${userId}`, {
                    favorites: updatedFavBooks
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const addRead = async (book) => {
        if (!user) return;

        try {
            const isBookFav = user.read.find(favBook => favBook.title === book.title)
            if (!isBookFav) {
                const updatedFavBooks = [...user.read, book];
                setUser({ ...user, read: updatedFavBooks });
                await axios.patch(`${USERS_API}/${userId}`, {
                    read: updatedFavBooks
                });
            } else {
                const updatedFavBooks = user.read.filter(favBook => favBook.rank != book.rank)
                setUser({ ...user, read: updatedFavBooks });
                await axios.patch(`${USERS_API}/${userId}`, {
                    read: updatedFavBooks
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const checkFav = (bookRank) => {
        if (user.favorites.find(book => book.rank == bookRank)) {
            return true
        }
        return false
    }

    const checkRead = (bookRank) => {
        if (user.read.find(book => book.rank == bookRank)) {
            return true
        }
        return false
    }
    if (books.length === 0) {
        return (
            <div className='w-full flex justify-center items-center mx-auto'>
                <span className="loading loading-spinner loading-md"></span>
            </div>
        );
    }

    return (
        <main className='py-10'>
            <div className='max-w-[1200px] mx-auto'>
                <h1 className='text-3xl sm:text-4xl font-bold mx-auto text-center mb-8'>Book Details</h1>

                {book && (
                    <div className="card bg-base-100 max-w-96 shadow-xl mx-auto border border-slate-800">
                        <div className=' pt-5 px-5 overflow-hidden'>
                            <img className='h-full w-full object-contain rounded-md'
                                src={book.book_image}
                                alt="Book Cover" />
                        </div>

                        <div className="card-body">
                            <h2 className="card-title">{book.title}</h2>
                            <p>{book.author}</p>
                            <p className='mb-4'>{book.description}</p>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-3'>
                                    <div title='Add to favorite' onClick={() => addFav(book)} className={`${checkFav(book.rank) ? "text-red-500 fill-current" : ""} ${styles.transition400} hover:text-red-500 cursor-pointer`}>
                                        <MdFavorite size={20} />
                                    </div>
                                    <div title='Add to read' onClick={() => addRead(book)} className={`${checkRead(book.rank) ? "text-blue-500 fill-current" : ""} ${styles.transition400} hover:text-blue-500 cursor-pointer`}>
                                        <FaReadme size={20} />
                                    </div>
                                </div>
                                <a target='_blank' href={book.amazon_product_url} className="btn btn-primary">Purchase</a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default Book;