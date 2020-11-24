import React from 'react'
import NextLink from 'next/link'
import {gql} from '@apollo/client'
import * as hooks from 'hooks'
import * as utils from 'utils'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import {DataGrid} from '@material-ui/data-grid'
import Page from 'components/Page'
import {FormattedMessage} from 'react-intl'
import TextField from '@material-ui/core/TextField'

const TABLE_PAGE_SIZE = 15
const TABLE_HEADER_HEIGHT = 36
const TABLE_ROW_HEIGHT = 36
const TABLE_HEIGHT = TABLE_HEADER_HEIGHT + TABLE_ROW_HEIGHT * TABLE_PAGE_SIZE + 94

const GET_ADDRESSES = gql`
  query getAddresses {
    addresses {
      id
      name
      postal_code
      city
    }
  }
`

function Addresses(props) {
  const query = hooks.useQuery(GET_ADDRESSES, {fetchPolicy: 'cache-and-network'})
  const router = hooks.useRouter()
  const [key, setKey] = React.useState(1)

  React.useEffect(() => {
    const callback = (url) => {
      if (url === '/') setKey((key) => key + 1)
    }
    router.events.on('routeChangeComplete', callback)
    return () => {
      router.events.off('routeChangeComplete', callback)
    }
  }, [])

  return (
    <Page
      title={{id: '@t.tenancies_page_title@@'}}
      headerText={{id: '@t.tenancies_header@@'}}
      headerRight={
        <NextLink href="/addresses/new" passHref>
          <Button variant="contained" color="primary">
            <FormattedMessage id="@t.add_tenancy_button@@" />
          </Button>
        </NextLink>
      }
    >
      <AddressList key={key} query={query} />
    </Page>
  )
}

function AddressList(props) {
  const router = hooks.useRouter()
  const orderByString = hooks.useOrderByString()
  const stringCompare = hooks.useStringCompare()
  const intl = hooks.useIntl()

  const addresses = React.useMemo(() => {
    const addresses = props.query.data?.addresses ?? []
    return orderByString(
      addresses.map((address) => ({
        ...address,
        name_without_city: address.name.replace(`\, ${address.postal_code} ${address.city}`, ''),
        postal_code_and_city: `${address.postal_code} ${address.city}`,
      })),
      (address) => address.name_without_city,
    )
  }, [orderByString, props.query.data?.addresses])

  const [page, setPage] = React.useState(() => +(router.query.page || 1))
  const [sortModel, setSortModel] = React.useState(() =>
    router.query.sort ? [{field: router.query.sort.split('__')[0], sort: router.query.sort.split('__')[1]}] : [],
  )

  React.useEffect(() => {
    const query = {page}
    if (sortModel.length > 0) query.sort = `${sortModel[0].field}__${sortModel[0].sort}`
    router.replace({pathname: '/', query})
  }, [page, sortModel])

  const [searchTerm, setSearchTerm] = React.useState('')

  return (
    <Box pt={2} style={{height: TABLE_HEIGHT}}>
      <TextField
        label={intl.formatMessage({id: '@t.new_tenancy_search_placeholder@@'})}
        variant="outlined"
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value)
        }}
      />
      <DataGrid
        loading={props.query.loading && !addresses.length}
        // error
        rows={addresses}
        columns={[
          {
            field: 'address',
            valueGetter: (params) => {
              LOG('valueGetter')
              return params.data.name_without_city
            },
            headerName: intl.formatMessage({id: '@t.address@@'}),
            flex: 1,
            disableClickEventBubbling: true,
            renderCell: (params) => {
              return (
                <NextLink href={'/addresses/' + params.data.id} passHref>
                  <Link style={{width: '100%'}}>{params.value}</Link>
                </NextLink>
              )
            },
            sortComparator: (v1, v2, p1, p2) => stringCompare(p1.data.name_without_city, p2.data.name_without_city),
          },
          {
            field: 'city',
            valueGetter: (params) => params.data.postal_code_and_city,
            headerName: intl.formatMessage({id: '@t.city@@'}),
            width: 200,
            disableClickEventBubbling: true,
          },
        ]}
        pageSize={TABLE_PAGE_SIZE}
        components={{
          noRowsOverlay: () =>
            addresses.length ? null : (
              <Box display="flex" justifyContent="center" mt={40}>
                <span>
                  <FormattedMessage id="@t.no_tenancies_found@@" />
                </span>
              </Box>
            ),
        }}
        headerHeight={TABLE_HEADER_HEIGHT}
        rowHeight={TABLE_ROW_HEIGHT}
        page={addresses.length ? page : 1}
        onPageChange={(params) => {
          if (params.pageCount) {
            setPage(params.page)
          }
        }}
        sortModel={sortModel}
        onSortModelChange={({sortModel}) => {
          setSortModel(sortModel)
        }}
      />
    </Box>
  )
}

export default Addresses
