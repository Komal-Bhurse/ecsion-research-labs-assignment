import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function index() {
	const [toogle, setToogle] = useState(true);

	return (
		<>
			<div className="container row m-auto vh-100">
				<div className="card border-0 col-lg-6 col-md-10 m-auto">
					<div className="card-body p-4 shadow">{toogle ? <SignIn toogle={toogle} setToogle={setToogle} /> : <SignUp toogle={toogle} setToogle={setToogle} />}</div>
				</div>
			</div>
		</>
	);
}
