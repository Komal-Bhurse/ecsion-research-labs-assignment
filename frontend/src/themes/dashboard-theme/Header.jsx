import React, { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "@/redux/userSlice";
import { persistor } from "@/redux/store";
import axios from "axios";

export default function Header() {
    const dispatch = useDispatch()
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.user);

	const Logout = async () => {
		const loading = toast.loading("Logging Out!");
		try {
			const response = await axios.post(`/api/user/logout`, { withCredentials: true });
			const res = response?.data;
            console.log(res)
			if (res?.massage === "success") {
				persistor.purge();
				dispatch(logout(null));

				toast.dismiss(loading);
				toast.success("Logout Successfull!");
				navigate("/");
			} else {
				toast.dismiss(loading);
				toast.error(res?.error.toString());
			}
		} catch (error) {
			toast.dismiss(loading);
			toast.error(res?.error.toString());
		}
	};

	useEffect(() => {
		 if(!user){
		    navigate("/")
		 }
	}, []);

	return (
		<>
			<header className="container">
				{/* Navbar */}
				<nav className="navbar navbar-expand-lg navbar-light bg-light">
					<div className="container-fluid">
						{/* Left side: Logo */}
						<a className="navbar-brand" href="#">
							<img src="/android-chrome-192x192.png" alt="Logo" className="d-inline-block align-text-top logo" />
						</a>
						{/* Right side: Navigation links and Profile Icon */}
						<div className="d-flex justify-content-end align-items-center">
							{/* Nav Links */}
							<ul className="navbar-nav me-auto mb-2 mb-lg-0">
								<li className="nav-item">
									<span className="nav-link">Hi , {user?.firstName}</span>
								</li>
							</ul>
							{/* Profile Icon and Dropdown */}
							<div className="dropdown">
								<button className="border-0 dropdown-toggle profile-icon" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
									<img src="/assets/profile.jpg" alt="profile" className="profile" />
									{/* You can replace this with an actual icon or initials */}
								</button>
								<ul className="dropdown-menu dropdown-menu-end bg-secondary text-light border-0" aria-labelledby="dropdownMenuButton">
									<li className="text-center">
										<span>[{user?.userType}]</span>
									</li>
									<li className="">
										<span onClick={Logout} className="text-light dropdown-item bg-transparent cursor">
											<i className="fa fa-sign-out" /> Logout
										</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</nav>
			</header>
		</>
	);
}
