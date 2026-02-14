"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const BookDetails = () => {
	const router = useRouter();
	const params = useParams();
	const id = params.id;
	const [book, setbook] = useState({});
	useEffect(() => {
		axios
			.get("http://localhost:5000/books/" + id)
			.then((response) => {
				setbook(response.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [id]);

	const handledelete = () => {
		var conf = confirm("Are you sure");
		if (conf) {
			axios
				.delete("http://localhost:5000/books/" + id)
				.then(() => {
					router.push("/book_read");
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const gotoedit = (id) => {
		router.push("/book_edit/" + id);
	};

	return (
		<div className="container mt-4">
			<h1 className="text-center mb-4">Detailed View</h1>
			<div className="card shadow-lg">
				<header className="bg-dark text-white text-center py-4">
					<h2 className="mb-0">TITLE : {book.title}</h2>
				</header>
				<section className="card-body text-center py-4">
					<div className="mb-3">
						<strong>AUTHOR:</strong> {book.author}
					</div>
					<div className="mb-3">
						<strong>GENRE:</strong> {book.genre}
					</div>
					<div className="mb-3">
						<strong>PRICE:</strong> ${book.price}
					</div>
				</section>
				<footer className="card-footer d-flex justify-content-center gap-3 py-3">
					<button
						type="button"
						onClick={handledelete}
						className="btn btn-danger"
					>
						Delete
					</button>

					<button
						type="button"
						onClick={() => gotoedit(book.id)}
						className="btn btn-warning"
					>
						Edit
					</button>

					<Link href="/" className="btn btn-primary">
						Home
					</Link>
				</footer>
			</div>
		</div>
	);
};

export default BookDetails;