import React from "react";
import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function index() {
	const error = useRouteError();
	return (
		<>
			<div className="container d-flex align-items-center justify-content-center vh-100">
				<div className="text-center">
					<h1 className="display-1 text-danger">404</h1>
					{isRouteErrorResponse(error) ? (
						<>
							<p className="lead text-muted">Oops! The page you're looking for doesn't exist.</p>
						</>
					) : (
						<p className="lead text-muted">{error?.toString()}</p>
					)}

					<Link to={"/"} className="btn btn-info btn-sm text-dark shadow">
						Go Back to Homepage
					</Link>
				</div>
			</div>
		</>
	);
}
