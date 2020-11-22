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

const TABLE_PAGE_SIZE = 18
const TABLE_HEADER_HEIGHT = 36
const TABLE_ROW_HEIGHT = 36

const GET_ADDRESSES = gql`
  query getAddresses {
    addresses {
      id
      dawa_id
      name
      name_without_city
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

export async function getServerSideProps(context) {
  return {props: {}}
}

function Addresses(props) {
  const query = hooks.useQuery(GET_ADDRESSES, {fetchPolicy: 'cache-and-network'})
  const router = hooks.useRouter()
  const addresses = React.useMemo(() => {
    const addresses = query.data?.addresses ?? []
    return addresses.map((address) => ({...address, postal_code_and_city: `${address.postal_code} ${address.city}`}))
  }, [query.data?.addresses])

  return (
    <>
      <Head>
        <title>Suitable - Adresser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box display="flex" alignItems="flex-end" justifyContent="space-between">
        <PageHeader>Adresser</PageHeader>
        <NextLink href="/addresses/new" passHref>
          <Button variant="contained" color="primary">
            Tilføj adresse
          </Button>
        </NextLink>
      </Box>
      <Box pt={2} style={{height: TABLE_HEADER_HEIGHT + TABLE_ROW_HEIGHT * TABLE_PAGE_SIZE + 72 + 20}}>
        <DataGrid
          loading={query.loading && !addresses.length}
          // error
          rows={addresses}
          columns={[
            {field: 'postal_code_and_city', headerName: 'By', width: 200, disableClickEventBubbling: true},
            {
              field: 'name_without_city',
              headerName: 'Gade',
              flex: 1,
              disableClickEventBubbling: true,
              renderCell: (params) => {
                return (
                  <NextLink href={'/addresses/' + params.data.id} passHref>
                    <Link>{params.value}</Link>
                  </NextLink>
                )
              },
            },
            // {
            //   field: '',
            //   width: 80,
            //   renderCell: (params) => {
            //     LOG(params)
            //     return <Link href={'/addresses/' + params.data.id}>Vis</Link>
            //   },
            //   disableClickEventBubbling: true,
            // },
            // {field: 'postal_code', headerName: 'Postnummer', width: 120},
            // {field: 'city', headerName: 'By', width: 200},
            // {field: 'street', headerName: 'Gade', width: 420},
            // {field: 'number', headerName: 'Nummer', width: 160},
            // {field: 'floor', headerName: 'Etage', width: 160},
            // {field: 'extra', headerName: 'Dør', width: 160},
          ]}
          pageSize={TABLE_PAGE_SIZE}
          // autoHeight
          headerHeight={TABLE_HEADER_HEIGHT}
          rowHeight={TABLE_ROW_HEIGHT}
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
