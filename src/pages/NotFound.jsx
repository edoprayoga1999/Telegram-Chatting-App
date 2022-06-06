import React from 'react';
import '../assets/styles/style.css';
import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<div id="notfound">
			<div className="notfound">
				<div className="notfound-404">
					<h1>404</h1>
				</div>
				<h2 style={{marginBottom: '30px'}}>Oops, The Page you are looking for can&apos;t be found!</h2>
				<Link to="/">
          Return To Homepage
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
