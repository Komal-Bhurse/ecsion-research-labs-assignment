import React, { useState, useRef } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const UserSignUpSchema = Yup.object().shape({
	firstName: Yup.string().required("Please enter first name"),
	lastName: Yup.string().required("Please enter last name"),
	email: Yup.string()
		.matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email")
		.required("Please enter email"),
    // password: Yup.string()
    // .when('isEdit', {
    //   is: false, // This means it's the add form
    //   then: Yup.string()
    //     .min(8, "Password must be at least 8 characters")
    //     .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    //     .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    //     .matches(/[0-9]/, "Password must contain at least one number")
    //     .matches(/[@$!%*?&]/, "Password must contain at least one special character")
    //     .required("Please enter password"),
    //   otherwise: Yup.string().notRequired(), // If it's the edit form, password is optional
    // }),
});


const getValidationSchema = (isEdit) => {
  return Yup.object().shape({
    firstName: Yup.string().required("Please enter first name"),
    lastName: Yup.string().required("Please enter last name"),
    email: Yup.string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email")
      .required("Please enter email"),
    
    // Password validation is only applied if it's an "add" form
    password: isEdit
      ? Yup.string().notRequired() // If it's an edit form, password is optional
      : Yup.string()
          .min(8, "Password must be at least 8 characters")
          .matches(/[a-z]/, "Password must contain at least one lowercase letter")
          .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
          .matches(/[0-9]/, "Password must contain at least one number")
          .matches(/[@$!%*?&]/, "Password must contain at least one special character")
          .required("Please enter password"),
  });
};

