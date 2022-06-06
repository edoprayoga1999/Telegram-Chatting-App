import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export default function GoogleButton() {
	return (
		<>
			<button style={{ width: '80%', backgroundColor: '#FFF', border: '1px solid #7E98DF', borderRadius: '70px', color: '#7E98DF', padding: '20px', marginBottom: '30px' }}>
				<FontAwesomeIcon icon={faGoogle} style={{marginRight: '15px'}}/> Google
			</button>
		</>
	);
}
