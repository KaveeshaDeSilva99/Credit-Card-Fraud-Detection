import React from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
    return (
        <footer className="text-black mt-5">
            <Container className="py-3">
                <div className="text-center">
                    <p>&copy; 2024 Tenderring. All rights reserved.</p>

                </div>
            </Container>
        </footer>
    );
};

export default Footer;