export default function index() {
  const {user} = useSelector(state=>state.user)
	const [toogle, setToogle] = useState(false);
	const [action, setAction] = useState("");
  const [isEdit,setIsEdit] = useState(false)
	const [users, setUsers] = useState([]);
	const [editUser, setEditUser] = useState({});
	const [loading, setLoading] = useState(false);
	const [addLoading, setAddLoading] = useState(false);
	const [editloading, setEditloading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [error, setError] = useState(null);
	const closeRef = useRef(null);

	console.log(users);

	const getAllUsers = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`/api/user/getall/${user?._id}`, { withCredentials: true });
			const res = response?.data;
			console.log(res);
			if (res?.massage === "success") {
				setUsers([...res.data]);
				setLoading(false);
			} else {
				setUsers([]);
				setLoading(false);
				setError(res.error);
			}
		} catch (error) {
			setLoading(false);
			setError(error.toString());
		}
	};

	const handleEdit = (user) => {
    setIsEdit(true)
		setAction("edit");
		setEditUser(user);
	};

	const handleDelete = async (id) => {
		setDeleteLoading(true);
		try {
			const response = await axios.delete(`/api/user/${id}`, { withCredentials: true });
			const res = response?.data;
			if (res?.massage === "success") {
				setToogle((prev) => !prev);
				toast.success("User Deleted");
				setDeleteLoading(false);
			} else {
				toast.error(res?.error);
				setDeleteLoading(false);
			}
		} catch (error) {
			toast.error(res?.error.toString());
			setDeleteLoading(false);
		}
	};

	const handleFormSubmit = async (values, resetForm) => {
		try {
			if (action === "edit") {
        delete values.password
        delete values.isEdit
       
				setEditloading(true);
				const response = await axios.put(`/api/user/${editUser._id}`, values, { withCredentials: true });

				const res = response?.data;
        
				if (res?.massage === "success") {
					toast.success("User Updated");
					setToogle((prev) => !prev);
					handleClose();
					setEditloading(false);
				} else {
					toast.error(res?.error);
					setEditloading(false);
				}
			} else {
       
        values.addedBy = user ? user?._id : ""
				setAddLoading(true);
				const response = await axios.post("/api/user", values, { withCredentials: true });
        
				const res = response?.data;

				if (res?.massage === "success") {
					toast.success("User Added");
					resetForm();
					setToogle((prev) => !prev);
					handleClose();
					setAddLoading(false);
				} else {
					toast.error(res?.error);
					setAddLoading(false);
				}
			}
		} catch (error) {
      console.log("error",error)
			if (action === "edit") {
        const err = error?.response?.data?.error
        if(err){
          toast.error(err);
        }else{
          toast.error(error);
        }
				setEditloading(false);
				
			} else {
        const err = error?.response?.data?.error
        if(err){
          toast.error(err);
        }else{
          toast.error(error);
        }
				setAddLoading(false);
			}
		}
	};

	const handleClose = () => {
		setAction("");
		setEditUser({});
		closeRef && closeRef.current.click();
	};

	const Form = useFormik({
		enableReinitialize: true,
		initialValues: {
			firstName: editUser.firstName || "",
			lastName: editUser.lastName || "",
			email: editUser.email || "",
      password: editUser.password || "",
      isEdit
		},
		validationSchema: ()=>getValidationSchema(isEdit),
		onSubmit: (values, { resetForm }) => {
			handleFormSubmit(values, resetForm);
		},
	});

	useEffect(() => {
		getAllUsers();
	}, [toogle]);

	return (
		<>
			<div className="d-flex align-items-center justify-content-between">
				<p></p>
				<h2 className="text-center fs-5">User Management</h2>
				<button
					onClick={() => {
            setIsEdit(false)
						setAction("");
						setEditUser({});
					}}
					className="btn btn-primary btn-sm text-end"
					data-bs-toggle="modal"
					data-bs-target="#editModal">
					<i className="fa fa-plus" /> Add
				</button>
			</div>
			{/* Table */}
			<table className="table table-bordere">
				<thead>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Email</th>
						<th>Password</th>
						<th className="text-center">Action</th>
					</tr>
				</thead>
				<tbody>
					{loading ? <tr className="text-center">
							<td colSpan={5} className="border-0 py-4">
              <button type="button" id="btn_submit_add_courses" className="btn mb-2  btn-sm bg-transparent rounded-pill">
											<div className="spinner-border spinner-border" role="status"></div>
										</button>
							</td>
						</tr>:users && users?.length > 0 ? (
						users?.map((item) => {
							return (
								<tr key={item?._id}>
									<td>{item?.firstName}</td>
									<td>{item?.lastName}</td>
									<td>{item?.email}</td>
									<td>{item?.password ? item?.password : "*******"}</td>
									<td className="d-flex align-items-center justify-content-center gap-2">
										<button onClick={() => handleEdit(item)} className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editModal">
											<i className="fa fa-edit" />
										</button>

										{deleteLoading ? (
											<button className="btn btn-danger btn-sm">
												<div className="spinner-border spinner-border-sm" role="status"></div>
											</button>
										) : (
											<button
												onClick={() => {
													handleDelete(item?._id);
												}}
												className="btn btn-danger btn-sm">
												<i className="fa fa-trash" />
											</button>
										)}
									</td>
								</tr>
							);
						})
					) : (
						<tr className="text-center">
							<td colSpan={5} className="border-0 py-4">
								No Users Found!
							</td>
						</tr>
					)}
				</tbody>
			</table>
			{/* Modal for Edit Form */}
			<div className="modal fade" id="editModal" tabIndex={-1} aria-labelledby="editModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="editModalLabel">
								Edit User
							</h5>
							<button ref={closeRef} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
						</div>
						<div className="modal-body row justify-content-center">
							{/* Edit Form */}
							<form onSubmit={Form.handleSubmit} className="row" autoComplete={"off"}>
								{/* First Name Field */}
								<div className="form-floating mb-0 col-md-6">
									<input type="text" className="form-control shadow-none border-0 border-bottom" id="firstName" placeholder="First Name" name="firstName" onChange={Form.handleChange} onBlur={Form.handleBlur} value={Form.values.firstName} />
									<label htmlFor="firstName">First Name</label>
									{Form.touched.firstName && Form.errors.firstName ? <p className="text-danger">{Form.errors.firstName}</p> : null}
								</div>
								{/* Last Name Field */}
								<div className="form-floating mb-0 col-md-6">
									<input type="text" className="form-control shadow-none border-0 border-bottom" id="lastName" placeholder="Last Name" name="lastName" onChange={Form.handleChange} onBlur={Form.handleBlur} value={Form.values.lastName} />
									<label htmlFor="lastName">Last Name</label>
									{Form.touched.lastName && Form.errors.lastName ? <p className="text-danger">{Form.errors.lastName}</p> : null}
								</div>
								{/* Email Field */}
								<div className="form-floating  mb-0">
									<input type="email" className="form-control shadow-none border-0 border-bottom" id="email" placeholder="Email" name="email" onChange={Form.handleChange} onBlur={Form.handleBlur} value={Form.values.email} />
									<label htmlFor="email">Email</label>
									{Form.touched.email && Form.errors.email ? <p className="text-danger">{Form.errors.email}</p> : null}
								</div>

								{/* Password Field */}
								{action !== "edit" ? (
									<div className="form-floating mb-3">
										<input type="password" className="form-control shadow-none border-0 border-bottom" id="password" placeholder="Password" name="password" onChange={Form.handleChange} onBlur={Form.handleBlur} value={Form.values.password} />
										<label htmlFor="password">Password</label>
										{Form.touched.password && Form.errors.password ? <p className="text-danger">{Form.errors.password}</p> : null}
									</div>
								) : null}

								{/* Submit Button */}
								<div className="text-center mt-2">
									{action === "edit" ? (
										editloading ? (
											<button type="button" id="btn_submit_add_courses" className="btn mb-2 px-4 fs-6 btn-sm rounded-pill btn-primary mx-2">
												<div className="spinner-border spinner-border-sm" role="status"></div>
											</button>
										) : (
											<button type="submit" id="btn_submit_add_courses" className="btn mb-2 px-4 fs-6 btn-sm rounded-pill btn-primary mx-2">
												Update
											</button>
										)
									) : addLoading ? (
										<button type="button" id="btn_submit_add_courses" className="btn mb-2 px-4 fs-6 btn-sm rounded-pill btn-primary mx-2">
											<div className="spinner-border spinner-border-sm" role="status"></div>
										</button>
									) : (
										<button type="submit" id="btn_submit_add_courses" className="btn mb-2 px-4 fs-6 btn-sm rounded-pill btn-primary mx-2">
											add
										</button>
									)}
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
