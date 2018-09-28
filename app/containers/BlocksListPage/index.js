/**
 *
 * BlocksListPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import config from 'config';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import ListView from 'components/organisms/ListView';

import { makeSelectBlocks } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { loadBlocks } from './actions';
import { Title } from '../../components/atoms/Title';

/* eslint-disable react/prefer-stateless-function */
export class BlocksListPage extends React.PureComponent {
  render() {
    const columns = {
      id: <FormattedMessage {...messages.columnId} />,
      votes: <FormattedMessage {...messages.columnVotes} />,
      message_count: <FormattedMessage {...messages.columnMessageCount} />,
      transaction_count: (
        <FormattedMessage {...messages.columnTransactionCount} />
      ),
      time: <FormattedMessage {...messages.columnTime} />,
    };

    const sortingColumns = ['id'];
    const { match, location, blocks, onPageChange, breakpoint } = this.props;

    return (
      <div>
        <Helmet>
          <title>{this.context.intl.formatMessage(messages.metaTitle)}</title>
          <meta
            name="description"
            content={this.context.intl.formatMessage(messages.metaDescription)}
          />
        </Helmet>
        <Title>
          <FormattedMessage {...messages.header} />
        </Title>
        <ListView
          name="blocks"
          urlParams={match.params}
          query={location.search}
          list={blocks}
          columns={columns}
          sortingColumns={sortingColumns}
          defaultSort="id"
          messages={messages}
          link="/blockexplorer/blocks"
          onPageChange={onPageChange}
          tableMinWidth={config.tablesMinWidth.tableMd}
          breakpoint={breakpoint}
        />
      </div>
    );
  }
}

BlocksListPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object,
  location: PropTypes.object,
  blocks: PropTypes.object.isRequired,
  onPageChange: PropTypes.func,
  breakpoint: PropTypes.object,
};

BlocksListPage.contextTypes = {
  intl: intlShape,
};

const mapStateToProps = state => ({
  ...createStructuredSelector({
    blocks: makeSelectBlocks(),
  })(state),
  breakpoint: state.get('breakpoint'),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onPageChange: (page, sort, order) => {
      const offset = (page - 1) * config.limit;
      return dispatch(loadBlocks(config.limit + 1, offset, sort, order));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'blocksListPage', reducer });
const withSaga = injectSaga({ key: 'blocksListPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(BlocksListPage);
