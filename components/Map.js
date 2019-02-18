import React, { Component } from 'react';
import window from 'global'

const mySpecialWindowFunction = () => {
    return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
};

const themes = [
	'normal.day',
	'normal.day.grey',
	'normal.day.transit',
	'normal.night',
	'normal.night.grey',
	'reduced.night',
	'reduced.day',
	'pedestrian.day',
	'pedestrian.night'
];

class Map extends Component {
	constructor(props) {
		super(props);

		this.platform = null;
		this.map = null;

		this.state = {
			app_id: props.app_id,
			app_code: props.app_code,
			center: props.center,
			zoom: props.zoom,
			map: null,
			theme: themes[0],
			style: props.style,
			availablePoints: props.availablePoints, //points on map to show with filter or without
			selectedRoute: props.selectedRoute,
			selectedRoutePoints: props.selectedRoutePoints,
			showRoute: props.showRoute
		};
	}

	getPlatform() {
		return new window.H.service.Platform(this.state);
	}

	getMap(container, layers, settings) {
		return new window.H.Map(container, layers, settings);
	}

	getEvents(map) {
		return new window.H.mapevents.MapEvents(map);
	}

	getBehavior(events) {
		return new window.H.mapevents.Behavior(events);
	}

	getUI(map, layers) {
		return new window.H.ui.UI.createDefault(map, layers);
	}

	componentDidMount() {
        try {
            let iInnerHeight = window.innerHeight;
        } catch (oError) {
            console.log(oError);
        }
        // mySpecialWindowFunction();
		this.platform = this.getPlatform();
		let layers = this.platform.createDefaultLayers();
		let element = document.getElementById('here-map');
		this.map = this.getMap(element, layers.normal.map, {
			center: this.state.center,
			zoom: this.state.zoom
		});

		let events = this.getEvents(this.map);
		let behavior = this.getBehavior(events);
		let ui = this.getUI(this.map, layers);
		// this.addMarkersToMap(this.map);
		// this.addPolylineToMap();
		// this.state.showRoute ? this.drawRoute() : this.addAvailablePointsToMap();
		this.drawRoute();
		this.addAvailablePointsToMap();
	}

	shouldComponentUpdate(props, state) {
		this.changeTheme(props.theme, props.style, true);
		return true;
	}

	componentWillUnmount() {
		// this.props.hideRouteOnMap();
	}
	hideRoute = () => {
		this.setState({
			selectedRoute: [],
			showRoute: false
		});
	};

	addAvailablePointsToMap = () => {
		let points = this.state.availablePoints;
		for (let key in points) {
			this.addMarkersToMap(this.map, points[key]);
		}
	};

	addMarkersToMap(map, point) {
        const newPoint = new window.H.map.Marker(point);
		map.addObject(newPoint);
	}

	drawRoute = () => {
		let waypoints = this.props.selectedRoute;

		for (let key in waypoints) {
			if (key >= waypoints.length - 1) return;
			let waypoint0 = `${waypoints[parseInt(key)].lat},${waypoints[parseInt(key)].lng}`;
			let waypoint1 = `${waypoints[parseInt(key) + 1].lat},${waypoints[parseInt(key) + 1].lng}`;
			this.calculateRouteAB(waypoint0, waypoint1);
		}
	};

	addPolylineToMap(map, waypoints) {
        let lineString = new window.H.geo.LineString();
		for (let i in waypoints) {
			lineString.pushPoint(waypoints[i]);
		}

		this.map.addObject(
            new window.H.map.Polyline(lineString, {
				style: { lineWidth: 10 },
				arrows: { fillColor: 'white', frequency: 2, width: 0.8, length: 0.7 }
			})
		);
	}
	changeTheme(theme = this.state.theme, style, value) {
		//obecnie ta funkcja pokazuje ograniczenia dla cięzarówek
		//dodać konkretne ograniczenia wg szczegóowych parametrów
		let tile = value ? 'maptile' : 'trucktile';
		let tiles = this.platform.getMapTileService({
			type: 'base'
		});
		let parameters = {};
		let layer = tiles.createTileLayer(
			tile,
			theme,
			256,
			'png8',
			parameters
			// {'style': 'flame'}
		);
		this.map.setBaseLayer(layer);
	}

	calculateRouteAB(waypoint0, waypoint1) {
		let router = this.platform.getRoutingService();

		const parameters = {
			mode: 'fastest;truck',
			representation: 'display',
			routeattributes: 'waypoints,summary,shape,legs',
			maneuverattributes: 'direction,action',
			waypoint0,
			waypoint1
		};

		router.calculateRoute(parameters, this.routingOnSuccess, this.onError);
	}

	routingOnSuccess = (result) => {
		let route = result.response.route[0];
        let lineString = new window.H.geo.LineString();

		route.shape.forEach(function(point) {
			var parts = point.split(',');
			lineString.pushLatLngAlt(parts[0], parts[1]);
		});

        let polyline = new window.H.map.Polyline(lineString, {
			style: {
				style: { lineWidth: 10 },
				arrows: {
					fillColor: 'white',
					frequency: 2,
					width: 0.8,
					length: 0.7
				}
			}
		});
		this.map.addObject(polyline);
		this.map.setViewBounds(polyline.getBounds(), true);
	};

	onError(error) {
		alert('Ooops!');
	}

	render() {
		return (
			<div
				id="here-map"
				style={{
					width: '900px',
					height: '900px',
					background: 'grey'
				}}
			/>
		);
	}
}

export default Map;
