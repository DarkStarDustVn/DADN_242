import { useRouteError } from 'react-router-dom'
import { Helmet } from 'react-helmet-async';
import { NavLink } from 'react-router-dom';
import './ErrorPage.css'

export default function ErrorPage() {
    const error = useRouteError();
    console.log(error);
    return (
        <div id='error-page'>
            <Helmet>
                <title>Bookstore</title>
            </Helmet>
            <h1> Page Not Found!!! </h1>
            <h2> Opps! </h2>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
            <h3>Please return to <NavLink to = "/login" reloadDocument> HomePage </NavLink>  </h3>
        </div>
    )
}