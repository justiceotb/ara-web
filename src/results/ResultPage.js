import React, { Component } from "react";
import {
  Card,
  CardHeader,
  List,
  ListItem,
  PageSection,
  PageSectionVariants
} from "@patternfly/react-core";
import {
  CalendarAltIcon,
  ClockIcon,
  FileAltIcon,
  ServerIcon,
} from "@patternfly/react-icons";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { LoadingPage, Page404 } from "../pages";
import { getResult } from "../results/resultActions";
import PlaybookSummary from "../playbooks/PlaybookSummary"; 
import ReactJson from 'react-json-view'


export class ResultPage extends Component {
  state = {
    isLoading: true,
    result: null
  };

  componentDidMount() {
    this.props
      .getResult({ id: this.props.match.params.id })
      .then(response => this.setState({ result: response.data }))
      .catch(error => console.log(error))
      .then(() => this.setState({ isLoading: false }));
  }

  render() {
    const { isLoading, result } = this.state;
    const { history } = this.props;
    if (isLoading) {
      return <LoadingPage />;
    }
    if (!isLoading && isEmpty(result)) {
      return <Page404 />;
    }
    return (
      <PageSection variant={PageSectionVariants.default}>
        <PlaybookSummary
          key={result.playbook.id}
          playbook={result.playbook}
          history={history}
        />
        <Card className="pf-u-mb-xs">
          <CardHeader>{result.task.name}</CardHeader>
            <span className="pf-u-ml-sm">
                <CalendarAltIcon /> {new Date(result.started).toUTCString()}
            </span>
            <span className="pf-u-ml-sm">
                <ClockIcon /> { result.duration } sec
            </span>
            <span className="pf-u-ml-sm">
                <ServerIcon /> { result.host.name }
            </span>
            <span className="pf-u-ml-sm">
                <FileAltIcon /> { result.task.path }:{ result.task.lineno }
            </span>
          <List>
              <ListItem>Status: { result.status }</ListItem>
              <ListItem>Changed: { result.changed.toString() }</ListItem>
              <ListItem>ignore_errors: { result.ignore_errors.toString() }</ListItem>
          </List>
        </Card>
        <Card className="pf-u-mb-xs">
            <CardHeader>Results</CardHeader>
            <ReactJson src={result.content} />
        </Card>
      </PageSection>
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
)(ResultPage);

