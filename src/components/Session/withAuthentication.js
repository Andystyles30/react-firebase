import React from 'react';

import { withFirebase } from '../Firebase';
import { connect } from 'react-redux';
import { compose } from 'recompose';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.props.onSetAuthUser(JSON.parse(localStorage.getItem('authUser')));
    }

    componentDidMount = async () => {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        async authUser => {
          if (authUser) {
            localStorage.setItem('authUser', JSON.stringify(authUser));
            this.props.onSetAuthUser(authUser);
            const user = await this.props.firebase.getUserDocument(
              authUser.uid
            );
            this.setState({ user });
          } else {
            localStorage.removeItem('authUser');
            this.props.onSetAuthUser(null);
          }
        }
      );
    };

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  const mapDispatchToProps = dispatch => ({
    onSetAuthUser: authUser => dispatch({ type: 'AUTH_USER_SET', authUser })
  });

  return compose(
    withFirebase,
    connect(null, mapDispatchToProps)
  )(WithAuthentication);
};

export default withAuthentication;
