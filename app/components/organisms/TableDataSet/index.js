/**
 *
 * TableDataSet
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import LoadingIndicator from 'components/LoadingIndicator';
import ErrorMsg from 'components/molecules/ErrorMsg';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import {
  TableBody,
  TableHeaderRow,
  TableHeaderCell,
  TableRow,
  Table,
  TableNoData,
} from '../../molecules/Table/TableElements';
import { ScrollableWrapper } from '../../atoms/ScrollableWrapper';
import TableCell from '../../molecules/Table/TableCell';
import { palette } from '../../../styleUtils/variables';

/* eslint-disable react/prefer-stateless-function */
class TableDataSet extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showIntroAnimation: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.sortBy !== this.props.sortBy ||
      nextProps.orderBy !== this.props.orderBy
    ) {
      this.setState({
        showIntroAnimation: false,
      });
    }
  }

  renderHeader() {
    const headers = [];
    Object.entries(this.props.columns).forEach(([columnId, columnName]) => {
      headers.push(this.renderColumnHeader(columnId, columnName));
    });

    return (
      <thead>
        <TableHeaderRow>{headers}</TableHeaderRow>
      </thead>
    );
  }

  renderColumnHeader(columnId, columnName) {
    const ceilValue =
      typeof this.props.headerConfiguration[columnId] === 'function'
        ? this.props.headerConfiguration[columnId](columnId, columnName)
        : columnName;

    if (
      this.props.sortingColumns.length > 0 &&
      this.props.sortingColumns.lastIndexOf(columnId) !== -1
    ) {
      const order =
        columnId === this.props.sortBy
          ? TableDataSet.reverseOrder(this.props.orderBy)
          : this.props.orderBy;

      const link = `${this.props.link}?page=1&sort=${columnId}&order=${order}`;

      return (
        <TableHeaderCell scope="col" key={`${this.props.name}_${columnId}`}>
          <Link to={link}>
            {ceilValue}
            {columnId === this.props.sortBy
              ? TableDataSet.sortIcon(order)
              : TableDataSet.sortIcon('none')}
          </Link>
        </TableHeaderCell>
      );
    }

    return (
      <TableHeaderCell scope="col" key={`${this.props.name}_${columnId}`}>
        {ceilValue}
      </TableHeaderCell>
    );
  }

  static reverseOrder(order) {
    if (order === 'desc') {
      return 'asc';
    }

    return 'desc';
  }

  static sortIcon(order) {
    if (order === 'none') {
      return <FaSort />;
    } else if (order === 'desc') {
      return <FaSortUp />;
    }

    return <FaSortDown />;
  }

  renderRows() {
    return this.props.data.map(row => this.renderSingleRow(row));
  }

  renderSingleRow(row) {
    const cells = [];
    Object.entries(this.props.columns).forEach(([columnHeader]) => {
      const value = row[columnHeader] !== undefined ? row[columnHeader] : '--';

      const cellValue =
        typeof this.props.ceilConfiguration[columnHeader] === 'function'
          ? this.props.ceilConfiguration[columnHeader](value, row)
          : value;
      cells.push(
        <TableCell
          key={`${row.id}_${columnHeader}_${value.toString()}`}
          columnName={columnHeader}
          value={cellValue}
          breakpoint={this.props.breakpoint}
        />,
      );
    });

    return (
      <TableRow key={`row_${row.id}`} showHoverAnimation>
        {cells}
      </TableRow>
    );
  }

  render() {
    const { error, data, loading, messageNoData, tableMinWidth } = this.props;
    if (error) {
      return <ErrorMsg error={error} />;
    }

    if (loading) {
      return (
        <LoadingIndicator width="100%" height="100vh" bgcolor={palette.white} />
      );
    }

    if (data.length === 0) {
      const message = messageNoData || 'No data to display';
      return (
        <TableNoData>
          <strong>{message}</strong>
        </TableNoData>
      );
    }

    return (
      <ScrollableWrapper>
        <Table
          tableMinWidth={tableMinWidth}
          showIntroAnimation={this.state.showIntroAnimation}
          ref
        >
          {this.renderHeader()}
          <TableBody>{this.renderRows()}</TableBody>
        </Table>
      </ScrollableWrapper>
    );
  }
}

TableDataSet.propTypes = {
  name: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  columns: PropTypes.object.isRequired,
  sortingColumns: PropTypes.array,
  ceilConfiguration: PropTypes.object,
  headerConfiguration: PropTypes.object,
  sortBy: PropTypes.string,
  orderBy: PropTypes.string,
  link: PropTypes.string,
  data: PropTypes.array.isRequired,
  messageNoData: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  tableMinWidth: PropTypes.string,
  breakpoint: PropTypes.object,
};

TableDataSet.defaultProps = {
  sortingColumns: [],
  ceilConfiguration: {},
  headerConfiguration: {},
  sortBy: 'id',
  orderBy: 'desc',
  link: '',
};

export default TableDataSet;
