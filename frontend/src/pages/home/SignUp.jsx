import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Link } from 'react-router-dom'
import { APICALL } from '@/hooks/useApiCall.js'

const initialSignUpValues = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
};

const UserSignUpSchema = Yup.object().shape({
	firstName: Yup.string().required("Please enter first name"),
	lastName: Yup.string().required("Please enter last name"),
	email: Yup.string().matches(
		/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
		'Invalid email'
	)
		.required("Please enter email"),
	password: Yup.string().min(8, 'Password must be at least 8 characters')
		.matches(/[a-z]/, 'Password must contain at least one lowercase letter')
		.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.matches(/[0-9]/, 'Password must contain at least one number')
		.matches(/[@$!%*?&]/, 'Password must contain at least one special character')
		.required("Please enter password"),
});

export default function SignUp({ setToogle }) {

	const [loading, setLoading] = useState(false);

	const Formik = useFormik({
		initialValues: initialSignUpValues,
		validationSchema: UserSignUpSchema,
		onSubmit: async (values, { resetForm }) => {
			try {
				setLoading(true);
				const res = await APICALL("post", "/api/user", values)
				if (res?.massage === "success") {
					toast.success("Sign up successfull")
					resetForm()
					setLoading(false)
					setToogle(true)

				}else{
					toast.error(res?.error)
					setLoading(false)
				}
			} catch (error) {
				toast.error("Signup Failed Please Try Again");
				setLoading(false);
			}
		},
	});

	return (
		<>
			<div className="text-center">
				<img src="/android-chrome-192x192.png" alt="logo" className="logo" />
			</div>
			<form className=" row m-auto" onSubmit={Formik.handleSubmit} autoComplete={"off"}>
				<>
					{/* First Name Field */}
					<div className="form-floating mb-0 col-md-6">
						<input type="text" className="form-control shadow-none border-0 border-bottom" id="firstName" placeholder="First Name" name="firstName" onChange={Formik.handleChange} onBlur={Formik.handleBlur} value={Formik.values.firstName} />
						<label htmlFor="firstName">First Name</label>
						{Formik.touched.firstName && Formik.errors.firstName ? <p className="text-danger">{Formik.errors.firstName}</p> : null}
					</div>
					{/* Last Name Field */}
					<div className="form-floating mb-0 col-md-6">
						<input type="text" className="form-control shadow-none border-0 border-bottom" id="lastName" placeholder="Last Name" name="lastName" onChange={Formik.handleChange} onBlur={Formik.handleBlur} value={Formik.values.lastName} />
						<label htmlFor="lastName">Last Name</label>
						{Formik.touched.lastName && Formik.errors.lastName ? <p className="text-danger">{Formik.errors.lastName}</p> : null}
					</div>
					{/* Email Field */}
					<div className="form-floating  mb-0">
						<input type="email" className="form-control shadow-none border-0 border-bottom" id="email" placeholder="Email" name="email" onChange={Formik.handleChange} onBlur={Formik.handleBlur} value={Formik.values.email} />
						<label htmlFor="email">Email</label>
						{Formik.touched.email && Formik.errors.email ? <p className="text-danger">{Formik.errors.email}</p> : null}
					</div>
					{/* Password Field */}
					<div className="form-floating mb-3">
						<input type="password" className="form-control shadow-none border-0 border-bottom" id="password" placeholder="Password" name="password" onChange={Formik.handleChange} onBlur={Formik.handleBlur} value={Formik.values.password} />
						<label htmlFor="password">Password</label>
						{Formik.touched.password && Formik.errors.password ? <p className="text-danger">{Formik.errors.password}</p> : null}
					</div>
				</>

				{/* Submit Button */}
				<div className="text-center">
					{loading ? (
						<button type="button" id="btn_submit_add_courses" className="btn mb-2 px-4 fs-6 btn-sm rounded-pill btn-primary mx-2">
							<div className="spinner-border spinner-border-sm" role="status"></div>
						</button>
					) : (
						<button type="submit" id="btn_submit_add_courses" className="btn mb-2 px-4 fs-6 btn-sm rounded-pill btn-primary mx-2">
							Sign Up
						</button>
					)}
					<p className=" d-flex align-items-center justify-content-center gap-2"><span>Already have an account?</span> <Link onClick={()=>setToogle(true)} to={"/"} className="">Sign In</Link></p>
				</div>
			</form>
		</>
	);
}
