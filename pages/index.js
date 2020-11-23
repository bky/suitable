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

const TABLE_PAGE_SIZE = 15
const TABLE_HEADER_HEIGHT = 36
const TABLE_ROW_HEIGHT = 36
const TABLE_HEIGHT = TABLE_HEADER_HEIGHT + TABLE_ROW_HEIGHT * TABLE_PAGE_SIZE + 72 + 36

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
      <AddressList query={query} />
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
  }, [props.query.data?.addresses])

  const page = +(router.query.page || 1)

  React.useEffect(() => {
    if (router.query.page === undefined) {
      router.push('/?page=1', undefined, {shallow: true})
    }
  }, [router.query.page])

  return (
    <Box pt={2} style={{height: TABLE_HEIGHT}}>
      <DataGrid
        loading={props.query.loading && !addresses.length}
        // error
        rows={addresses}
        columns={[
          {
            field: 'name_without_city',
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
            sortComparator: stringCompare,
          },
          {
            field: 'postal_code_and_city',
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
            router.push('/?page=' + params.page, undefined, {shallow: true})
          }
        }}
      />
    </Box>
  )
}

export default Addresses
