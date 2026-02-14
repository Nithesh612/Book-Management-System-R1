"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const BookEdit = () => {
	const [title, settitle] = useState("");
	const [author, setauthor] = useState("");
	const [genre, setgenre] = useState("");
	const [price, setprice] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const router = useRouter();
	const params = useParams();
	const id = params.id;
	const [book, setbook] = useState(null);
	useEffect(() => {
		axios
			.get("http://localhost:5000/books/" + id)
			.then((response) => {
				settitle(response.data.title);
				setauthor(response.data.author);
				setgenre(response.data.genre);
				setprice(response.data.price);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [id]);
	const handleSubmit = (e) => {
		e.preventDefault();
		const bookobj = { title, author, genre, price: price === "" ? 0 : Number(price) };
		axios
			.put("http://localhost:5000/books/" + id, bookobj)
			.then((res) => {
				setSuccessMessage(`"${title}" updated successfully!`);
				setTimeout(() => {
					router.push("/book_read/");
				}, 2000);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	return (
		<div>
			{successMessage && (
				<div className="alert alert-success" role="alert">
					{successMessage}
				</div>
			)}
			<form onSubmit={handleSubmit}>
				<div className="mb-3 mt-3">
					<label htmlFor="title" className="form-label">
						Title
					</label>
					<input
						type="text"
						className="form-control"
						id="title"
						placeholder="Enter Title"
						name="title"
						value={title}
						onChange={(e) => {
							settitle(e.target.value);
						}}
					></input>
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="author" className="form-label">
						Author
					</label>
					<input
						type="text"
						className="form-control"
						id="author"
						placeholder="Enter author"
						name="author"
						value={author}
						onChange={(e) => {
							setauthor(e.target.value);
						}}
					></input>
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="genre" className="form-label">
						Genre
					</label>
					<input
						type="text"
						className="form-control"
						id="genre"
						placeholder="Enter genre"
						name="genre"
						value={genre}
						onChange={(e) => {
							setgenre(e.target.value);
						}}
					></input>
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="price" className="form-label">
						Price
					</label>
					<input
						type="number"
						className="form-control"
						id="price"
						placeholder="Enter price"
						name="price"
						value={price}
						onChange={(e) => {
							setprice(e.target.value);
						}}
					></input>
				</div>
				<button type="submit" className="btn btn-primary me-3">
					Submit
				</button>
				<Link href="/" className="btn btn-primary">
					Home
				</Link>
			</form>
		</div>
	)
}

export default BookEdit