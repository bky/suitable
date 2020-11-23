import React from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import {gql} from '@apollo/client'
import * as hooks from 'hooks'
import * as utils from 'utils'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import {DataGrid} from '@material-ui/data-grid'
import PageHeader from 'components/PageHeader'

const TABLE_PAGE_SIZE = 15
// const TABLE_ROW_PER_PAGE_OPTIONS = [5, 10, 20]
const TABLE_HEADER_HEIGHT = 36
const TABLE_ROW_HEIGHT = 36

const GET_ADDRESSES = gql`
  query getAddresses {
    addresses {
      id
      dawa_id
      name
      postal_code
      city
      street
      number
      floor
      extra
      lng
      lat
      matrikelnr
    }
  }
`

function Addresses(props) {
  const query = hooks.useQuery(GET_ADDRESSES, {fetchPolicy: 'cache-and-network'})
  const router = hooks.useRouter()
  const orderByString = hooks.useOrderByString()
  const stringCompare = hooks.useStringCompare()
  const addresses = React.useMemo(() => {
    const addresses = query.data?.addresses ?? []
    return orderByString(
      addresses.map((address) => ({
        ...address,
        name_without_city: address.name.replace(`\, ${address.postal_code} ${address.city}`, ''),
        postal_code_and_city: `${address.postal_code} ${address.city}`,
      })),
      (address) => address.name_without_city,
    )
  }, [query.data?.addresses])

  const page = +(router.query.page || 1)

  React.useEffect(() => {
    if (router.query.page === undefined) {
      router.push('/?page=1', undefined, {shallow: true})
    }
  }, [router.query.page])

  return (
    <>
      <Head>
        <title>Suitable - Lejemål</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box display="flex" alignItems="flex-end" justifyContent="space-between">
        <PageHeader>Lejemål</PageHeader>
        <NextLink href="/addresses/new" passHref>
          <Button variant="contained" color="primary">
            Tilføj lejemål
          </Button>
        </NextLink>
      </Box>
      <Box
        pt={2}
        style={{
          // height: Math.max(
          //   10,
          //   // TABLE_HEADER_HEIGHT + TABLE_ROW_HEIGHT * Math.min(TABLE_PAGE_SIZE, addresses.length) + 18,
          //   TABLE_HEADER_HEIGHT + TABLE_ROW_HEIGHT * Math.min(TABLE_PAGE_SIZE, addresses.length) + 72 + 20,
          // ),
          // height: TABLE_HEADER_HEIGHT + TABLE_ROW_HEIGHT * Math.min(TABLE_PAGE_SIZE, addresses.length) + 72 + 36,
          height: TABLE_HEADER_HEIGHT + TABLE_ROW_HEIGHT * TABLE_PAGE_SIZE + 72 + 36,
        }}
      >
        <DataGrid
          loading={query.loading && !addresses.length}
          // error
          rows={addresses}
          columns={[
            {
              field: 'name_without_city',
              headerName: 'Adresse',
              flex: 1,
              disableClickEventBubbling: true,
              renderCell: (params) => {
                return (
                  <NextLink href={'/addresses/' + params.data.id} passHref>
                    <Link>{params.value}</Link>
                  </NextLink>
                )
              },
              sortComparator: stringCompare,
            },
            {
              field: 'postal_code_and_city',
              headerName: 'By',
              width: 200,
              disableClickEventBubbling: true,
            },
          ]}
          pageSize={TABLE_PAGE_SIZE}
          components={{
            noRowsOverlay: () =>
              addresses.length ? null : (
                <Box display="flex" justifyContent="center" mt={40}>
                  <span>Ingen lejemål</span>
                </Box>
              ),
          }}
          // hideFooter
          // rowsPerPageOptions={TABLE_ROW_PER_PAGE_OPTIONS}
          // autoHeight
          headerHeight={TABLE_HEADER_HEIGHT}
          rowHeight={TABLE_ROW_HEIGHT}
          page={addresses.length ? page : 1}
          onPageChange={(params) => {
            if (params.pageCount) {
              router.push('/?page=' + params.page, undefined, {shallow: true})
            }
          }}
          // showColumnRightBorder
          // onRowClick={(param) => {
          //   router.push('/addresses/' + param.data.id)
          // }}
        />
      </Box>
    </>
  )
}

export default Addresses
