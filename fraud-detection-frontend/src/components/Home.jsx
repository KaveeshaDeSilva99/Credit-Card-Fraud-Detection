import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    return (
        <Container>
            <h1>Welcome to Tenderring</h1>
            <p>
            Tenderring is your ultimate destination for all things related to tendering. Whether you're a business looking to participate in tenders or an organization seeking bids for your projects, TenderRing has you covered.
            </p>
            <Row>
                <Col>
                    <img
                        src="https://img.freepik.com/free-vector/contract-agreement-isometric-composition-with-human-hand-putting-electronic-signature-blue-background-3d-vector-illustration_1284-78848.jpg?t=st=1710783668~exp=1710787268~hmac=5e67ffaebbefcdf3e60bcadd75c01fff4835b72526ead73637889c98d940bdc4&w=740"
                        alt="TenderRing 1"
                        style={{ width: '79%',height:'60%', marginBottom: '20px' }}
                    />
                    <p>
                        Explore a wide range of tender opportunities from various industries and sectors. With TenderRing, you can easily search, filter, and apply for tenders that match your business needs and capabilities.
                    </p>
                </Col>
                <Col>
                    <img
                        src="https://img.freepik.com/premium-vector/partner-deal-illustration_10250-2688.jpg?w=740"
                        alt="TenderRing 2"
                        style={{ width: '80%',height:'60%', marginBottom: '20px' }}
                    />
                    <p>
                        Our platform provides valuable resources and insights to help you navigate the tendering process with confidence. From tender notices and procurement guidelines to tips for writing winning bids, TenderRing equips you with the knowledge and tools you need to succeed.
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;