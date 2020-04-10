import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useTable, usePagination} from 'react-table';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import Divider from '@material-ui/core/Divider';

const usePanelSummaryStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  root: {
    backgroundColor: '#201aa220',
    height: '4rem',
  },
}));

const usePanelStyles = makeStyles((theme) => ({
  root: {
    width: 'calc(100%-0.2rem)',
    marginBottom: '0.2rem',
  },
}));
const useItemTextStyles = makeStyles((theme) => ({
  primary: {
    fontFamily: 'Archia',
    fontWeight: 500,
    fontStyle: 'normal',
    fontSize: '13px',
    fontTransform: 'uppercase',
  },
  secondary: {
    fontFamily: 'Archia',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '12px',
    // fontTransform: 'uppercase'
  },
}));

// Wrap a URL/Social media handle/phone number with anchor tag so that that text is clickable
const formatLink = (linkText) => {
  const formatLink = [
    {regexp: /\s*(https?:\/\/.+)\s*/g, replace: '<a href="$1">Link</a>'},
    {
      regexp: /\s*Instagram: @(.+)\s*/g,
      replace: '<a href="https://www.instagram.com/$1">Instagram: @$1</a>',
    },
    {
      regexp: /\s*Facebook: @(.+)\s*/g,
      replace: '<a href="https://www.facebook.com/$1">Facebook: @$1</a>',
    },
    {regexp: /^\s*(\d+)\s*$/, replace: '<a href="tel:$1">$1</a>'},
  ];
  return formatLink.reduce((a, c) => a.replace(c.regexp, c.replace), linkText);
};

const getFormattedLink = (initialValue) => {
  return (
    <div
      className="tablecelldata"
      dangerouslySetInnerHTML={{
        __html: formatLink(initialValue),
      }}
    ></div>
  );
};

const FormattedCell = ({value: initialValue, editable}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(formatLink(initialValue));
  }, [initialValue]);

  return (
    <div
      className="tablecelldata"
      dangerouslySetInnerHTML={{
        __html: value,
      }}
    ></div>
  );
};

function ResourceTable({columns, data, isDesktop}) {
  const classesPannelSummary = usePanelSummaryStyles();
  const classesPanel = usePanelStyles();
  const classesListItemText = useItemTextStyles();
  const defaultColumn = React.useMemo(
    () => ({
      Cell: FormattedCell,
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {pageIndex, pageSize},
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {pageIndex: 0, pageSize: 5},
    },
    usePagination
  );

  // Render the UI for your table
  if (isDesktop === true)
    return (
      <div className="tableandcontrols">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id} {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td key={cell.id} {...cell.getCellProps()}>
                        {cell.render('Cell', {editable: false})}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination">
          <div className="paginationbutton">
            <button
              className="button is-purple"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {'\u003c\u003c'}
            </button>{' '}
            <button
              className="button is-purple"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              {'<'}
            </button>{' '}
            <button
              className="button is-purple"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              {'>'}
            </button>{' '}
            <button
              className="button is-purple"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {'>>'}
            </button>{' '}
          </div>
          <h5 style={{color: '#201aa299'}}>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </h5>
          {/* <h5 style={{marginLeft:'0.2rem'}}>
                     Go to page:{' '}
                </h5> */}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
          />

          <select
            className="select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  else
    return (
      <div className="resourcesaccordion">
        {page.map((row, i) => {
          prepareRow(row);
          return (
            <ExpansionPanel key={row.id} classes={{root: classesPanel.root}}>
              <ExpansionPanelSummary
                classes={{
                  content: classesPannelSummary.content,
                  root: classesPannelSummary.root,
                }}
              >
                {/* <div className="expanelheading"
                                 style={{display: 'flex',
                                         flexDirection: 'row',
                                         justifyContent: 'space-between',
                                         backgroundColor: 'blue'}}> */}
                <div
                  className="orgname"
                  style={{
                    maxWidth: '10rem',
                    textAlign: 'start',
                    color: '#201aa2dd',
                  }}
                >
                  <h6>{row.values['nameoftheorganisation']}</h6>
                </div>
                <div
                  className="orgcategory"
                  style={{maxWidth: '10.9rem', textAlign: 'end'}}
                >
                  <h6>{row.values['category']}</h6>
                </div>
                {/* </div> */}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <List disablePadding={true} dense={true}>
                  <ListItem alignItems="flex-start" dense={true} divider={true}>
                    <ListItemText
                      primary="Organisation Name"
                      secondary={row.values['nameoftheorganisation']}
                      classes={{
                        primary: classesListItemText.primary,
                        secondary: classesListItemText.secondary,
                      }}
                    />
                  </ListItem>
                  <ListItem alignItems="flex-start" dense={true} divider={true}>
                    <ListItemText
                      primary="Location"
                      secondary={row.values['city']}
                      classes={{
                        primary: classesListItemText.primary,
                        secondary: classesListItemText.secondary,
                      }}
                    />
                  </ListItem>
                  <ListItem alignItems="flex-start" dense={true} divider={true}>
                    <ListItemText
                      primary="Description"
                      secondary={row.values['descriptionandorserviceprovided']}
                      classes={{
                        primary: classesListItemText.primary,
                        secondary: classesListItemText.secondary,
                      }}
                    />
                  </ListItem>
                  <ListItem alignItems="flex-start" dense={true} divider={true}>
                    <ListItemText
                      primary="Category"
                      secondary={row.values['category']}
                      classes={{
                        primary: classesListItemText.primary,
                        secondary: classesListItemText.secondary,
                      }}
                    />
                  </ListItem>
                  <ListItem alignItems="flex-start" dense={true} divider={true}>
                    <ListItemText
                      primary="Phonenumber"
                      secondary={getFormattedLink(row.values['phonenumber'])}
                      classes={{
                        primary: classesListItemText.primary,
                        secondary: classesListItemText.secondary,
                      }}
                    />
                  </ListItem>
                  <ListItem alignItems="flex-start" dense={true} divider={true}>
                    <ListItemText
                      primary="Website"
                      secondary={getFormattedLink(row.values['contact'])}
                      classes={{
                        primary: classesListItemText.primary,
                        secondary: classesListItemText.secondary,
                      }}
                    />
                  </ListItem>
                </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
        <div className="pagination">
          <div className="paginationbutton">
            <button
              className="button is-purple"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {'\u003c\u003c'}
            </button>{' '}
            <button
              className="button is-purple"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              {'<'}
            </button>{' '}
            <button
              className="button is-purple"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              {'>'}
            </button>{' '}
            <button
              className="button is-purple"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {'>>'}
            </button>{' '}
          </div>
          <h5 style={{color: '#201aa299'}}>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </h5>
          {/* <h5 style={{marginLeft:'0.2rem'}}>
                     Go to page:{' '}
                </h5> */}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
          />

          <select
            className="select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
}

export default ResourceTable;
