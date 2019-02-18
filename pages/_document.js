import Document, { Head } from 'next/document';

export default class MyDocument extends Document {
	render() {
		const { html } = this.props;
		return (
			<html>
				<Head>
					<meta name="viewport" content="initial-scale=1.0, width=device-width" />
					<link
						rel="stylesheet"
						type="text/css"
						href="https://js.api.here.com/v3/3.0/mapsjs-ui.css?dp-version=1549984893"
					/>
					<script type="text/javascript" src="https://js.api.here.com/v3/3.0/mapsjs-core.js" />
					<script type="text/javascript" src="https://js.api.here.com/v3/3.0/mapsjs-service.js" />
					<script type="text/javascript" src="https://js.api.here.com/v3/3.0/mapsjs-ui.js" />
					<script type="text/javascript" src="https://js.api.here.com/v3/3.0/mapsjs-mapevents.js" />
				</Head>
				<body />
			</html>
		);
	}
}
