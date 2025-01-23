import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Link, useNavigate } from 'react-router-dom'
import { APICALL } from '@/hooks/useApiCall.js'
import { useDispatch } from "react-redux";
import { login } from '@/redux/userSlice'

const initialSignUpValues = {
	email: "",
	password: "",
};

const UserSignUpSchema = Yup.object().shape({
	email: Yup.string().matches(
		/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
		'Invalid email'
	)
		.required("Please enter email"),
	password: Yup.string()
		.required("Please enter password"),
});

export default function SignIn({ setToogle }) {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [loading, setLoading] = useState(false);

	const Formik = useFormik({
		initialValues: initialSignUpValues,
		validationSchema: UserSignUpSchema,
		onSubmit: async (values, { resetForm }) => {
			try {
				setLoading(true);
				const resp = await APICALL("post", "/api/user/login", values)
				const res = resp?.data;
			   
				if (res?.massage === "success") {
					toast.success("Sign In successfull")
					resetForm()
					setLoading(false)
					dispatch(login(res?.data))
					navigate("/dashboard/users")
				} else if(res?.massage === "faild") {
					toast.error(res?.error)
					setLoading(false)	
				}else{
					toast.error("Something went wrong")
					setLoading(false)
				}
			} catch (error) {
				toast.error("Sign In Failed Please Try Again");
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
							Sign In
						</button>
					)}
				</div>
			</form>
		</>
	);
}
