import React from 'react';
import Link from 'next/link';
import Head from '../components/head';
import Nav from '../components/nav';
import dynamic from 'next/dynamic';
import Spinner from '../components/Spinner';
let DynamicMapImport = dynamic(() =>import('../components/Map'), {
	ssr: false,
	loading: () => <Spinner />
});

import './index.scss';
class Home extends React.Component {
	static async getInitialProps({ req }) {
		const isServer = !!req;

		return { isServer };
	}

	render() {
		return (
			<div>
				<Head title="Home" />
				<Nav />

				<div className="example">
					<h1 className="title">Welcome to Next!</h1>
					<p className="description">
						To get started, edit <code>pages/index.js</code> and save to reload.
					</p>
					{!this.props.isServer ? (
						<DynamicMapImport
							app_id
							app_code
							center={{ lat: 52.387532, lng: 18.9434 }}
							zoom="8"
						/>
					) : null}

					<div className="row">
						<Link href="https://open.segment.com/create-next-app">
							<a className="card">
								<h3>Examples &rarr;</h3>
								<p>
									Find other example boilerplates on the <code>create-next-app</code> site
								</p>
							</a>
						</Link>
						<Link href="https://github.com/segmentio/create-next-app">
							<a className="card">
								<h3>Create Next App &rarr;</h3>
								<p>Was this tool helpful? Let us know how we can improve it</p>
							</a>
						</Link>
					</div>
				</div>

				<style jsx>{`
					.hero {
						width: 100%;
						color: #333;
					}
					.title {
						margin: 0;
						width: 100%;
						padding-top: 80px;
						line-height: 1.15;
						font-size: 48px;
					}
					.title,
					.description {
						text-align: center;
					}
					.row {
						max-width: 880px;
						margin: 80px auto 40px;
						display: flex;
						flex-direction: row;
						justify-content: space-around;
					}
					.card {
						padding: 18px 18px 24px;
						width: 220px;
						text-align: left;
						text-decoration: none;
						color: #434343;
						border: 1px solid #9b9b9b;
					}
					.card:hover {
						border-color: #067df7;
					}
					.card h3 {
						margin: 0;
						color: #067df7;
						font-size: 18px;
					}
					.card p {
						margin: 0;
						padding: 12px 0 0;
						font-size: 13px;
						color: #333;
					}
				`}</style>
			</div>
		);
	}
}

export default Home;
