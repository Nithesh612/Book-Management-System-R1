'use client' //Client Component
import Link from 'next/link' //Used for client-side navigation between pages in Next.js
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import axios from 'axios' //A library for making HTTP requests (API calls)

const BookList = () => {
    const [bookdata, setBookData] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const gotoview = (id) => {
        router.push("/book_details/" + id);
    };
    useEffect(() => {
        axios.get("http://localhost:5000/books")
            .then((response) => {
                setBookData(response.data);
                setLoading(false);
            })
            .catch((errmsg) => {
                console.log(errmsg);
                setLoading(false);
            })
    }, []);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading books...</p>
            </div>
        );
    }

    return (
        <div>
            <h2>List of Books</h2>
            <Link href="/book_create" className='btn btn-success'>Add New Book</Link><br></br><br></br>
            <table className='table table-bordered table-striped'>
                <thead className="table-dark">
                    <tr><th>TITLE</th><th>ACTION</th></tr>
                </thead>
                <tbody>
                    {
                        bookdata && bookdata.map((book) => (
                            <tr key={book.id}>
                                <td>{book.title}</td>
                                <td><button type='button' className="btn btn-outline-primary" onClick={() => {
                                    gotoview(book.id)
                                }}>View</button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default BookList