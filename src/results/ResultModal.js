import React, { Component } from "react";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { Button, Card, CardHeader, Modal, List, ListItem } from "@patternfly/react-core";
import { LoadingPage } from "../pages";
import { getResult } from "./resultActions";
import { connect } from "react-redux";

export class ResultModal extends Component {
  state = {
    show: false,
    isLoading: true,
    result: null
  };

  showModal = () => {
    this.setState({ show: true });
  };

  closeModal = () => {
    this.setState({ show: false });
  };

  componentDidMount() {
    this.props
      .getResult({ id: this.props.result.id })
      .then(response => this.setState({ result: response.data }))
      .catch(error => console.log(error))
      .then(() => this.setState({ isLoading: false }));
  }

  render() {
    const { isLoading, show, result } = this.state;
    if (isLoading) {
      return <LoadingPage />;
    }

    return (
      <React.Fragment>
        <Modal
          title={`Task result for ${result.host.name}: ${result.task.name}`}
          isOpen={show}
          onClose={this.closeModal}
          width={'50%'}
          actions={[
            <Button key="cancel" variant="secondary" onClick={this.closeModal}>
              close
            </Button>,
          ]}
        >
          <List>
              <ListItem>Playbook: {result.playbook.name ? result.playbook.name : result.playbook.path}</ListItem>
              <ListItem>Action: { result.task.action }</ListItem>
              <ListItem>Status: { result.status }</ListItem>
              <ListItem>Changed: { result.changed.toString() }</ListItem>
              <ListItem>ignore_errors: { result.ignore_errors.toString() }</ListItem>
              <ListItem>Started: {new Date(result.started).toUTCString()}</ListItem>
              <ListItem>Ended: {new Date(result.started).toUTCString()}</ListItem>
              <ListItem>Duration: { result.duration }</ListItem>
          </List>
          <Card className="pf-u-mb-xs">
              <CardHeader>Content</CardHeader>
              <pre>{JSON.stringify(result.content, null, 2) }</pre>
          </Card>
        </Modal>
        <Button onClick={this.showModal}>
            <ExternalLinkAltIcon />
        </Button>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getResult: result => dispatch(getResult(result))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(ResultModal);
