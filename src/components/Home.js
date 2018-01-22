import React from 'react';
import { Tabs, Button, Spin } from 'antd';
import { GEO_OPTIONS, POS_KEY} from '../constants';

const TabPane = Tabs.TabPane;
const operations = <Button>Extra Action</Button>;


export class Home extends React.Component {
  state = {
    error: '',
    loadingGeoLocation: false,
  }
  componentDidMount() {
    if ("geolocation" in navigator) {
      /* geolocation is available */
      this.setState({loadingGeoLocation: true, error: ''});
      navigator.geolocation.getCurrentPosition(
          this.onSuccessGeoLocation,
          this.onFailedLoadGeoLocation,
          GEO_OPTIONS,
      );
    } else {
      /* geolocation IS NOT available */
      this.setState({ error: "Your browser does not support geo-location!" });
    }
  }

  onSuccessGeoLocation =(position) => {
    console.log(position);
    this.setState({loadingGeoLocation: false, error: ''});
    const { latitude: lat, longitude: lon } = position.coords;
    localStorage.setItem(POS_KEY, JSON.stringify({lat: lat, lon: lon}));
  }

  onFailedLoadGeoLocation = (error) => {
    this.setState({loadingGeoLocation: false, error: "Failed to load geo location"});
  }

  getGalleryPanelContent() {
    if (this.state.error) {
      return <div>{ this.state.error }</div>;
    } else if (this.state.loadingGeoLocation) {
      return <Spin tip="Loading geo location..."/>
    }
    return null;
  }

  render() {
    return (
      <Tabs tabBarExtraContent={operations} className="main-tabs c ">
        <TabPane tab="Post" key="1">
          {this.getGalleryPanelContent()}
        </TabPane>
        <TabPane tab="Map" key="2">
          Content of tab 2
        </TabPane>
      </Tabs>
    );
  }


}