import React, { Component } from 'react';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      users: {}
    };
  }

  componentDidMount = async () => {
    console.log(await this.props.firebase.users());
    this.setState({ loading: true });

    const { docs } = await this.props.firebase.users();
    this.users = docs.map(doc => {
      const { id } = doc;
      const data = doc.data();
      return { id, ...data };
    });
    console.log('Loaded users', this.users);
    // await this.props.firebase.users().get('value', snapshot => {
    //   this.setState({
    //     users: snapshot.val(),
    //     loading: false
    //   });
    // });
  };
  render() {
    return (
      <div>
        <h1>Admin</h1>
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(withAuthorization(condition))(AdminPage);
