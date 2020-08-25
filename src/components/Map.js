import React, { Component } from "react";
import OlMap from "ol/Map";
import OlView from "ol/View";
import OlLayerTile from "ol/layer/Tile";
import OlSourceOSM from "ol/source/OSM";
import Circle from "ol/style/Circle"
import {Vector} from "ol/layer"
import VectorSource from "ol/source/Vector"
import {fromLonLat} from 'ol/proj';
import {Fill,Style} from "ol/style"
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import 'ol/ol.css';


class Map extends Component {


  constructor(props) {
    super(props);
    // console.log(props)
    if(props.type === "view" || props.type === "update"){
        this.state = {center: props.center, zoom:10 ,loc:props.center}
    }
    else{
        this.state = { center: [0, 0], zoom: 2 ,loc:undefined};
        
    }

    // var style = new Style ({
    //     image:new Circle({
    //         radius:10,
    //         fill: new Fill({
    //             color:`rgba(255,50,50,0.4)`
    //         })
    //     })
    // })

    var vectorLayer;

    if(props.type === "view" || props.type ==="update"){
        var feature = new Feature({
            geometry: new Point(this.state.loc),
            name: 'point',
          });
    
          var vectorSource = new VectorSource({
            features: [feature],
          });
    
          var vectorLayer = new Vector({
            source: vectorSource,
          });
    }
    else{
          var vectorSource = new VectorSource({
            features: [],
          });
    
          var vectorLayer = new Vector({
            source: vectorSource,
          });

    }



    this.olmap = new OlMap({
      target: null,
      layers: [
        new OlLayerTile({
          source: new OlSourceOSM()
        }), vectorLayer
      ],
      view: new OlView({
        center: this.state.center,
        zoom: this.state.zoom
      })
    });

    if(props.type !== "view")
        this.olmap.on('click',evt=>{
            // console.log(evt.coordinate)
            this.olmap.getLayers().array_[1].setSource(new VectorSource({
            features: [new Feature({
                geometry: new Point(evt.coordinate),
                name: 'point',
                })],
            }))
            props.onSelect(evt.coordinate);
            this.setState({loc:evt.coordinate});
        
    })
    
  }

  updateMap() {
    // console.log('constant update????'+this.state.center)
    this.olmap.getView().setCenter(this.state.center);
    this.olmap.getView().setZoom(this.state.zoom);
  }


  componentDidMount() {
    this.olmap.setTarget("map");

    // Listen to map changes
    this.olmap.on("moveend", () => {
        console.log("moveend")
      let center = this.olmap.getView().getCenter();
      let zoom = this.olmap.getView().getZoom();
      this.setState({ center, zoom });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    let center = this.olmap.getView().getCenter();
    let zoom = this.olmap.getView().getZoom();
    if (center === nextState.center && zoom === nextState.zoom) return false;
    return true;
  }

  getSelectedLocation(){
      return this.state.loc;
  }
 

  render() {
    this.updateMap(); // Update map on render?
    return (
      <div id="map" style={{ width: "100%", height: "360px" }}>
      </div>
    );
  }
}

export default Map;
